import { complete } from '../llm/client.js'
import { screenOutput } from './compliance.js'

const CHECKER_SYSTEM = `You are a compliance reviewer for an insurance & trades AI platform.
Decide whether the DRAFT response violates any of these rules:
1. Makes a binding policy/coverage guarantee without licensed human approval.
2. Gives direct policy advice that requires a licensed professional.
3. Makes a sales commitment or quotes a binding premium.
Reply with a single JSON object: {"allow": boolean, "reason": string}. No other text.`

/**
 * Two-stage output validation:
 *  1. deterministic regex screen (cheap, always runs)
 *  2. LLM review (runs only if a key is configured; otherwise trusts stage 1)
 *
 * @returns {Promise<{ allow: boolean, reason: string, stage: string }>}
 */
export async function checkOutput(draft) {
  const screen = screenOutput(draft)
  if (!screen.ok) {
    return {
      allow: false,
      reason: `Blocked by compliance screen: ${screen.violations.join(', ')}`,
      stage: 'regex',
    }
  }

  const review = await complete({
    system: CHECKER_SYSTEM,
    messages: [{ role: 'user', content: `DRAFT:\n${draft}` }],
    maxTokens: 200,
    json: true,
  })

  if (review.mock) {
    return { allow: true, reason: 'Regex screen passed (LLM check skipped).', stage: 'regex-only' }
  }

  const parsed = parseVerdict(review.text)
  if (parsed) {
    return { allow: Boolean(parsed.allow), reason: parsed.reason || '', stage: 'llm' }
  }
  // Robust parse failed. The deterministic regex screen already passed, so
  // allow but flag it rather than blocking legitimate output on a format hiccup.
  return { allow: true, reason: 'Passed regex screen; LLM verdict unparseable.', stage: 'llm-unparsed' }
}

/** Tolerant JSON extraction: strips code fences and isolates the object. */
function parseVerdict(text = '') {
  let t = String(text).trim()
  t = t.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim()
  const start = t.indexOf('{')
  const end = t.lastIndexOf('}')
  if (start !== -1 && end !== -1 && end > start) t = t.slice(start, end + 1)
  try {
    return JSON.parse(t)
  } catch {
    return null
  }
}
