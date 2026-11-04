import React from 'react';
import {
  Play,
  Pause,
  Square,
  Send,
  Sparkles,
  Clock,
  Terminal,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { SendLog } from '../types';

interface DispatchConsoleProps {
  dispatchMode: 'send' | 'draft';
  onChangeDispatchMode: (mode: 'send' | 'draft') => void;
  delayMs: number;
  onChangeDelayMs: (delay: number) => void;
  isDispatching: boolean;
  isPaused: boolean;
  onStartDispatch: () => void;
  onPauseDispatch: () => void;
  onResumeDispatch: () => void;
  onStopDispatch: () => void;
  totalSelected: number;
  completedCount: number;
  logs: SendLog[];
  onClearLogs: () => void;
  userConnected: boolean;
  onConnectGoogle: () => void;
}

export const DispatchConsole: React.FC<DispatchConsoleProps> = ({
  dispatchMode,
  onChangeDispatchMode,
  delayMs,
  onChangeDelayMs,
  isDispatching,
  isPaused,
  onStartDispatch,
  onPauseDispatch,
  onResumeDispatch,
  onStopDispatch,
  totalSelected,
  completedCount,
  logs,
  onClearLogs,
  userConnected,
  onConnectGoogle,
}) => {
  const percent = totalSelected > 0 ? Math.min(100, Math.round((completedCount / totalSelected) * 100)) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Outreach Dispatcher</h2>
            <p className="text-xs text-slate-500">Configure delivery mode and launch bulk outreach</p>
          </div>
        </div>

        {/* Mode selector pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => onChangeDispatchMode('send')}
            disabled={isDispatching}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              dispatchMode === 'send'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Direct Send</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeDispatchMode('draft')}
            disabled={isDispatching}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              dispatchMode === 'draft'
                ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create Drafts</span>
          </button>
        </div>
      </div>

      {/* Settings Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-slate-700">Safety Stagger Interval:</span>
            <span className="font-mono text-blue-700 font-bold">{delayMs / 1000}s</span>
          </div>
          <div className="flex items-center gap-1.5">
            {[1000, 1500, 2000, 3000].map((ms) => (
              <button
                key={ms}
                type="button"
                onClick={() => onChangeDelayMs(ms)}
                disabled={isDispatching}
                className={`flex-1 py-1 text-center rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                  delayMs === ms
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {ms / 1000}s
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 mt-1.5">
            Protects your Gmail sender score and prevents API throttling.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-slate-700">Gmail Delivery Destination:</span>
            <a
              href="https://mail.google.com"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:text-blue-800 text-[11px] font-medium flex items-center gap-0.5"
            >
              <span>Open Gmail</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="text-[11px] text-slate-600 leading-relaxed">
            {dispatchMode === 'send'
              ? 'Emails will be sent directly and appear in your Gmail "Sent" folder with the resume PDF attached.'
              : 'Messages will be created as ready-to-review drafts in your Gmail "Drafts" folder with the resume attached.'}
          </div>
        </div>
      </div>

      {/* Main Execution Controls */}
      <div className="mb-4">
        {!userConnected ? (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Connect your Google account to enable live sending with your Gmail address.</span>
            </div>
            <button
              type="button"
              onClick={onConnectGoogle}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors cursor-pointer flex-shrink-0 text-center"
            >
              Sign In with Google
            </button>
          </div>
        ) : isDispatching ? (
          <div className="flex items-center gap-2">
            {isPaused ? (
              <button
                type="button"
                onClick={onResumeDispatch}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
              >
                <Play className="w-4 h-4" />
                <span>Resume Dispatch</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onPauseDispatch}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </button>
            )}

            <button
              type="button"
              onClick={onStopDispatch}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
            >
              <Square className="w-4 h-4" />
              <span>Stop Dispatch</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onStartDispatch}
            disabled={totalSelected === 0}
            className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white transition-all cursor-pointer shadow-md ${
              totalSelected === 0
                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                : dispatchMode === 'send'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25 active:scale-[0.99]'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/25 active:scale-[0.99]'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>
              {totalSelected === 0
                ? 'Select At Least One Recipient'
                : dispatchMode === 'send'
                ? `Launch Bulk Dispatch (${totalSelected} Recruiter${totalSelected > 1 ? 's' : ''})`
                : `Create ${totalSelected} Gmail Draft${totalSelected > 1 ? 's' : ''}`}
            </span>
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {(isDispatching || completedCount > 0) && (
        <div className="mb-4 bg-slate-50 rounded-xl p-3 border border-slate-200">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-700">Dispatch Progress:</span>
            <span className="font-mono text-blue-700 font-bold">
              {completedCount} / {totalSelected} ({percent}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Live Log Terminal */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900 text-slate-200 text-xs font-mono">
        <div className="px-3.5 py-2 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold text-slate-300 text-[11px]">Real-Time Execution Logs</span>
            {logs.length > 0 && (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-700 text-slate-300">
                {logs.length}
              </span>
            )}
          </div>
          {logs.length > 0 && (
            <button
              type="button"
              onClick={onClearLogs}
              className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>

        <div className="p-3 max-h-48 overflow-y-auto space-y-1.5 scrollbar-thin">
          {logs.length === 0 ? (
            <div className="text-slate-500 py-3 text-center text-[11px]">
              Ready to dispatch. Logs and delivery receipts will stream here in real-time.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex items-start gap-2 text-[11px] leading-tight">
                <span className="text-slate-500 flex-shrink-0">{log.timestamp}</span>
                {log.status === 'sent' && (
                  <span className="text-emerald-400 flex items-center gap-1 flex-shrink-0">
                    <CheckCircle2 className="w-3 h-3" /> [SENT]
                  </span>
                )}
                {log.status === 'drafted' && (
                  <span className="text-indigo-400 flex items-center gap-1 flex-shrink-0">
                    <Sparkles className="w-3 h-3" /> [DRAFTED]
                  </span>
                )}
                {log.status === 'failed' && (
                  <span className="text-rose-400 flex items-center gap-1 flex-shrink-0">
                    <AlertCircle className="w-3 h-3" /> [FAILED]
                  </span>
                )}
                {log.status === 'info' && (
                  <span className="text-blue-400 flex-shrink-0">[INFO]</span>
                )}
                <span className="text-slate-300 truncate">
                  {log.recipientName ? `${log.recipientName} (${log.recipientEmail})` : log.recipientEmail}: {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
