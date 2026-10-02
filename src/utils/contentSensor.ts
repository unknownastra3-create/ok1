/**
 * Content Sensor & Positivity Safety Filter (Production Hardened for Publication)
 * Enforces community guidelines for Teacher's Day notes & letters.
 * 
 * Detects:
 * 1. English, Filipino/Tagalog, and regional profanity, slurs, sexual terms, and harassment
 * 2. Obfuscated words (l33tspeak, character-separated like "f u c k", repeated characters like "fuuuuck")
 * 3. Cyrillic/homoglyph letter replacements
 * 4. Spam links, advertising, and phone numbers
 * 5. "Unknown" or generic placeholder inputs in Name, Grade, Section, or Recipient
 */

export const INAPPROPRIATE_WORDS = [
  // --- English Profanity, Vulgarity & Slurs ---
  'fuck', 'fucking', 'fucked', 'fucker', 'fuckers', 'fuk', 'fvck', 'f*ck', 'f**k', 'fck', 'fckin', 'fcku',
  'motherfucker', 'motherfucking', 'mofo', 'mf',
  'shit', 'shitty', 'bullshit', 'sh*t', 'sh!t', 'shite', 'dipshit', 'horseshit',
  'bitch', 'bitches', 'bitching', 'b*tch', 'b!tch', 'son of a bitch',
  'asshole', 'assholes', 'a**hole', 'ass', 'a$$', 'dumbass', 'jackass', 'fatass', 'badass',
  'cunt', 'cunts', 'c*nt',
  'dick', 'dicks', 'd*ck', 'd!ck', 'penis', 'cock', 'cocks', 'c*ck', 'dickhead',
  'pussy', 'pussies', 'p*ssy', 'pu$$y', 'vagina',
  'bastard', 'bastards', 'slut', 'sluts', 'whore', 'whores', 'wh*re', 'hoe', 'hoes',
  'faggot', 'fag', 'fags', 'dyke', 'nigger', 'nigga', 'niggers', 'niggas', 'n*gger', 'n*gga',
  'retard', 'retarded', 'spastic',
  'porn', 'porno', 'xxx', 'boobs', 'tits', 'titties', 'nude', 'nudes', 'sex', 'blowjob', 'handjob',
  'wanker', 'prick', 'twat', 'scumbag', 'douche', 'douchebag',

  // --- Threatening, Harassment, & Harmful Language ---
  'kill yourself', 'kys', 'die in a fire', 'i hope you die', 'hang yourself', 'rot in hell',
  'go to hell', 'drop dead', 'hate you', 'ugly teacher', 'trash teacher', 'worst teacher',
  'terrible teacher', 'suck my', 'eat shit', 'eat dirt', 'fuck off', 'piss off',
  'stfu', 'shut the fuck up', 'shut up', 'loser', 'kill you', 'burn in hell',

  // --- Filipino / Tagalog & Philippine Regional Profanities ---
  'tangina', 'tang ina', 'putangina', 'putang ina', 'potangina', 'potang ina',
  'tanginamo', 'tangina mo', 'putanginamo', 'putang ina mo', 'taena', 'tae ka', 't@ngina',
  'pakshet', 'paksit', 'pakyu', 'fakyu', 'pakyow',
  'puta', 'punyeta', 'pucha', 'punyemas', 'pvtang',
  'gago', 'gag0', 'gaga', 'tarantado', 'tarantada', 'ulol', 'ulul', 'ogag',
  'bobo', 'b0b0', 'bubu', 'inutil', 'tanga', 'engot', 'ugok', 'siraulo', 'sira ulo', 'gunggong', 'hudas',
  'kupal', 'tae', 'leche', 'letse', 'hayop', 'hayop ka', 'lintik', 'salot', 'buwisit', 'bwisit',
  'hindot', 'pokpok', 'bayag', 'tamod', 'kantot', 'kantutan', 'iyot', 'iyotan', 'burikat',
  'jakol', 'tite', 'titi', 'burat', 'puke', 'puki', 'pepe', 'kiffy', 'kipay', 'pekpek', 'bilat', 'suso',
  'yawa', 'pisting yawa', 'piste', 'oten', 'kayat', 'libog', 'maniakis', 'manyak',
  'mamatay ka', 'walang kwenta', 'barumbado', 'ampota', 'amputa', 'bwiset',
];

