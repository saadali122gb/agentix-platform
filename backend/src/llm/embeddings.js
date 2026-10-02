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

  return config.embeddings.provider === 'openai'
    ? embedOpenAI(texts)
    : embedVoyage(texts, inputType)
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
