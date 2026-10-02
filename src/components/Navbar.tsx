import React from 'react';
import { UserSession } from '../types';
import { GraduationCap, ShieldCheck, LogOut, Sparkles, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  onScrollTo: (sectionId: string) => void;
  user: UserSession | null;
  onOpenTeacherLogin: () => void;
  onOpenAdminDashboard?: () => void;
  onOpenTeacherDashboard?: () => void;
  onOpenIntro?: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onScrollTo,
  user,
  onOpenTeacherLogin,
  onOpenAdminDashboard,
  onOpenTeacherDashboard,
  onOpenIntro,
  onLogout,
}) => {
  return (
    <header className="w-full py-5 px-5 sm:px-12 flex justify-between items-center relative z-20 no-print">
      {/* Left Brand / Role Status */}
      <div className="flex items-center gap-2">
        {user ? (
          <div className="flex items-center gap-2">
            {user.role === 'teacher' ? (
              <>
                <button
                  onClick={onOpenIntro}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#1F453B] text-white border border-[#2C5F51] hover:bg-[#16332C] shadow-2xs transition-all cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 text-[#F7DE85]" />
                  <span>{user.name}</span>
                  <span className="hidden sm:inline opacity-85">· Teacher</span>
                  <Sparkles className="w-3 h-3 text-[#F7DE85] ml-0.5" />
                </button>

                {onOpenTeacherDashboard && (
                  <button
                    onClick={onOpenTeacherDashboard}
                    className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#FAF5EB] hover:bg-[#F2ECE1] text-[#1F453B] border border-[#DECDB8] shadow-2xs transition-all cursor-pointer"
                    title="Open Teacher Interactive Dashboard"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#1F453B]" />
                    <span>Dashboard (Gr. 7 - SHS)</span>
                  </button>
                )}
              </>
            ) : user.role === 'moderator' ? (
              <button
                onClick={onOpenAdminDashboard}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#1F453B] text-white border border-[#2C5F51] hover:bg-[#16332C] shadow-2xs transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#7CE0B3]" />
                <span>{user.name} (Mod)</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdminDashboard}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#1F453B] text-white border border-[#3E342B] hover:bg-[#16332C] shadow-2xs transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#F7DE85]" />
                <span>Admin Dashboard</span>
              </button>
            )}

            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg hover:bg-black/5 text-[#6D5E4F] hover:text-[#26211D] transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Public Header shows ONLY Teacher Login; Admin Login is kept hidden */
          <button
            onClick={onOpenTeacherLogin}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white text-xs font-bold text-[#4A3E33] border border-[#DECDB8] shadow-2xs hover:border-[#CE5A46] transition-all cursor-pointer"
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#CE5A46]" />
            <span>Teacher Login</span>
          </button>
        )}
      </div>

      {/* Right Navigation */}
      <nav className="flex items-center gap-5 sm:gap-8 text-xs sm:text-sm font-semibold text-[#2F2924]">
        <button
          onClick={() => onScrollTo('letter-section')}
          className="hover:text-[#CE5A46] transition-colors cursor-pointer"
        >
          Our Letter
        </button>
        <button
          onClick={() => onScrollTo('wall-section')}
          className="hover:text-[#CE5A46] transition-colors cursor-pointer"
        >
          Gratitude Wall
        </button>
        <button
          onClick={() => onScrollTo('suggestions-section')}
          className="hover:text-[#CE5A46] transition-colors cursor-pointer hidden sm:inline"
        >
          Writing Ideas
        </button>
        <button
          onClick={() => onScrollTo('write-section')}
          className="hover:text-[#CE5A46] transition-colors cursor-pointer"
        >
          Write a Note
        </button>
      </nav>
    </header>
  );
};
