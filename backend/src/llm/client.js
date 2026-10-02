import Anthropic from '@anthropic-ai/sdk'
import { config, features } from '../config/env.js'

let client = null
function getClient() {
  if (!features.llm) return null
  if (!client) client = new Anthropic({ apiKey: config.anthropic.apiKey })
  return client
}

/**
 * Run a single-turn completion with a system prompt.
 * Falls back to a mock response when no API key is configured so the
 * platform stays runnable end-to-end during development.
 */
export async function complete({ system, messages, maxTokens = 1024 }) {
  const c = getClient()
  if (!c) {
    return {
      mock: true,
      text: '[mock LLM] Configure ANTHROPIC_API_KEY to enable real completions.',
    }
  }

  const res = await c.messages.create({
    model: config.anthropic.model,
    max_tokens: maxTokens,
    system,
    messages,
  })

  const text = res.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n')

  return { mock: false, text, usage: res.usage }
}
