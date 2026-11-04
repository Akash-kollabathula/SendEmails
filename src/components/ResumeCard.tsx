import React, { useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  Upload,
  CheckCircle,
  ExternalLink,
  Sparkles,
  User,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  X
} from 'lucide-react';
import { ResumeData } from '../types';
import { DEFAULT_USER_INFO } from '../data/templates';

interface ResumeCardProps {
  resume: ResumeData | null;
  onUpdateResume: (file: File) => Promise<void>;
  isLoadingResume: boolean;
}

export const ResumeCard: React.FC<ResumeCardProps> = ({
  resume,
  onUpdateResume,
  isLoadingResume,
}) => {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        onUpdateResume(file);
      } else {
        alert('Please select a valid PDF file.');
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        onUpdateResume(file);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 transition-all">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Your Resume Attachment</h2>
            <p className="text-xs text-slate-500">Automatically attached to every email as a clean PDF</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle className="w-3.5 h-3.5" />
          Ready to Send
        </span>
      </div>

      {/* Resume File Pill & Actions */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-3.5 mb-4 transition-all ${
          isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 font-bold text-xs uppercase shadow-xs">
              PDF
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-800 truncate" title={resume?.fileName || DEFAULT_USER_INFO.resumeFileName}>
                {resume?.fileName || DEFAULT_USER_INFO.resumeFileName}
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-2">
                <span>{resume ? `${(resume.fileSize / 1024).toFixed(1)} KB` : '124 KB'}</span>
                <span>•</span>
                <span className="text-emerald-600 font-medium">MIME application/pdf</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {resume?.url && (
              <>
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Preview</span>
                </button>
                <a
                  href={resume.url}
                  download={resume.fileName}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Download</span>
                </a>
              </>
            )}

            <label className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/60 rounded-lg transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Change PDF</span>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
                disabled={isLoadingResume}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Candidate Quick Info Card */}
      <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3 text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-700">
          <div className="flex items-center gap-1.5 font-semibold text-slate-900">
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span>{DEFAULT_USER_INFO.name}</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-md bg-blue-100/70 text-blue-800 font-medium">
            3 YOE Playwright QA
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-slate-600 text-[11px]">
          <div className="flex items-center gap-1.5 truncate">
            <Briefcase className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{DEFAULT_USER_INFO.currentRole}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{DEFAULT_USER_INFO.location}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{DEFAULT_USER_INFO.email}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{DEFAULT_USER_INFO.phone}</span>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && resume?.url && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-slate-800">{resume.fileName}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={resume.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
                  title="Open in new window"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-slate-100 p-2 overflow-hidden">
              <iframe
                src={`${resume.url}#toolbar=0`}
                className="w-full h-full rounded-lg border border-slate-300 shadow-inner"
                title="Resume Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
