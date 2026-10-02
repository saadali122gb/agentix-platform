import { buildSystemPrompt } from '../guardrails/systemPrompt.js'
import { assertCanUseCategory, scopeFor } from '../guardrails/rbac.js'
import { checkOutput } from '../guardrails/outputChecker.js'
import { complete } from '../llm/client.js'

/**
 * Execute an agent turn through the full safety pipeline:
 *   1. RBAC check (role allowed to use this category?)
 *   2. build guardrail-wrapped system prompt
 *   3. LLM completion
 *   4. output compliance check (fail closed)
 *
 * @param {object} agent   agent definition { id, name, category, instructions }
 * @param {object} ctx     { role, userId, input }
 */
export async function runAgent(agent, { role, userId, input }) {
  assertCanUseCategory(role, agent.category)
  const scope = scopeFor(role, userId)

  const system = buildSystemPrompt(agent.instructions)
  const draft = await complete({
    system,
    messages: [{ role: 'user', content: input }],
    maxTokens: 800,
  })

  const verdict = await checkOutput(draft.text)
  if (!verdict.allow) {
    return {
      agent: agent.id,
      blocked: true,
      reason: verdict.reason,
      scope,
    }
  }

  return {
    agent: agent.id,
    blocked: false,
    output: draft.text,
    mock: draft.mock,
    scope,
  }
}
