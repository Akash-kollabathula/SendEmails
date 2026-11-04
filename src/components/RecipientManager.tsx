import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Trash2,
  CheckSquare,
  Square,
  Sparkles,
  Mail,
  Building,
  Upload,
  Download,
  Eye,
  AlertCircle,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw
} from 'lucide-react';
import { Recipient } from '../types';
import { SAMPLE_RECRUITER_LIST, DEFAULT_USER_INFO } from '../data/templates';

interface RecipientManagerProps {
  recipients: Recipient[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onAddRecipients: (newRecipients: Recipient[]) => void;
  onRemoveRecipient: (id: string) => void;
  onClearAll: () => void;
  onPreviewRecipient: (recipient: Recipient) => void;
  onSendSingle: (recipient: Recipient) => void;
  isDispatching: boolean;
}

export const RecipientManager: React.FC<RecipientManagerProps> = ({
  recipients,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onAddRecipients,
  onRemoveRecipient,
  onClearAll,
  onPreviewRecipient,
  onSendSingle,
  isDispatching,
}) => {
  const [inputText, setInputText] = useState('');
  const [showInputCard, setShowInputCard] = useState(false);
  const [filter, setFilter] = useState<'all' | 'sent' | 'pending' | 'failed'>('all');

  // Smart parser for multiple formats
  const parseBulkText = (text: string): Recipient[] => {
    const lines = text.split(/[\r\n]+/);
    const parsed: Recipient[] = [];
    const seenEmails = new Set(recipients.map((r) => r.email.toLowerCase()));

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      let email = '';
      let name = '';
      let company = '';
      let role = 'SDET / QA Automation';

      // Pattern 1: Name <email@example.com>
      const angleMatch = line.match(/^([^<]+)<([^>]+)>/);
      if (angleMatch) {
        name = angleMatch[1].trim();
        email = angleMatch[2].trim();
      } else if (line.includes(',') || line.includes('\t') || line.includes(';')) {
        // Pattern 2: comma or tab separated: email, name, company, role
        const parts = line.split(/[,;\t]+/).map((p) => p.trim());
        const emailIndex = parts.findIndex((p) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p));

        if (emailIndex !== -1) {
          email = parts[emailIndex];
          const otherParts = parts.filter((_, idx) => idx !== emailIndex);
          if (otherParts.length > 0) name = otherParts[0];
          if (otherParts.length > 1) company = otherParts[1];
          if (otherParts.length > 2) role = otherParts[2];
        }
      } else {
        // Pattern 3: Simple email
        const words = line.split(/\s+/);
        const foundEmail = words.find((w) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(w));
        if (foundEmail) {
          email = foundEmail;
          const otherWords = words.filter((w) => w !== foundEmail);
          if (otherWords.length > 0) name = otherWords.join(' ');
        }
      }

      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        const cleanEmail = email.toLowerCase();
        if (!seenEmails.has(cleanEmail)) {
          seenEmails.add(cleanEmail);

          // Infer company from email domain if not provided
          if (!company) {
            const domain = cleanEmail.split('@')[1];
            if (domain && !['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'test.com'].includes(domain)) {
              company = domain.split('.')[0].toUpperCase();
            }
          }

          parsed.push({
            id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            email: cleanEmail,
            name: name || 'Hiring Manager',
            company: company || 'Engineering Team',
            role: role || 'SDET / Automation Engineer',
            status: 'idle',
          });
        }
      }
    }

