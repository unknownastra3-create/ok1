import express from 'express';
import type { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import { profanityDetectorMiddleware, evaluateProfanity } from './server/profanityMiddleware.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();
  const server = http.createServer(app);

  app.use(express.json());

  // WebSocket Server for Realtime Communication
  const wss = new WebSocketServer({ server, path: '/ws/realtime' });
  const wsClients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    wsClients.add(ws);
    ws.send(JSON.stringify({ type: 'CONNECTED', message: 'Realtime connected to Teachers Day Hub' }));

    ws.on('message', (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.type === 'PING') {
          ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
          return;
        }
        broadcastRealtime(parsed, ws);
      } catch (e) {
        console.error('Error handling WS message:', e);
      }
    });

    ws.on('close', () => {
      wsClients.delete(ws);
    });

    ws.on('error', (err) => {
      console.warn('WS client error:', err);
      wsClients.delete(ws);
    });
  });

  // Server-side WebSocket heartbeat to prevent Cloud Run idle timeout
  setInterval(() => {
    for (const ws of wsClients) {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.ping();
        } catch {
          wsClients.delete(ws);
        }
      }
    }
  }, 25000);

  // SSE (Server-Sent Events) clients set for environments where WebSockets might be restricted
  const sseClients = new Set<Response>();

  app.get('/api/realtime/stream', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    sseClients.add(res);
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'SSE stream connected' })}\n\n`);

    req.on('close', () => {
      sseClients.delete(res);
    });
  });

  // SSE keepalive ping every 20s
  setInterval(() => {
    for (const res of sseClients) {
      try {
        res.write(': keepalive\n\n');
      } catch {
        sseClients.delete(res);
      }
    }
  }, 20000);

  // Helper to broadcast realtime events to both WebSocket & SSE clients
  const broadcastRealtime = (event: any, senderWs?: WebSocket) => {
    const payload = JSON.stringify(event);

    // Broadcast to WebSockets
    for (const client of wsClients) {
      if (client !== senderWs && client.readyState === WebSocket.OPEN) {
        try {
          client.send(payload);
        } catch (err) {
          console.warn('WS broadcast error:', err);
        }
      }
    }

    // Broadcast to SSE
    for (const res of sseClients) {
      try {
        res.write(`data: ${payload}\n\n`);
      } catch (err) {
        sseClients.delete(res);
      }
    }
  };

  // POST /api/moderate/note - Server-side profanity detection & moderation middleware
  app.post('/api/moderate/note', (req: Request, res: Response) => {
    const { studentName, grade, subject, message } = req.body;
    const moderation = evaluateProfanity({ studentName, grade, subject, message });

    if (!moderation.allowed) {
      // Automatically prevent submission
      broadcastRealtime({
        type: 'SUBMISSION_BLOCKED',
        target: 'note',
        studentName: studentName || 'Student',
        reason: moderation.reason,
        timestamp: Date.now(),
      });

      return res.status(400).json({
        success: false,
        status: 'blocked',
        error: 'Submission prevented: Inappropriate or offensive language detected.',
        details: moderation.reason,
        flaggedWords: moderation.flaggedWords,
      });
    }

    const noteStatus = moderation.status; // 'approved' or 'flagged'

    // Realtime notification
    broadcastRealtime({
      type: noteStatus === 'flagged' ? 'NOTE_FLAGGED' : 'NOTE_APPROVED',
      status: noteStatus,
      studentName,
      subject,
      reason: moderation.reason,
      timestamp: Date.now(),
    });

    return res.json({
      success: true,
      status: noteStatus,
      flaggedReason: moderation.reason,
      flaggedWords: moderation.flaggedWords,
    });
  });

  // POST /api/moderate/letter - Server-side profanity detection & moderation for letters
  app.post('/api/moderate/letter', (req: Request, res: Response) => {
    const { studentName, grade, title, body, recipientTeacherName } = req.body;
    const moderation = evaluateProfanity({ studentName, grade, title, body, subject: recipientTeacherName });

    if (!moderation.allowed) {
      broadcastRealtime({
        type: 'SUBMISSION_BLOCKED',
        target: 'letter',
        studentName: studentName || 'Student',
        reason: moderation.reason,
        timestamp: Date.now(),
      });

      return res.status(400).json({
        success: false,
        status: 'blocked',
        error: 'Submission prevented: Inappropriate language detected in letter.',
        details: moderation.reason,
        flaggedWords: moderation.flaggedWords,
      });
    }

    const letterStatus = moderation.status;

    broadcastRealtime({
      type: letterStatus === 'flagged' ? 'LETTER_FLAGGED' : 'LETTER_APPROVED',
      status: letterStatus,
      studentName,
      title,
      timestamp: Date.now(),
    });

    return res.json({
      success: true,
      status: letterStatus,
      flaggedReason: moderation.reason,
      flaggedWords: moderation.flaggedWords,
    });
  });

  // POST /api/realtime/broadcast - General event relay
  app.post('/api/realtime/broadcast', (req: Request, res: Response) => {
    const event = req.body;
    if (event && event.type) {
      broadcastRealtime(event);
    }
    return res.json({ success: true });
  });

  // Vite Integration:
  // In dev: mount vite.middlewares
  // In prod: serve dist
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server and Realtime Hub running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
