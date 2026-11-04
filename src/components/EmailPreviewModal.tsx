import React, { useState } from 'react';
import {
  X,
  Mail,
  User,
  Building,
  Paperclip,
  Send,
  Eye,
  FileCode,
  CheckCircle2
} from 'lucide-react';
import { Recipient, ResumeData } from '../types';
import { DEFAULT_USER_INFO } from '../data/templates';
import { buildRfc2822Message } from '../services/gmail';

interface EmailPreviewModalProps {
  recipient: Recipient;
  subject: string;
  body: string;
  resume: ResumeData | null;
  fromEmail: string;
  fromName: string;
  onClose: () => void;
  onSendSingle: (recipient: Recipient) => void;
  isDispatching: boolean;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  recipient,
  subject,
  body,
  resume,
  fromEmail,
  fromName,
  onClose,
  onSendSingle,
  isDispatching,
}) => {
  const [viewRawMime, setViewRawMime] = useState(false);

  // Variable replacement
  const rName = recipient.name || 'Hiring Manager';
  const rComp = recipient.company || 'Engineering Team';
  const rRole = recipient.role || 'SDET / QA Automation Engineer';

  const renderedSubject = subject
    .replace(/\{\{recruiter_name\}\}/g, rName)
    .replace(/\{\{company\}\}/g, rComp)
    .replace(/\{\{role\}\}/g, rRole)
    .replace(/\{\{my_name\}\}/g, fromName)
    .replace(/\{\{my_email\}\}/g, fromEmail)
    .replace(/\{\{my_phone\}\}/g, DEFAULT_USER_INFO.phone)
    .replace(/\{\{my_location\}\}/g, DEFAULT_USER_INFO.location);

  const renderedBody = body
    .replace(/\{\{recruiter_name\}\}/g, rName)
    .replace(/\{\{company\}\}/g, rComp)
    .replace(/\{\{role\}\}/g, rRole)
    .replace(/\{\{my_name\}\}/g, fromName)
    .replace(/\{\{my_email\}\}/g, fromEmail)
    .replace(/\{\{my_phone\}\}/g, DEFAULT_USER_INFO.phone)
    .replace(/\{\{my_location\}\}/g, DEFAULT_USER_INFO.location);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-semibold text-slate-900">Personalized Email Preview</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewRawMime(!viewRawMime)}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{viewRawMime ? 'Show Formatted' : 'Inspect MIME'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Metadata bar */}
          <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-3 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">From:</span>
              <span className="font-semibold text-slate-800">
                {fromName} &lt;{fromEmail}&gt;
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">To:</span>
              <span className="font-semibold text-slate-800">
                {recipient.name ? `${recipient.name} <${recipient.email}>` : recipient.email}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Company Target:</span>
              <span className="font-medium text-indigo-600">{rComp}</span>
            </div>
            <div className="pt-2 border-t border-slate-200/80 flex items-start gap-2">
              <span className="text-slate-500 font-medium flex-shrink-0">Subject:</span>
              <span className="font-semibold text-slate-900 leading-snug">{renderedSubject}</span>
            </div>
          </div>

          {/* Attachment Box */}
          <div className="flex items-center justify-between p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-[10px]">
                PDF
              </div>
              <div>
                <div className="font-semibold text-slate-900">
                  {resume?.fileName || DEFAULT_USER_INFO.resumeFileName}
                </div>
                <div className="text-[11px] text-slate-500">
                  {resume ? `${(resume.fileSize / 1024).toFixed(1)} KB` : '124 KB'} • Attached via RFC 2822 Multipart
                </div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              Attached
            </span>
          </div>

          {/* Rendered Email Content or Raw MIME */}
          {viewRawMime ? (
            <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed max-h-[300px]">
              <div>From: &quot;{fromName}&quot; &lt;{fromEmail}&gt;</div>
              <div>To: &quot;{recipient.name}&quot; &lt;{recipient.email}&gt;</div>
              <div>Subject: {renderedSubject}</div>
              <div>MIME-Version: 1.0</div>
              <div>Content-Type: multipart/mixed; boundary=&quot;====boundary_...====&quot;</div>
              <div className="my-2 text-slate-400">--====boundary_...====</div>
              <div>Content-Type: text/html; charset=&quot;UTF-8&quot;</div>
              <div>Content-Transfer-Encoding: base64</div>
              <div className="text-slate-400">[Base64 Encoded HTML Body...]</div>
              <div className="my-2 text-slate-400">--====boundary_...====</div>
              <div>Content-Type: application/pdf; name=&quot;{resume?.fileName}&quot;</div>
              <div>Content-Transfer-Encoding: base64</div>
              <div>Content-Disposition: attachment; filename=&quot;{resume?.fileName}&quot;</div>
              <div className="text-slate-400">[Base64 Encoded PDF Resume Binary...]</div>
              <div className="my-2 text-slate-400">--====boundary_...====--</div>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl p-4 bg-white text-xs leading-relaxed text-slate-800 shadow-2xs">
              <div
                className="prose prose-xs max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-1 prose-headings:font-semibold"
                dangerouslySetInnerHTML={{ __html: renderedBody }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => {
              onSendSingle(recipient);
              onClose();
            }}
            disabled={isDispatching}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send to This Recruiter Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
