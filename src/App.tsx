import React, { useState, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import confetti from 'canvas-confetti';
import {
  Mail,
  Send,
  Upload,
  FileText,
  Eye,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  LogOut,
  Sparkles,
  Download,
  X,
  Clock,
  Trash2,
  Check
} from 'lucide-react';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken
} from './services/firebase';
import { sendGmailMessage, EmailPayload } from './services/gmail';
import { ResumeData } from './types';

// Standard high-converting SDET resume email template
const DEFAULT_SUBJECT = 'Application: SDET / Automation Engineer (Playwright + TypeScript | 3 YOE) - Akash Kollabathula';

const DEFAULT_BODY = `Hi {{name}},

I am reaching out to explore SDET / QA Automation Engineer opportunities at {{company}}.

With 3 years of professional experience as a QA Automation Software Engineer at HCL Technologies, my core strengths include:
• Playwright & TypeScript Frameworks: Designed and scaled Page Object Model (POM) frameworks with custom fixtures, auto-waiting, and parallel workers, achieving 60%+ automation coverage.
• Flaky Test Reduction: Decreased test suite flakiness from 25% to under 15% using reliable locators and web-first assertions.
• REST API Automation: Automated 50+ REST API test cases using Playwright APIRequestContext and Postman, validating JSON schemas and API contracts.
• CI/CD Pipelines: Integrated test suites with GitHub Actions and Jenkins for automated regression and Allure reporting.
• AI-Assisted Testing: Applied Playwright MCP Server, Copilot, and agents to speed up test design and maintenance by ~40%.

I have attached my updated resume for your review. I would love the chance to connect and discuss how my hands-on QA expertise can add value to {{company}}.

Thank you for your time and consideration!

Best regards,
Akash Kollabathula
SDET | Playwright + TypeScript Automation Engineer
Email: kollabathula.akash.test@gmail.com | Phone: +91 9676996550 | Location: Hyderabad, India`;

interface ParsedRecipient {
  email: string;
  name: string;
  company: string;
  role: string;
  status: 'idle' | 'sending' | 'sent' | 'failed';
  error?: string;
}

