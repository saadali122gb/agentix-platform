/**
 * Email channel abstraction (Outlook / Gmail).
 * Stubbed until OAuth credentials and a provider SDK are wired up.
 * Sending is a side-effecting action and should require explicit approval
 * in the calling agent before it is invoked.
 */
export async function sendEmail({ to, subject, body, provider = 'outlook' }) {
  // TODO: implement Microsoft Graph (Outlook) and Gmail API senders.
  return { mock: true, provider, to, subject, bodyPreview: body?.slice(0, 80) }
}
