import React, { useState } from 'react';
import {
  ShieldAlert,
  ExternalLink,
  Copy,
  Check,
  X,
  Sparkles,
  ArrowRight,
  Globe
} from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';

interface UnauthorizedDomainModalProps {
  onClose: () => void;
  onRetry: () => void;
}

export const UnauthorizedDomainModal: React.FC<UnauthorizedDomainModalProps> = ({
  onClose,
  onRetry,
}) => {
  const [copied, setCopied] = useState(false);
  const currentDomain = window.location.hostname;
  const projectId = firebaseConfig.projectId || 'gen-lang-client-0128065468';
  const consoleSettingsUrl = `https://console.firebase.google.com/project/${projectId}/authentication/settings`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentDomain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 pb-4 border-b border-slate-100 flex items-start gap-3 bg-amber-50/70">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-slate-900">
              Authorize Domain in Firebase
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Google Sign-In is blocked because <code className="font-mono font-semibold text-slate-800">{currentDomain}</code> is not yet added to your Firebase Authorized Domains.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Instructions */}
        <div className="p-5 space-y-4 text-xs text-slate-700">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Domain to authorize:
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 bg-slate-100 rounded-xl font-mono text-xs text-slate-900 border border-slate-200 flex items-center gap-2 truncate">
                <Globe className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <span className="truncate">{currentDomain}</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all cursor-pointer shadow-xs flex-shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Steps */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
            <div className="font-bold text-slate-900 text-xs">
              Quick 30-Second Fix (One-time setup):
            </div>
            <ol className="space-y-2 list-decimal list-inside text-slate-600 leading-relaxed text-xs">
              <li>
                Click the button below to open your project&apos;s <strong>Firebase Authentication Settings</strong>.
              </li>
              <li>
                Scroll down to <strong>Authorized domains</strong> and click <strong>Add domain</strong>.
              </li>
              <li>
                Paste <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono text-[11px] text-slate-800 font-bold">{currentDomain}</code> and click <strong>Add</strong>.
              </li>
            </ol>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <a
              href={consoleSettingsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
            >
              <span>Open Firebase Settings</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => {
                onClose();
                onRetry();
              }}
              className="inline-flex items-center gap-1 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <span>Retry Sign-In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Alternative Pre-Authorized Hosting notice */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Project ID: <strong className="font-mono text-slate-700">{projectId}</strong></span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
