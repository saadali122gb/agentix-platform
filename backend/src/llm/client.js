import Anthropic from '@anthropic-ai/sdk'
import { config, features } from '../config/env.js'
import { fetchJson } from '../lib/http.js'

let anthropicClient = null
function getAnthropic() {
  if (!features.llm) return null
  if (!anthropicClient) anthropicClient = new Anthropic({ apiKey: config.anthropic.apiKey })
  return anthropicClient
}

/** Decide which provider serves a given model id. */
function providerForModel(model) {
  if (model?.startsWith('gemini')) return 'gemini'
  if (model?.startsWith('claude')) return 'anthropic'
  return config.llm.defaultProvider
}

/**
 * Run a single-turn completion with a system prompt.
 * Provider is chosen from the model id (claude* -> Anthropic, gemini* -> Google),
 * falling back to LLM_PROVIDER. Returns a mock response when the needed key is
 * missing so the platform stays runnable in development.
 *
 * @param {{ system?: string, messages: {role,content}[], maxTokens?: number, model?: string }} opts
 */
export async function complete({ system, messages, maxTokens = 1024, model }) {
  const provider = providerForModel(model)

  if (provider === 'gemini') {
    return features.gemini
      ? completeGemini({ system, messages, maxTokens, model: model || config.gemini.model })
      : mock('GEMINI_API_KEY')
  }

  return features.llm
    ? completeAnthropic({ system, messages, maxTokens, model: model || config.anthropic.model })
    : mock('ANTHROPIC_API_KEY')
}

function mock(whichKey) {
  return { mock: true, text: `[mock LLM] Configure ${whichKey} to enable real completions.` }
}

async function completeAnthropic({ system, messages, maxTokens, model }) {
  const res = await getAnthropic().messages.create({ model, max_tokens: maxTokens, system, messages })
  const text = res.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
  return { mock: false, provider: 'anthropic', model, text, usage: res.usage }
}

async function completeGemini({ system, messages, maxTokens, model }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const data = await fetchJson(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': config.gemini.apiKey,
    },
    body: JSON.stringify({
      ...(system ? { system_instruction: { parts: [{ text: system }] } } : {}),
      contents,
      generationConfig: { maxOutputTokens: maxTokens },
    }),
  })

  const text = (data.candidates?.[0]?.content?.parts || [])
    .map((p) => p.text)
    .filter(Boolean)
    .join('\n')
  return { mock: false, provider: 'gemini', model, text, usage: data.usageMetadata }
}
