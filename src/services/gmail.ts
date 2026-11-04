export interface AttachmentInfo {
  filename: string;
  mimeType: string;
  base64Data: string; // standard base64 string
}

export interface EmailPayload {
  to: string;
  toName?: string;
  fromEmail: string;
  fromName: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
  attachment?: AttachmentInfo;
}

// Convert a UTF-8 string to Base64 safely
function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert standard base64 string to URL-safe base64 string
function base64ToBase64Url(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Builds an RFC 2822 compliant MIME message string and returns its URL-safe base64 string
 * suitable for the Gmail API raw property.
 */
export function buildRfc2822Message(payload: EmailPayload): string {
  const boundary = `====boundary_${Date.now()}_${Math.random().toString(36).substring(2)}====`;

  // Format encoded subject if needed
  const encodedSubject = `=?UTF-8?B?${utf8ToBase64(payload.subject)}?=`;

  const toHeader = payload.toName
    ? `"${payload.toName.replace(/"/g, '')}" <${payload.to.trim()}>`
    : payload.to.trim();

  const fromHeader = payload.fromName
    ? `"${payload.fromName.replace(/"/g, '')}" <${payload.fromEmail.trim()}>`
    : payload.fromEmail.trim();

  const base64Html = utf8ToBase64(payload.htmlBody);

  const lines: string[] = [
    `From: ${fromHeader}`,
    `To: ${toHeader}`,
    `Subject: ${encodedSubject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    `Content-Type: text/html; charset="UTF-8"`,
    `Content-Transfer-Encoding: base64`,
    '',
    base64Html,
    ''
  ];

  if (payload.attachment && payload.attachment.base64Data) {
    const cleanBase64 = payload.attachment.base64Data
      .replace(/^data:[^;]+;base64,/, '')
      .replace(/\s/g, '');

    lines.push(
      `--${boundary}`,
      `Content-Type: ${payload.attachment.mimeType || 'application/pdf'}; name="${payload.attachment.filename}"`,
      `Content-Transfer-Encoding: base64`,
      `Content-Disposition: attachment; filename="${payload.attachment.filename}"`,
      '',
      cleanBase64,
      ''
    );
  }

  lines.push(`--${boundary}--`, '');

  const fullMimeMessage = lines.join('\r\n');
  const base64Mime = btoa(fullMimeMessage);
  return base64ToBase64Url(base64Mime);
}

/**
 * Sends an email via Gmail API
 */
export async function sendGmailMessage(accessToken: string, payload: EmailPayload): Promise<{ id: string; threadId: string }> {
  const raw = buildRfc2822Message(payload);

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const message = errData?.error?.message || `Gmail send failed with status ${response.status}: ${response.statusText}`;
    throw new Error(message);
  }

  return response.json();
}

/**
 * Creates an email draft in Gmail
 */
export async function createGmailDraft(accessToken: string, payload: EmailPayload): Promise<{ id: string; message: { id: string } }> {
  const raw = buildRfc2822Message(payload);

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: { raw },
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const message = errData?.error?.message || `Gmail draft creation failed with status ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}

/**
 * Fetches the authenticated user's Gmail profile
 */
export async function getGmailProfile(accessToken: string): Promise<{ emailAddress: string; messagesTotal?: number }> {
  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Gmail profile: ${response.statusText}`);
  }

  return response.json();
}
