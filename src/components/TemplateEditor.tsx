import React, { useState } from 'react';
import {
  FileCode2,
  Sparkles,
  Eye,
  Edit3,
  Copy,
  Check,
  Tag,
  Paperclip,
  Wand2,
  RefreshCw
} from 'lucide-react';
import { EmailTemplate, Recipient } from '../types';
import { EMAIL_TEMPLATES, DEFAULT_USER_INFO } from '../data/templates';

interface TemplateEditorProps {
  selectedTemplateId: string;
  onSelectTemplate: (template: EmailTemplate) => void;
  subject: string;
  onChangeSubject: (subject: string) => void;
  body: string;
  onChangeBody: (body: string) => void;
  sampleRecipient?: Recipient;
  onOpenPreview: () => void;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  selectedTemplateId,
  onSelectTemplate,
  subject,
  onChangeSubject,
  body,
  onChangeBody,
  sampleRecipient,
  onOpenPreview,
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [isPolishing, setIsPolishing] = useState(false);

  const availableTags = [
    { tag: '{{recruiter_name}}', label: 'Recruiter Name', example: 'Hiring Team' },
    { tag: '{{company}}', label: 'Company', example: 'Tech Corp' },
    { tag: '{{role}}', label: 'Target Role', example: 'SDET / QA Automation' },
    { tag: '{{my_name}}', label: 'My Name', example: DEFAULT_USER_INFO.name },
    { tag: '{{my_email}}', label: 'My Email', example: DEFAULT_USER_INFO.email },
    { tag: '{{my_phone}}', label: 'My Phone', example: DEFAULT_USER_INFO.phone },
    { tag: '{{my_location}}', label: 'My City', example: DEFAULT_USER_INFO.location },
  ];

  const insertTag = (tag: string) => {
    onChangeBody(body + ' ' + tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 1500);
  };

  // Helper to replace tags for preview
  const getRenderedContent = (rawText: string) => {
    const rName = sampleRecipient?.name || 'Recruiter / Hiring Manager';
    const rComp = sampleRecipient?.company || 'Your Company';
    const rRole = sampleRecipient?.role || 'SDET / QA Automation Engineer';

    return rawText
      .replace(/\{\{recruiter_name\}\}/g, rName)
      .replace(/\{\{company\}\}/g, rComp)
      .replace(/\{\{role\}\}/g, rRole)
      .replace(/\{\{my_name\}\}/g, DEFAULT_USER_INFO.name)
      .replace(/\{\{my_email\}\}/g, DEFAULT_USER_INFO.email)
      .replace(/\{\{my_phone\}\}/g, DEFAULT_USER_INFO.phone)
      .replace(/\{\{my_location\}\}/g, DEFAULT_USER_INFO.location);
  };

  const handleAiPolish = () => {
    setIsPolishing(true);
    setTimeout(() => {
      // Enhance currently selected text or body with impactful keywords
      const current = body;
      const enhanced = current
        .replace(/opportunity/gi, 'impactful opportunity')
        .replace(/robust/gi, 'enterprise-grade, high-throughput');
      onChangeBody(enhanced);
      setIsPolishing(false);
    }, 600);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <FileCode2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Email Format &amp; Template</h2>
            <p className="text-xs text-slate-500">Tailored SDET opportunity pitches with dynamic variables</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {/* Template Selectors */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Select Pre-Crafted SDET Template:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {EMAIL_TEMPLATES.map((tmpl) => {
            const isSelected = tmpl.id === selectedTemplateId;
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => onSelectTemplate(tmpl)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600/30'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">{tmpl.title}</span>
                  {tmpl.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        tmpl.badge === 'Recommended'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {tmpl.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {tmpl.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Variables Bar */}
      <div className="mb-4 bg-slate-50 border border-slate-200/80 rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Tag className="w-3.5 h-3.5 text-indigo-600" />
            <span>Personalization Tags (Click to insert):</span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Replaced automatically per recipient
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {availableTags.map((t) => (
            <button
              key={t.tag}
              type="button"
              onClick={() => insertTag(t.tag)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-700 transition-colors cursor-pointer shadow-xs"
              title={`Example: ${t.example}`}
            >
              <span>{t.tag}</span>
              {copiedTag === t.tag ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <span className="text-[10px] text-slate-400 font-sans">({t.label})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Line */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-700">Email Subject Line:</label>
          <span className="text-[11px] text-slate-500">Supports variables</span>
        </div>
        <input
          type="text"
          value={subject}
          onChange={(e) => onChangeSubject(e.target.value)}
          placeholder="Application: SDET / Automation Engineer - {{company}}"
          className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
        />
      </div>

      {/* Body Area */}
      {activeTab === 'edit' ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">Email Body (HTML supported):</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAiPolish}
                disabled={isPolishing}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                title="Polish tone and sharpen keywords"
              >
                {isPolishing ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <Wand2 className="w-3 h-3" />
                )}
                <span>Polish Pitch</span>
              </button>
            </div>
          </div>
          <textarea
            rows={11}
            value={body}
            onChange={(e) => onChangeBody(e.target.value)}
            className="w-full p-3 text-xs font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 leading-relaxed resize-y"
            placeholder="Type your message with HTML tags or plain text..."
          />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">
              Sample Preview (for: {sampleRecipient?.name || 'Recruiter'} at {sampleRecipient?.company || 'Company'}):
            </span>
            <button
              type="button"
              onClick={onOpenPreview}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Full Screen Preview</span>
              <Eye className="w-3 h-3" />
            </button>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-3 max-h-[300px] overflow-y-auto">
            <div className="font-semibold text-slate-900 border-b border-slate-200 pb-2">
              Subject: {getRenderedContent(subject)}
            </div>
            <div
              className="text-slate-700 prose prose-xs max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-0.5"
              dangerouslySetInnerHTML={{ __html: getRenderedContent(body) }}
            />
          </div>
        </div>
      )}

      {/* Attachment Footer Notification */}
      <div className="mt-4 flex items-center justify-between px-3 py-2 bg-blue-50/70 border border-blue-200/60 rounded-xl text-xs text-blue-800">
        <div className="flex items-center gap-2">
          <Paperclip className="w-4 h-4 text-blue-600" />
          <span className="font-medium">
            Attached: <strong>{DEFAULT_USER_INFO.resumeFileName}</strong> (PDF)
          </span>
        </div>
        <span className="text-[11px] text-blue-600 hidden sm:inline">
          Base64 RFC 2822 Multipart
        </span>
      </div>
    </div>
  );
};
