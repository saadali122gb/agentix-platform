import { config, features } from '../config/env.js'
import { fetchJson } from '../lib/http.js'

/**
 * Generate embeddings for one or more texts.
 * Returns an array of vectors (one per input), always in the same order.
 *
 * Provider is selected via EMBEDDINGS_PROVIDER (voyage | openai).
 * Without a key it returns deterministic zero-vectors so the pipeline keeps
 * running in development (retrieval then falls back to mock chunks).
 *
 * @param {string|string[]} input
 * @param {{ inputType?: 'document'|'query' }} opts
 * @returns {Promise<number[][]>}
 */
export async function embed(input, { inputType = 'document' } = {}) {
  const texts = Array.isArray(input) ? input : [input]

  if (!features.embeddings) {
    return texts.map(() => new Array(config.embeddings.dim).fill(0))
  }

  switch (config.embeddings.provider) {
    case 'gemini':
      return embedGemini(texts, inputType)
    case 'openai':
      return embedOpenAI(texts)
    default:
      return embedVoyage(texts, inputType)
  }
}

async function embedGemini(texts, inputType) {
  const model = config.embeddings.model
  const taskType = inputType === 'query' ? 'RETRIEVAL_QUERY' : 'RETRIEVAL_DOCUMENT'
  const data = await fetchJson(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:batchEmbedContents`,
    {
      method: 'POST',
      timeoutMs: 30000,
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': config.embeddings.apiKey,
      },
      body: JSON.stringify({
        requests: texts.map((text) => ({
          model: `models/${model}`,
          content: { parts: [{ text }] },
          taskType,
        })),
      }),
    },
  )
  return data.embeddings.map((e) => e.values)
}

async function embedVoyage(texts, inputType) {
  const data = await fetchJson('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.embeddings.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: texts,
      model: config.embeddings.model,
      input_type: inputType, // 'document' | 'query'
    }),
  })
  // Voyage returns data sorted by index.
  return data.data
    .sort((a, b) => a.index - b.index)
    .map((d) => d.embedding)
}

async function embedOpenAI(texts) {
  const data = await fetchJson('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.embeddings.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input: texts, model: config.embeddings.model }),
  })
  return data.data
    .sort((a, b) => a.index - b.index)
    .map((d) => d.embedding)
}
