import React from 'react';
import { Mail, CheckCircle2, AlertCircle, LogOut, Send, FileText } from 'lucide-react';
import { User } from 'firebase/auth';

interface HeaderProps {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  isLoggingIn: boolean;
  totalRecipients: number;
  sentCount: number;
  resumeLoaded: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onSignIn,
  onSignOut,
  isLoggingIn,
  totalRecipients,
  sentCount,
  resumeLoaded,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-900 tracking-tight text-lg">AutoReach SDET</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                Playwright • Gmail
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Bulk Job Opportunity &amp; Resume Outreach System
            </p>
          </div>
        </div>

        {/* Stats & Auth info */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
              <FileText className={`w-3.5 h-3.5 ${resumeLoaded ? 'text-emerald-600' : 'text-amber-500'}`} />
              <span>Resume: {resumeLoaded ? 'Akash_3YOE.pdf' : 'Loading...'}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
              <Send className="w-3.5 h-3.5 text-blue-600" />
              <span>Progress: {sentCount} / {totalRecipients}</span>
            </div>
          </div>

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl pl-2.5 pr-1.5 py-1">
              <div className="flex items-center gap-2">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-400"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                    {user.email ? user.email[0].toUpperCase() : 'A'}
                  </div>
                )}
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-800 leading-tight">
                    {user.displayName || 'Akash Kollabathula'}
                  </div>
                  <div className="text-[10px] text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                    <span>Gmail Connected</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onSignOut}
                title="Disconnect Google Account"
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-emerald-100/60 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              disabled={isLoggingIn}
              className="group relative inline-flex items-center gap-2.5 px-4 py-2 border border-slate-300 rounded-xl shadow-xs bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm transition-all duration-150 cursor-pointer disabled:opacity-60 active:scale-[0.98]"
            >
              <div className="w-4 h-4 flex-shrink-0">
                <svg viewBox="0 0 48 48" className="w-full h-full">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
              </div>
              <span>{isLoggingIn ? 'Connecting...' : 'Connect Gmail Account'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