    return parsed;
  };

  const handleProcessInput = () => {
    if (!inputText.trim()) return;
    const newItems = parseBulkText(inputText);
    if (newItems.length > 0) {
      onAddRecipients(newItems);
      setInputText('');
      setShowInputCard(false);
    } else {
      alert('Could not detect any valid email addresses. Please check formatting.');
    }
  };

  const handleAddSampleList = () => {
    const sampleRecipients: Recipient[] = SAMPLE_RECRUITER_LIST.map((s, idx) => ({
      id: `sample_${Date.now()}_${idx}`,
      email: s.email,
      name: s.name,
      company: s.company,
      role: s.role,
      status: 'idle',
    }));
    onAddRecipients(sampleRecipients);
  };

  const handleAddSelfTest = () => {
    const testRecipient: Recipient = {
      id: `test_${Date.now()}`,
      email: DEFAULT_USER_INFO.email,
      name: 'Akash (Self-Test Run)',
      company: 'Personal Test Inbox',
      role: 'SDET / Playwright QA Engineer',
      status: 'idle',
    };
    onAddRecipients([testRecipient]);
  };

  const filteredRecipients = recipients.filter((r) => {
    if (filter === 'sent') return r.status === 'sent' || r.status === 'drafted';
    if (filter === 'pending') return r.status === 'idle' || r.status === 'queued';
    if (filter === 'failed') return r.status === 'failed';
    return true;
  });

  const allSelected = recipients.length > 0 && selectedIds.size === recipients.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-900">Bulk Senders &amp; Recipients</h2>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
                {recipients.length} Total
              </span>
            </div>
            <p className="text-xs text-slate-500">Add recruiter emails, paste lists, or test with your own email</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleAddSelfTest}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/70 rounded-xl transition-all cursor-pointer shadow-2xs"
            title="Add your own email as a recipient to test sending and see the attached resume in your inbox!"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Add My Test Email</span>
          </button>

          <button
            type="button"
            onClick={() => setShowInputCard(!showInputCard)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/70 rounded-xl transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{showInputCard ? 'Hide Paste Box' : 'Paste Emails'}</span>
          </button>

          <button
            type="button"
            onClick={handleAddSampleList}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
            title="Load demo recruiters"
          >
            <span>Load Samples</span>
          </button>
        </div>
      </div>

      {/* Bulk Input Expansion Area */}
      {showInputCard && (
        <div className="mb-4 p-4 rounded-xl bg-slate-50 border border-slate-200 animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-800">
              Paste Recruiter Emails or CSV Data:
            </label>
            <span className="text-[11px] text-slate-500">
              Auto-detects names, emails &amp; companies
            </span>
          </div>
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Examples accepted:
recruiter@google.com
Jane Doe <jane@microsoft.com>
hr@amazon.com, Amazon, Tech Recruiter
kollabathula.akash.test@gmail.com, Akash, Test Company`}
            className="w-full p-3 text-xs font-mono border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 leading-relaxed mb-3"
          />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Separate by new lines, commas, or semicolons. Duplicates will be removed automatically.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowInputCard(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProcessInput}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Add Recipients
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Selection Header */}
      {recipients.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 px-1 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleSelectAll}
              className="flex items-center gap-1.5 font-medium hover:text-slate-900 cursor-pointer"
            >
              {allSelected ? (
                <CheckSquare className="w-4 h-4 text-blue-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>Select All ({selectedIds.size} of {recipients.length})</span>
            </button>

            {recipients.some((r) => r.status === 'sent') && (
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {recipients.filter((r) => r.status === 'sent').length} Sent
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  filter === 'all' ? 'bg-white font-semibold text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilter('pending')}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  filter === 'pending' ? 'bg-white font-semibold text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Pending
              </button>
              <button
                type="button"
                onClick={() => setFilter('sent')}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  filter === 'sent' ? 'bg-white font-semibold text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Sent
              </button>
              <button
                type="button"
                onClick={() => setFilter('failed')}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  filter === 'failed' ? 'bg-white font-semibold text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Failed
              </button>
            </div>

            <button
              type="button"
              onClick={onClearAll}
              disabled={isDispatching}
              className="text-[11px] text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1 hover:underline cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear List</span>
            </button>
          </div>
        </div>
      )}

      {/* Recipient Table / List */}
      {filteredRecipients.length === 0 ? (
        <div className="text-center py-10 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <Mail className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-xs font-semibold text-slate-700 mb-1">No recipients in this view</h3>
          <p className="text-[11px] text-slate-500 max-w-sm mx-auto mb-4">
            Add recruiter email addresses by clicking &quot;Paste Emails&quot;, &quot;Add My Test Email&quot;, or loading sample tech recruiting targets.
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleAddSelfTest}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Add Self Test Email</span>
            </button>
            <button
              type="button"
              onClick={handleAddSampleList}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Load 4 Sample Contacts</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-[360px] overflow-y-auto">
          {filteredRecipients.map((rec) => {
            const isSelected = selectedIds.has(rec.id);
            return (
              <div
                key={rec.id}
                className={`p-3 flex items-center justify-between gap-3 text-xs transition-colors ${
                  isSelected ? 'bg-blue-50/30' : 'hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => onToggleSelect(rec.id)}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer flex-shrink-0"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800 truncate">
                        {rec.name || 'Recruiter'}
                      </span>
                      {rec.company && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 truncate max-w-[120px]">
                          <Building className="w-2.5 h-2.5 text-slate-400" />
                          <span>{rec.company}</span>
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{rec.email}</div>
                  </div>
                </div>

                {/* Status Pill & Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {rec.status === 'idle' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                      Ready
                    </span>
                  )}
                  {rec.status === 'queued' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700 animate-pulse">
                      Queued
                    </span>
                  )}
                  {rec.status === 'sending' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-100 text-indigo-700 flex items-center gap-1">
                      <Clock className="w-3 h-3 animate-spin" />
                      <span>Sending...</span>
                    </span>
                  )}
                  {rec.status === 'sent' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Sent</span>
                    </span>
                  )}
                  {rec.status === 'drafted' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-100 text-purple-800 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Drafted</span>
                    </span>
                  )}
                  {rec.status === 'failed' && (
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-100 text-rose-800 flex items-center gap-1"
                      title={rec.error || 'Failed'}
                    >
                      <AlertCircle className="w-3 h-3" />
                      <span>Error</span>
                    </span>
                  )}

                  {/* Per-row buttons */}
                  <button
                    type="button"
                    onClick={() => onPreviewRecipient(rec)}
                    title="Preview personalized email for this recruiter"
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSendSingle(rec)}
                    disabled={isDispatching}
                    title="Send only to this recipient"
                    className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer disabled:opacity-40"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveRecipient(rec.id)}
                    disabled={isDispatching}
                    title="Remove from list"
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer disabled:opacity-40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
