import { config, features } from '../config/env.js'

/** Post an alert/notification to Slack via incoming webhook. */
export async function notifySlack(text) {
  if (!features.slack) {
    return { mock: true, text }
  }
  const res = await fetch(config.slack.webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  if (!res.ok) throw new Error(`Slack webhook failed: ${res.status}`)
  return { mock: false, ok: true }
}
