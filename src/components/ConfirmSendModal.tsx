import React from 'react';
import {
  AlertTriangle,
  Send,
  FileText,
  Mail,
  ShieldCheck,
  Clock,
  Sparkles,
  X
} from 'lucide-react';
import { Recipient } from '../types';

interface ConfirmSendModalProps {
  recipients: Recipient[];
  dispatchMode: 'send' | 'draft';
  fromEmail: string;
  fromName: string;
  resumeFileName: string;
  delayMs: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmSendModal: React.FC<ConfirmSendModalProps> = ({
  recipients,
  dispatchMode,
  fromEmail,
  fromName,
  resumeFileName,
  delayMs,
  onConfirm,
  onCancel,
}) => {
  const isSend = dispatchMode === 'send';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 pb-4 border-b border-slate-100 flex items-start gap-3">
          <div className={`p-2.5 rounded-xl ${isSend ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
            {isSend ? <AlertTriangle className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-slate-900">
              {isSend
                ? `Confirm Sending ${recipients.length} Email(s) via Gmail`
                : `Create ${recipients.length} Gmail Draft(s)`}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isSend
                ? 'These emails will be sent directly to recipient inboxes from your connected Gmail.'
                : 'Drafts will be saved in your Gmail account so you can review them prior to sending.'}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Details List */}
        <div className="p-5 space-y-3.5 text-xs text-slate-600 bg-slate-50/60">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-slate-500 font-medium">Sending From:</span>
            <span className="font-semibold text-slate-900 truncate">
              {fromName} ({fromEmail})
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-slate-500 font-medium">Attached Resume:</span>
            <div className="flex items-center gap-1.5 font-semibold text-slate-900">
              <FileText className="w-3.5 h-3.5 text-rose-500" />
              <span>{resumeFileName}</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-slate-500 font-medium">Delivery Stagger:</span>
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{delayMs / 1000}s per email (rate limit &amp; anti-spam protection)</span>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
              Target Recipients ({recipients.length}):
            </div>
            <div className="max-h-36 overflow-y-auto rounded-xl border border-slate-200 bg-white divide-y divide-slate-100 p-1">
              {recipients.map((r, i) => (
                <div key={r.id || i} className="p-2 flex items-center justify-between text-xs">
                  <div className="truncate min-w-0 pr-2">
                    <span className="font-medium text-slate-800">{r.name || 'Recruiter'}</span>
                    <span className="text-slate-400 ml-1.5 text-[11px]">({r.email})</span>
                  </div>
                  {r.company && (
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                      {r.company}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white rounded-xl transition-all cursor-pointer shadow-sm ${
              isSend
                ? 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSend ? `Confirm & Send ${recipients.length} Emails` : `Create ${recipients.length} Drafts`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
