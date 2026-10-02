/**
 * Fast, deterministic compliance pre-checks on agent output.
 * This is the cheap first pass; `outputChecker` runs the LLM validation pass.
 */

// Phrases that suggest an unauthorised binding commitment or policy advice.
const RED_FLAGS = [
  /\byou are (now )?covered\b/i,
  /\bguarantee[sd]? (your )?coverage\b/i,
  /\bi('|’)?ll bind (the|your) policy\b/i,
  /\byour premium (is|will be) \$?\d/i,
  /\bapproved your claim\b/i,
  /\bconsider this (a )?binding\b/i,
]

/**
 * @returns {{ ok: boolean, violations: string[] }}
 */
export function screenOutput(text = '') {
  const violations = []
  for (const rx of RED_FLAGS) {
    if (rx.test(text)) violations.push(rx.source)
  }
  return { ok: violations.length === 0, violations }
}
