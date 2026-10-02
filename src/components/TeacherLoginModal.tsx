import React, { useState } from 'react';
import { AuthorizedTeacher, UserSession } from '../types';
import {
  X,
  GraduationCap,
  KeyRound,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Search,
  Eye,
  EyeOff,
  BookOpen,
  UserCheck,
} from 'lucide-react';
import { ALL_CURRICULUM_OPTIONS } from '../data/curriculum';
import { playChime } from '../utils/audio';

interface TeacherLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  authorizedTeachers: AuthorizedTeacher[];
  onLogin: (session: UserSession) => void;
  onRequestAccess: (req: Omit<AuthorizedTeacher, 'id' | 'status'>) => void;
}

export const TeacherLoginModal: React.FC<TeacherLoginModalProps> = ({
  isOpen,
  onClose,
  authorizedTeachers,
  onLogin,
  onRequestAccess,
}) => {
  const [mode, setMode] = useState<'login' | 'request'>('login');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [searchFaculty, setSearchFaculty] = useState('');
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Request Access form fields
  const [reqName, setReqName] = useState('');
  const [reqSubject, setReqSubject] = useState(ALL_CURRICULUM_OPTIONS[0]?.name || 'Mathematics');
  const [reqCode, setReqCode] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  if (!isOpen) return null;

  const approvedTeachers = authorizedTeachers.filter((t) => t.status === 'approved');

  const filteredFaculty = approvedTeachers.filter((t) => {
    if (!searchFaculty.trim()) return true;
    const q = searchFaculty.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q);
  });

  const selectedTeacher = approvedTeachers.find((t) => t.id === selectedTeacherId);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedTeacherId) {
      setErrorMsg('Please select your faculty profile from the roster.');
      return;
    }

    if (!selectedTeacher) {
      setErrorMsg('Selected faculty profile could not be found.');
      return;
    }

    if (!accessCodeInput.trim()) {
      setErrorMsg('Please enter your confidential faculty access code.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const enteredCode = accessCodeInput.trim().toUpperCase();
      const actualCode = selectedTeacher.accessCode.trim().toUpperCase();

      if (enteredCode !== actualCode) {
        setErrorMsg('Invalid faculty access code for this profile. Please verify or ask the Head Administrator.');
        return;
      }

      playChime();
      onLogin({
        role: 'teacher',
        name: selectedTeacher.name,
        subject: selectedTeacher.subject,
        id: selectedTeacher.id,
      });
      onClose();
    }, 300);
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!reqName.trim()) {
      setErrorMsg('Please enter your complete name and honorific.');
      return;
    }

    if (!reqCode.trim()) {
      setErrorMsg('Please provide a preferred confidential access code.');
      return;
    }

    onRequestAccess({
      name: reqName.trim(),
      subject: reqSubject,
      accessCode: reqCode.trim().toUpperCase(),
    });

    playChime();
    setRequestSubmitted(true);
    setTimeout(() => {
      setRequestSubmitted(false);
      setMode('login');
      setReqName('');
      setReqCode('');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FFFDF9] border-2 border-[#E8DCC8] rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Top Washi Tape */}
        <div className="washi-tape" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 text-[#6D5E4F] hover:text-[#26211D] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#1F453B]/10 border border-[#1F453B]/20 text-[#1F453B] flex items-center justify-center mx-auto mb-3 shadow-2xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#2D2823]">
            City High Faculty Portal
          </h2>
          <p className="text-xs text-[#6B5D4E] mt-1 font-medium">
            Sign in to view student tributes, mailbox letters & send replies ✨
          </p>
        </div>

        {/* Mode switcher tabs */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F5ECDC] rounded-2xl mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'login' ? 'bg-white text-[#1F453B] shadow-2xs' : 'text-[#7A6A58] hover:text-[#2D2823]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Faculty Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('request');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'request' ? 'bg-white text-[#1F453B] shadow-2xs' : 'text-[#7A6A58] hover:text-[#2D2823]'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>New Faculty Request</span>
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-bold text-[#57493A] tracking-wider mb-1.5">
                Select Your Name & Department
              </label>

              {/* Quick search input */}
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-[#8C7D6F] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFaculty}
                  onChange={(e) => setSearchFaculty(e.target.value)}
                  placeholder="Filter by name or subject (e.g. Science, Reyes)..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#D8C7B0] bg-white text-[#2D2823] focus:border-[#1F453B] focus:outline-none"
                />
              </div>

              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#D8C7B0] bg-white text-sm font-semibold text-[#2D2823] focus:border-[#1F453B] focus:outline-none transition-colors"
                required
              >
                <option value="">-- Choose from authorized faculty list --</option>
                {filteredFaculty.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Profile Confirmation Card */}
            {selectedTeacher && (
              <div className="p-3 bg-[#FAF5EB] border border-[#DECDB8] rounded-xl flex items-center justify-between text-xs animate-in fade-in">
                <div>
                  <div className="font-bold text-[#1F453B]">{selectedTeacher.name}</div>
                  <div className="text-[11px] text-[#7A6A58]">{selectedTeacher.subject} Department</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  ✓ Verified Faculty
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase font-bold text-[#57493A] tracking-wider mb-1.5">
                Faculty Access Code
              </label>
              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  value={accessCodeInput}
                  onChange={(e) => setAccessCodeInput(e.target.value)}
                  placeholder="Enter your confidential security passcode"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border-2 border-[#D8C7B0] bg-white text-sm font-semibold text-[#2D2823] placeholder-[#A08F7C] focus:border-[#1F453B] focus:outline-none transition-colors font-mono"
                  required
                />
                <KeyRound className="w-4 h-4 text-[#8C7B68] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C7B68] hover:text-[#2D2823]"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-[#8C7A68] mt-1 italic">
                Official security passcode issued to faculty by the School Administration.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-[#1F453B] hover:bg-[#16332C] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-[#F7DE85]" />
              <span>{isLoading ? 'Verifying Faculty Access...' : 'Enter Teacher Sanctuary'}</span>
            </button>
          </form>
        ) : requestSubmitted ? (
          <div className="py-8 text-center space-y-3 animate-in fade-in">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-[#2D2823]">Request Forwarded!</h3>
            <p className="text-xs text-[#6B5D4E] leading-relaxed">
              Your access request has been sent to the Head Administrator for immediate approval.
            </p>
          </div>
        ) : (
          <form onSubmit={handleRequestSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs uppercase font-bold text-[#57493A] tracking-wider mb-1">
                Your Full Name / Honorific
              </label>
              <input
                type="text"
                value={reqName}
                onChange={(e) => setReqName(e.target.value)}
                placeholder="e.g. Ma'am Clara Mendoza"
                className="w-full px-3.5 py-2 rounded-xl border-2 border-[#D8C7B0] bg-white text-sm font-semibold text-[#2D2823] placeholder-[#A08F7C] focus:border-[#1F453B] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-[#57493A] tracking-wider mb-1">
                Department / Subject / Strand
              </label>
              <select
                value={reqSubject}
                onChange={(e) => setReqSubject(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border-2 border-[#D8C7B0] bg-white text-sm font-semibold text-[#2D2823] focus:border-[#1F453B] focus:outline-none"
              >
                {ALL_CURRICULUM_OPTIONS.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.icon} {c.name} ({c.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-[#57493A] tracking-wider mb-1">
                Preferred Access Passcode
              </label>
              <input
                type="text"
                value={reqCode}
                onChange={(e) => setReqCode(e.target.value)}
                placeholder="e.g. SCIENCE2026"
                className="w-full px-3.5 py-2 rounded-xl border-2 border-[#D8C7B0] bg-white text-sm font-semibold text-[#2D2823] placeholder-[#A08F7C] focus:border-[#1F453B] focus:outline-none font-mono"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 rounded-xl bg-[#CE5A46] hover:bg-[#B84E3C] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Faculty Request</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