export default function App() {
  // Google Auth
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Resume State
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Email Format Editor
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [body, setBody] = useState(DEFAULT_BODY);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  // Bulk Emails Text Box
  const [emailsText, setEmailsText] = useState(
    'kollabathula.akash.test@gmail.com, Akash (Self-Test), Tech Team\nrecruiter@google.com, Google Recruiter, Google\ncareers@microsoft.com, Microsoft Talent, Microsoft'
  );

  // Sending & Progress
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState<{ current: number; total: number } | null>(null);
  const [results, setResults] = useState<ParsedRecipient[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Load default resume on mount
  useEffect(() => {
    async function loadResume() {
      try {
        const resumeUrl = './assets/aistudio/Akash_3_YOE_Playwright_524d041b.pdf';
        const res = await fetch(resumeUrl);
        if (res.ok) {
          const blob = await res.blob();
          const buffer = await blob.arrayBuffer();
          let binary = '';
          const bytes = new Uint8Array(buffer);
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64Data = btoa(binary);

          setResume({
            fileName: 'Akash_Kollabathula_SDET_Playwright_3YOE.pdf',
            displayName: 'Akash Kollabathula - SDET Resume',
            fileSize: blob.size,
            mimeType: 'application/pdf',
            base64Data,
            url: resumeUrl,
          });
        }
      } catch (err) {
        console.warn('Could not auto-load resume:', err);
      }
    }
    loadResume();
  }, []);

  // Initialize Auth
  useEffect(() => {
    const unsub = initAuth(
      (currentUser, cachedToken) => {
        setUser(currentUser);
        if (cachedToken) setToken(cachedToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsub();
  }, []);

  // Sign in with Google
  const handleSignIn = async () => {
    setIsLoggingIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
      }
    } catch (err: any) {
      alert(`Google sign in failed: ${err.message || err}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setToken(null);
  };

  // Upload/change resume PDF
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file.');
        return;
      }
      setIsUploadingResume(true);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.replace(/^data:[^;]+;base64,/, '');
        setResume({
          fileName: file.name,
          displayName: file.name,
          fileSize: file.size,
          mimeType: 'application/pdf',
          base64Data,
          url: URL.createObjectURL(file),
        });
        setIsUploadingResume(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Parse bulk emails from text box
  const parseEmails = (text: string): ParsedRecipient[] => {
    const lines = text.split(/[\r\n]+/);
    const list: ParsedRecipient[] = [];
    const seen = new Set<string>();

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      let email = '';
      let name = '';
      let company = '';

      // Check Angle brackets: Name <email@example.com>
      const angleMatch = line.match(/^([^<]+)<([^>]+)>/);
      if (angleMatch) {
        name = angleMatch[1].trim();
        email = angleMatch[2].trim();
      } else if (line.includes(',') || line.includes('\t') || line.includes(';')) {
        const parts = line.split(/[,;\t]+/).map((p) => p.trim());
        const emailIdx = parts.findIndex((p) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p));
        if (emailIdx !== -1) {
          email = parts[emailIdx];
          const other = parts.filter((_, idx) => idx !== emailIdx);
          if (other.length > 0) name = other[0];
          if (other.length > 1) company = other[1];
        }
      } else {
        const words = line.split(/\s+/);
        const found = words.find((w) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(w));
        if (found) {
          email = found;
          const other = words.filter((w) => w !== found);
          if (other.length > 0) name = other.join(' ');
        }
      }

      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        const cleanEmail = email.toLowerCase();
        if (!seen.has(cleanEmail)) {
          seen.add(cleanEmail);
          if (!company) {
            const domain = cleanEmail.split('@')[1];
            if (domain && !['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'].includes(domain)) {
              company = domain.split('.')[0].toUpperCase();
            }
          }
          list.push({
            email: cleanEmail,
            name: name || 'Hiring Team',
            company: company || 'Your Company',
            role: 'SDET / QA Automation Engineer',
            status: 'idle',
          });
        }
      }
    }
    return list;
  };

  const parsedRecipients = parseEmails(emailsText);

  // Insert dynamic tag into body
  const insertTag = (tag: string) => {
    setBody((prev) => prev + ' ' + tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 1200);
  };

  // Render text replacing {{name}}, {{company}}, {{role}}
  const renderTemplate = (text: string, rec?: ParsedRecipient) => {
    const rName = rec?.name || 'Hiring Team';
    const rCompany = rec?.company || 'Your Company';
    const rRole = rec?.role || 'SDET / QA Automation Engineer';

    return text
      .replace(/\{\{name\}\}/g, rName)
      .replace(/\{\{recruiter_name\}\}/g, rName)
      .replace(/\{\{company\}\}/g, rCompany)
      .replace(/\{\{role\}\}/g, rRole);
  };

  // Trigger Send Modal
  const handleOpenSend = () => {
    if (parsedRecipients.length === 0) {
      alert('Please enter at least one valid recipient email in the emails box.');
      return;
    }
    setShowConfirmModal(true);
  };

  // Execute Sending via Gmail API
  const handleConfirmSend = async () => {
    setShowConfirmModal(false);

    let activeToken = token || (await getAccessToken());
    if (!activeToken) {
      try {
        const res = await googleSignIn();
        if (res) {
          activeToken = res.accessToken;
          setUser(res.user);
          setToken(res.accessToken);
        }
      } catch (e: any) {
        alert('Google Sign-In required to send emails via Gmail.');
        return;
      }
    }

    if (!activeToken) return;

    setIsSending(true);
    const queue = [...parsedRecipients];
    setResults(queue);
    setSendProgress({ current: 0, total: queue.length });

    let sentSuccess = 0;

    for (let i = 0; i < queue.length; i++) {
      const rec = queue[i];

      // Update recipient status to sending
      setResults((prev) =>
        prev.map((r, idx) => (idx === i ? { ...r, status: 'sending' } : r))
      );

      try {
        const renderedSubject = renderTemplate(subject, rec);
        const renderedBody = renderTemplate(body, rec);
        const htmlBody = renderedBody.replace(/\n/g, '<br/>');

        const payload: EmailPayload = {
          to: rec.email,
          toName: rec.name,
          fromEmail: user?.email || 'kollabathula.akash.test@gmail.com',
          fromName: user?.displayName || 'Akash Kollabathula',
          subject: renderedSubject,
          htmlBody: `<div>${htmlBody}</div>`,
          attachment: resume?.base64Data
            ? {
                filename: resume.fileName,
                mimeType: 'application/pdf',
                base64Data: resume.base64Data,
              }
            : undefined,
        };

        await sendGmailMessage(activeToken, payload);

        setResults((prev) =>
          prev.map((r, idx) => (idx === i ? { ...r, status: 'sent' } : r))
        );
        sentSuccess++;
      } catch (err: any) {
        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i ? { ...r, status: 'failed', error: err.message || 'Send error' } : r
          )
        );
      }

      setSendProgress({ current: i + 1, total: queue.length });

      // 1.5s delay between sends to respect rate limits
      if (i < queue.length - 1) {
        await new Promise((r) => setTimeout(r, 1500));
      }
    }

    setIsSending(false);

    if (sentSuccess > 0) {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    }
  };

  const samplePreview = parsedRecipients[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Clean Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 text-lg leading-tight tracking-tight">SendEmails</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Bulk Job Application &amp; Resume Dispatcher</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-medium text-emerald-900 truncate max-w-[160px] sm:max-w-none">
                  {user.email}
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-slate-400 hover:text-slate-700 ml-1 p-0.5"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSignIn}
                disabled={isLoggingIn}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-slate-300 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs transition-all cursor-pointer"
              >
                <svg viewBox="0 0 48 48" className="w-4 h-4">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{isLoggingIn ? 'Connecting...' : 'Connect Gmail'}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6 flex-1">
        {/* 1. Resume Upload Editor */}
        <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-800">1. Latest Resume (Attached to all emails)</h2>
            </div>
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              PDF Ready
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                PDF
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-900 truncate">
                  {resume ? resume.fileName : 'Loading resume...'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {resume ? `${(resume.fileSize / 1024).toFixed(1)} KB` : '124 KB'} • Playwright + TypeScript SDET (3 YOE)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {resume?.url && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowPdfModal(true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>View PDF</span>
                  </button>
                  <a
                    href={resume.url}
                    download={resume.fileName}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Download</span>
                  </a>
                </>
              )}

              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-xs">
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploadingResume ? 'Uploading...' : 'Upload New Resume'}</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </section>

        {/* 2. Email Formatter Editor & Preview Template */}
        <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-800">2. Email Formatter &amp; Template</h2>
            </div>
            {/* Edit / Preview Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTab === 'edit'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Format Editor
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Preview Template
              </button>
            </div>
          </div>

          {/* Dynamic Tags Bar */}
          <div className="mb-3 flex flex-wrap items-center gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-xs">
            <span className="text-slate-500 font-medium mr-1">Insert Dynamic Tags:</span>
            {[
              { tag: '{{name}}', label: 'Recruiter Name' },
              { tag: '{{company}}', label: 'Company Name' },
              { tag: '{{role}}', label: 'Target Role' },
            ].map((item) => (
              <button
                key={item.tag}
                type="button"
                onClick={() => insertTag(item.tag)}
                className="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-700 text-xs font-mono transition-colors cursor-pointer shadow-2xs inline-flex items-center gap-1"
                title="Click to insert into email format"
              >
                <span>{item.tag}</span>
                {copiedTag === item.tag ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <span className="text-[10px] text-slate-400 font-sans">({item.label})</span>
                )}
              </button>
            ))}
          </div>

          {/* Subject Line */}
          <div className="mb-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subject:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          {/* Body Editor or Preview Tab */}
          {activeTab === 'edit' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Format Body:
              </label>
              <textarea
                rows={9}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full p-3 text-xs font-mono border border-slate-300 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 leading-relaxed resize-y"
              />
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-xs space-y-3">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Preview with sample data ({samplePreview?.name || 'Recruiter'} at {samplePreview?.company || 'Company'}):
              </div>
              <div className="font-semibold text-slate-900 pb-2 border-b border-slate-200">
                Subject: {renderTemplate(subject, samplePreview)}
              </div>
              <div className="whitespace-pre-line text-slate-800 leading-relaxed font-sans bg-white p-3 rounded-lg border border-slate-200">
                {renderTemplate(body, samplePreview)}
              </div>
              <div className="text-[11px] text-blue-700 flex items-center gap-1.5 font-medium">
                <FileText className="w-3.5 h-3.5" />
                <span>Attachment: {resume?.fileName || 'Resume.pdf'} (PDF)</span>
              </div>
            </div>
          )}
        </section>

        {/* 3. One Emails Text Box & Send Button */}
        <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-800">3. Recipient Senders &amp; Emails Box</h2>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {parsedRecipients.length} Recipient{parsedRecipients.length !== 1 ? 's' : ''} detected
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-2">
            Paste emails below. Supports one per line or formats like <code className="font-mono text-slate-700">recruiter@company.com</code> or <code className="font-mono text-slate-700">email, Name, Company</code>.
          </p>

          <textarea
            rows={5}
            value={emailsText}
            onChange={(e) => setEmailsText(e.target.value)}
            placeholder="paste emails here..."
            className="w-full p-3 text-xs font-mono border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 leading-relaxed mb-4"
          />

          {/* Quick self test pill */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                if (!emailsText.includes('kollabathula.akash.test@gmail.com')) {
                  setEmailsText((prev) =>
                    `kollabathula.akash.test@gmail.com, Akash (Self-Test), Tech\n` + prev
                  );
                }
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 cursor-pointer hover:underline"
            >
              <Sparkles className="w-3 h-3" />
              <span>Add my email (kollabathula.akash.test@gmail.com) for safe test run</span>
            </button>

            <button
              type="button"
              onClick={() => setEmailsText('')}
              className="text-xs text-rose-500 hover:text-rose-700 font-medium cursor-pointer"
            >
              Clear emails box
            </button>
          </div>

          {/* The Big Send Button */}
          <button
            type="button"
            onClick={handleOpenSend}
            disabled={isSending || parsedRecipients.length === 0}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
              parsedRecipients.length === 0 || isSending
                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99] shadow-blue-500/20'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>
              {isSending
                ? `Sending Emails (${sendProgress?.current || 0}/${sendProgress?.total || 0})...`
                : `Send Email with Attached Resume (${parsedRecipients.length} Recipient${parsedRecipients.length !== 1 ? 's' : ''})`}
            </span>
          </button>
        </section>

        {/* 4. Live Results / Status when sending */}
        {results.length > 0 && (
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Send Status &amp; Receipts:
              </h3>
              <a
                href="https://mail.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Check Gmail Sent Folder</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto text-xs">
              {results.map((r, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-800">{r.email}</span>
                    <span className="text-slate-500 text-[11px] ml-2">({r.name} • {r.company})</span>
                  </div>

                  <div>
                    {r.status === 'idle' && (
                      <span className="text-slate-400 text-[11px]">Queued</span>
                    )}
                    {r.status === 'sending' && (
                      <span className="text-blue-600 font-medium text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3 animate-spin" /> Sending...
                      </span>
                    )}
                    {r.status === 'sent' && (
                      <span className="text-emerald-600 font-semibold text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Sent with Resume
                      </span>
                    )}
                    {r.status === 'failed' && (
                      <span className="text-rose-600 font-medium text-[11px] flex items-center gap-1" title={r.error}>
                        <AlertCircle className="w-3.5 h-3.5" /> Failed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Confirm Sending {parsedRecipients.length} Email(s)
              </h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <strong>Sending Account:</strong> {user?.email || 'kollabathula.akash.test@gmail.com'}
              </div>
              <div>
                <strong>Attached Resume:</strong> {resume?.fileName || 'Akash_Kollabathula_SDET_3YOE.pdf'}
              </div>
              <div>
                <strong>Recipients:</strong> {parsedRecipients.length} email addresses
              </div>
              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                Emails will be dispatched via Gmail API with 1.5s intervals to protect your sender reputation.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSend}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
              >
                Confirm &amp; Send Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {showPdfModal && resume?.url && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl h-[80vh] rounded-2xl shadow-xl flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="text-xs font-bold text-slate-800">{resume.fileName}</span>
              <button
                onClick={() => setShowPdfModal(false)}
                className="text-slate-500 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 bg-slate-100 p-2">
              <iframe
                src={`${resume.url}#toolbar=0`}
                className="w-full h-full rounded-lg border border-slate-300"
                title="Resume Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="flex items-center justify-center gap-2 font-medium text-slate-700">
          <span className="font-bold text-slate-900">SendEmails</span>
          <span>•</span>
          <span>by <strong className="text-blue-600 font-extrabold tracking-wide">Ak@sh</strong></span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Automated Job Opportunity &amp; Resume Outreach • Ready for GitHub Pages
        </p>
      </footer>
    </div>
  );
}
