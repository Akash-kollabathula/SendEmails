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
              Fix 1: Domain Whitelist (One-Time Setup):
            </div>
            <ol className="space-y-1.5 list-decimal list-inside text-slate-600 leading-relaxed text-xs">
              <li>
                Open <strong>Firebase Settings</strong> below.
              </li>
              <li>
                Under <strong>Authorized domains</strong>, click <strong>Add domain</strong>.
              </li>
              <li>
                Paste <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono text-[11px] text-slate-800 font-bold">{currentDomain}</code> and save.
              </li>
            </ol>
          </div>

          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 space-y-2">
            <div className="font-bold text-blue-950 text-xs">
              Fix 2: Allow All Users (Error 403: access_denied / App in Testing):
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              If Google displays &quot;<em>Access blocked: App has not completed verification</em>&quot;, your project is in Testing mode.
            </p>
            <div className="flex flex-col gap-1.5 pt-1 text-xs text-blue-900">
              <a
                href={`https://console.cloud.google.com/apis/credentials/consent?project=${projectId}`}
                target="_blank"
                rel="noreferrer"
                className="font-bold underline flex items-center gap-1 hover:text-blue-700"
              >
                <span>Open Google Cloud OAuth Consent Screen</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-600 text-[11px]">
                ➔ To allow everyone: Click <strong>Publish App</strong>.<br/>
                ➔ Or add specific emails: Scroll to <strong>Test users</strong> ➔ <strong>+ ADD USERS</strong>.
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
            <a
              href={consoleSettingsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
            >
              <span>Firebase Domains</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={`https://console.cloud.google.com/apis/credentials/consent?project=${projectId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <span>OAuth Consent Screen</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => {
                onClose();
                onRetry();
              }}
              className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer"
            >
              <span>Retry Login</span>
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
