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
  })

  if (review.mock) {
    return { allow: true, reason: 'Regex screen passed (LLM check skipped).', stage: 'regex-only' }
  }

  try {
    const parsed = JSON.parse(review.text)
    return { allow: Boolean(parsed.allow), reason: parsed.reason || '', stage: 'llm' }
  } catch {
    // Fail closed if the checker response is unparseable.
    return { allow: false, reason: 'Checker returned an unparseable response.', stage: 'llm' }
  }
}
