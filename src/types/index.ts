export interface Recipient {
  id: string;
  email: string;
  name?: string;
  company?: string;
  role?: string;
  status: 'idle' | 'queued' | 'sending' | 'sent' | 'drafted' | 'failed';
  error?: string;
  messageId?: string;
  sentAt?: string;
}

export interface EmailTemplate {
  id: string;
  title: string;
  description: string;
  subject: string;
  body: string;
  badge?: string;
}

export interface SendLog {
  id: string;
  timestamp: string;
  recipientEmail: string;
  recipientName?: string;
  company?: string;
  status: 'sent' | 'drafted' | 'failed' | 'info';
  message: string;
  messageId?: string;
}

export interface ResumeData {
  fileName: string;
  displayName: string;
  fileSize: number;
  mimeType: string;
  base64Data: string; // pure base64
  url: string;
}

export interface UserProfile {
  email: string;
  displayName: string;
  photoURL?: string;
}
