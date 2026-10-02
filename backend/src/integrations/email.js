import { fetchJson } from '../lib/http.js'

/**
 * Email senders for Outlook (Microsoft Graph) and Gmail (Gmail API).
 *
 * Sending is a side-effecting action: the calling agent must obtain explicit
 * approval before invoking this. A per-user OAuth `accessToken` is required —
 * it is NOT read from env, because tokens are per-user and short-lived. Wire up
 * the OAuth authorization-code flow (Microsoft identity platform / Google OAuth)
 * in your auth layer and pass the resulting access token here.
 *
 * Without a token it returns a mock result so flows can be exercised in dev.
 */
export async function sendEmail({
  to,
  subject,
  body,
  provider = 'outlook',
  accessToken,
  html = true,
}) {
  if (!accessToken) {
    return { mock: true, provider, to, subject, reason: 'no accessToken supplied' }
  }
  return provider === 'gmail'
    ? sendGmail({ to, subject, body, accessToken, html })
    : sendOutlook({ to, subject, body, accessToken, html })
}

async function sendOutlook({ to, subject, body, accessToken, html }) {
  // Microsoft Graph returns 202 with no body on success.
  await fetchJson('https://graph.microsoft.com/v1.0/me/sendMail', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: {
        subject,
        body: { contentType: html ? 'HTML' : 'Text', content: body },
        toRecipients: toList(to).map((address) => ({ emailAddress: { address } })),
      },
      saveToSentItems: true,
    }),
  })
  return { mock: false, provider: 'outlook', to, subject, sent: true }
}

async function sendGmail({ to, subject, body, accessToken, html }) {
  const mime = buildMime({ to, subject, body, html })
  const raw = base64Url(mime)
  const res = await fetchJson(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    },
  )
  return { mock: false, provider: 'gmail', to, subject, sent: true, id: res.id }
}

function toList(to) {
  return Array.isArray(to) ? to : [to]
}

function buildMime({ to, subject, body, html }) {
  const contentType = html ? 'text/html' : 'text/plain'
  return [
    `To: ${toList(to).join(', ')}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    `Content-Type: ${contentType}; charset="UTF-8"`,
    '',
    body,
  ].join('\r\n')
}

function base64Url(str) {
  return Buffer.from(str, 'utf-8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}