// Placeholder keywords that violate authentic student tribute requirement
export const PLACEHOLDER_TERMS = [
  'unknown',
  'unknown student',
  'student unknown',
  'mr unknown',
  'ms unknown',
  'grade unknown',
  'section unknown',
  'anonymous',
  'anon',
  'nobody',
  'no one',
  'none',
  'n/a',
  'na',
  'idk',
  'i dont know',
  'i don\'t know',
  'who cares',
  'whatever',
  'blank',
  'nothing',
  'no name',
  'asdf',
  'qwerty',
  'test',
  'testing',
  'admin',
  'administrator',
  'secret',
  'someone',
];

/**
 * Normalizes text to defeat simple leetspeak, spacing bypasses, repeated characters, and unicode homoglyphs
 */
export function normalizeText(raw: string): string {
  if (!raw) return '';
  let str = raw.toLowerCase();

  // Cyrillic / Homoglyph mapping
  str = str
    .replace(/[аa@]/g, 'a')
    .replace(/[еe3]/g, 'e')
    .replace(/[іi!1|]/g, 'i')
    .replace(/[оo0]/g, 'o')
    .replace(/[рp]/g, 'p')
    .replace(/[сs$5]/g, 's')
    .replace(/[уy]/g, 'y')
    .replace(/[хx]/g, 'x')
    .replace(/[тt7+]/g, 't')
    .replace(/[вb8]/g, 'b');

  // Collapse 3 or more consecutive identical characters to 1 (e.g. "fuuuuck" -> "fuck", "tangaaaa" -> "tanga")
  str = str.replace(/(.)\1{2,}/g, '$1');

  // Remove common punctuation used to break words up (e.g. "f.u.c.k", "b-o-b-o")
  const strippedPunct = str.replace(/[-_.*#~^\\/,|;:<>`'"]/g, '');

  return strippedPunct.trim();
}

/**
 * Checks for space-separated bypasses (e.g. "f u c k", "g a g o", "t a n g i n a")
 */
function checkSpacedProfanity(text: string): string | null {
  const compact = text.toLowerCase().replace(/\s+/g, '');
  const keyTargets = [
    'fuck', 'bitch', 'shit', 'cunt', 'dick', 'pussy', 'slut', 'whore',
    'gago', 'tangina', 'puta', 'ulol', 'pakyu', 'bobo', 'yawa', 'burat',
    'tite', 'puke', 'leche', 'kupal', 'pakshet', 'tarantado', 'punyeta', 'inutil'
  ];

  for (const word of keyTargets) {
    if (compact.includes(word)) {
      return word;
    }
  }
  return null;
}

/**
 * Detects spam links and phone numbers
 */
export function detectSpamOrPersonalData(text: string): { isSpam: boolean; reason?: string } {
  if (!text) return { isSpam: false };

  // URL / link detection
  if (/(?:https?:\/\/|www\.)[^\s]+/i.test(text)) {
    return { isSpam: true, reason: 'External links/URLs are not allowed.' };
  }

  // Philippine and International mobile phone number detection
  if (/\b(?:\+?63|0)?9\d{2}[-\s]?\d{3}[-\s]?\d{4}\b/.test(text)) {
    return { isSpam: true, reason: 'Personal phone numbers should not be shared publicly.' };
  }

  return { isSpam: false };
}

/**
 * Detects inappropriate words in any string with multi-layer heuristics
 */
export function detectInappropriateContent(text: string): {
  isInappropriate: boolean;
  flaggedWords: string[];
} {
  if (!text) return { isInappropriate: false, flaggedWords: [] };

  const rawLower = text.toLowerCase();
  const normalized = normalizeText(text);
  const flagged = new Set<string>();

  // Check spaced evasion (e.g., "f u c k", "b o b o")
  const spacedMatch = checkSpacedProfanity(text);
  if (spacedMatch) {
    flagged.add(spacedMatch);
  }

  // Check spam / links / numbers
  const spamCheck = detectSpamOrPersonalData(text);
  if (spamCheck.isSpam && spamCheck.reason) {
    flagged.add(spamCheck.reason);
  }

  // Check word boundary and substring matches
  for (const word of INAPPROPRIATE_WORDS) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const wordPattern = new RegExp(`\\b${escaped}\\b`, 'i');

    if (wordPattern.test(rawLower) || wordPattern.test(normalized)) {
      flagged.add(word);
      continue;
    }

    // For multi-word slurs like "kill yourself", "tang ina"
    if (word.includes(' ') && (rawLower.includes(word) || normalized.includes(word.replace(/\s+/g, '')))) {
      flagged.add(word);
    }
  }

  const flaggedWords = Array.from(flagged);
  return {
    isInappropriate: flaggedWords.length > 0,
    flaggedWords,
  };
}

/**
 * Checks if a string contains "unknown" or unacceptable placeholder values
 */
export function containsUnknownOrPlaceholder(val: string): boolean {
  if (!val) return false;
  const clean = val.trim().toLowerCase();
  const norm = normalizeText(val);

  // Direct check for "unknown" substring anywhere in the string
  if (clean.includes('unknown') || norm.includes('unknown')) {
    return true;
  }

  // Check against exact or word-boundary placeholder terms
  for (const term of PLACEHOLDER_TERMS) {
    if (clean === term || norm === term) return true;
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    if (regex.test(clean) || regex.test(norm)) return true;
  }

  // Punctuations only like "---", "???", "..."
  if (/^[.\-_?~*! ]+$/.test(clean)) {
    return true;
  }

  // Suspicious repetition like "asdfasdf" or single characters
  if (/^(asdf|test|qwerty|xxx|aaa)+$/i.test(clean)) {
    return true;
  }

  return false;
}

export interface ValidationWarnings {
  hasWarning: boolean;
  warnings: string[];
  nameWarning?: string;
  gradeWarning?: string;
  contentWarning?: string;
  subjectWarning?: string;
  flaggedTerms: string[];
}

/**
 * Comprehensive Sensor for Sticky Notes
 */
export function validateStickyNoteSensor(params: {
  studentName: string;
  grade: string;
  subjectOrTeacher: string;
  message: string;
}): ValidationWarnings {
  const warnings: string[] = [];
  const flaggedTerms: string[] = [];
  let nameWarning: string | undefined;
  let gradeWarning: string | undefined;
  let contentWarning: string | undefined;
  let subjectWarning: string | undefined;

  // 1. Student Name Checks
  if (containsUnknownOrPlaceholder(params.studentName)) {
    nameWarning = '⚠️ Name Warning: "Unknown" or placeholder names are not permitted. Please enter your real name or student nickname so your teacher knows who appreciated them!';
    warnings.push(nameWarning);
  }

  const nameInappropriate = detectInappropriateContent(params.studentName);
  if (nameInappropriate.isInappropriate) {
    nameWarning = '⚠️ Name Warning: Inappropriate word detected in your name. Please use a respectful student name.';
    warnings.push(nameWarning);
    flaggedTerms.push(...nameInappropriate.flaggedWords);
  }

  // 2. Grade / Section Checks
  if (params.grade && params.grade.trim()) {
    if (containsUnknownOrPlaceholder(params.grade)) {
      gradeWarning = '⚠️ Grade Warning: "Unknown" is not allowed in grade/section. Please put your actual grade and section (e.g., "Grade 11 - STEM") or leave it blank.';
      warnings.push(gradeWarning);
    }
    const gradeInappropriate = detectInappropriateContent(params.grade);
    if (gradeInappropriate.isInappropriate) {
      gradeWarning = '⚠️ Grade Warning: Inappropriate language detected in Grade/Section.';
      warnings.push(gradeWarning);
      flaggedTerms.push(...gradeInappropriate.flaggedWords);
    }
  }

  // 3. Subject / Teacher Checks
  if (params.subjectOrTeacher && params.subjectOrTeacher.trim()) {
    if (containsUnknownOrPlaceholder(params.subjectOrTeacher)) {
      subjectWarning = '⚠️ Subject Warning: "Unknown" is not allowed. Please specify the teacher or subject.';
      warnings.push(subjectWarning);
    }
    const subjectInappropriate = detectInappropriateContent(params.subjectOrTeacher);
    if (subjectInappropriate.isInappropriate) {
      subjectWarning = '⚠️ Subject Warning: Inappropriate language detected in Subject.';
      warnings.push(subjectWarning);
      flaggedTerms.push(...subjectInappropriate.flaggedWords);
    }
  }

  // 4. Message Content Sensor
  const messageInappropriate = detectInappropriateContent(params.message);
  if (messageInappropriate.isInappropriate) {
    contentWarning = `⚠️ Content Sensor Warning: Inappropriate or prohibited language detected (${messageInappropriate.flaggedWords.join(', ')}). Our Teachers' Day wall is dedicated to positive, respectful appreciation. Please revise your message.`;
    warnings.push(contentWarning);
    flaggedTerms.push(...messageInappropriate.flaggedWords);
  }

  return {
    hasWarning: warnings.length > 0,
    warnings,
    nameWarning,
    gradeWarning,
    contentWarning,
    subjectWarning,
    flaggedTerms,
  };
}

/**
 * Comprehensive Sensor for Formal Heartfelt Letters
 */
export function validateLetterSensor(params: {
  studentName: string;
  grade: string;
  title: string;
  body: string;
  customTeacherName?: string;
}): ValidationWarnings {
  const warnings: string[] = [];
  const flaggedTerms: string[] = [];
  let nameWarning: string | undefined;
  let gradeWarning: string | undefined;
  let contentWarning: string | undefined;
  let subjectWarning: string | undefined;

  // 1. Student Name Checks
  if (containsUnknownOrPlaceholder(params.studentName)) {
    nameWarning = '⚠️ Name Warning: "Unknown" is not allowed. Please enter your real name or class group so your teacher knows who sent this letter!';
    warnings.push(nameWarning);
  }

  const nameInappropriate = detectInappropriateContent(params.studentName);
  if (nameInappropriate.isInappropriate) {
    nameWarning = '⚠️ Name Warning: Inappropriate language detected in your signature/name.';
    warnings.push(nameWarning);
    flaggedTerms.push(...nameInappropriate.flaggedWords);
  }

  // 2. Grade Checks
  if (params.grade && params.grade.trim()) {
    if (containsUnknownOrPlaceholder(params.grade)) {
      gradeWarning = '⚠️ Grade Warning: "Unknown" is not allowed in grade/section. Please provide your actual grade (e.g. "Grade 12 - Hope") or leave it blank.';
      warnings.push(gradeWarning);
    }
    const gradeInappropriate = detectInappropriateContent(params.grade);
    if (gradeInappropriate.isInappropriate) {
      gradeWarning = '⚠️ Grade Warning: Inappropriate language detected in Grade/Section.';
      warnings.push(gradeWarning);
      flaggedTerms.push(...gradeInappropriate.flaggedWords);
    }
  }

  // 3. Custom Teacher Name Checks
  if (params.customTeacherName && params.customTeacherName.trim()) {
    if (containsUnknownOrPlaceholder(params.customTeacherName)) {
      subjectWarning = '⚠️ Recipient Warning: "Unknown" cannot be the teacher recipient.';
      warnings.push(subjectWarning);
    }
    const teacherInappropriate = detectInappropriateContent(params.customTeacherName);
    if (teacherInappropriate.isInappropriate) {
      subjectWarning = '⚠️ Recipient Warning: Inappropriate language detected in teacher name.';
      warnings.push(subjectWarning);
      flaggedTerms.push(...teacherInappropriate.flaggedWords);
    }
  }

  // 4. Letter Title & Body Checks
  const titleInappropriate = detectInappropriateContent(params.title);
  if (titleInappropriate.isInappropriate) {
    contentWarning = `⚠️ Content Warning: Inappropriate language detected in letter title (${titleInappropriate.flaggedWords.join(', ')}).`;
    warnings.push(contentWarning);
    flaggedTerms.push(...titleInappropriate.flaggedWords);
  }

  const bodyInappropriate = detectInappropriateContent(params.body);
  if (bodyInappropriate.isInappropriate) {
    contentWarning = `⚠️ Content Sensor Warning: Inappropriate language detected in letter body (${bodyInappropriate.flaggedWords.join(', ')}). Please write a respectful and heartfelt message for your teacher.`;
    warnings.push(contentWarning);
    flaggedTerms.push(...bodyInappropriate.flaggedWords);
  }

  return {
    hasWarning: warnings.length > 0,
    warnings,
    nameWarning,
    gradeWarning,
    contentWarning,
    subjectWarning,
    flaggedTerms,
  };
}
