import { similaritySearch } from './vectorStore.js'
import { complete } from '../llm/client.js'
import { buildSystemPrompt } from '../guardrails/systemPrompt.js'

/**
 * Minimal RAG query pipeline:
 *   embed query -> retrieve chunks -> answer grounded in chunks.
 *
 * Embedding is stubbed (returns a zero vector) until an embeddings
 * provider is wired up; retrieval falls back to mock chunks without Supabase.
 */
async function embed(/* text */) {
  // TODO: call an embeddings endpoint (e.g. Voyage / OpenAI) and return vector.
  return new Array(1536).fill(0)
}

export async function answerFromKnowledgeBase(query) {
  const embedding = await embed(query)
  const chunks = await similaritySearch(embedding)

  const context = chunks.map((c, i) => `[${i + 1}] ${c.content}`).join('\n')
  const system = buildSystemPrompt(
    'Answer ONLY from the provided context. If the answer is not in the context, say you do not have that information.',
  )

  const res = await complete({
    system,
    messages: [
      { role: 'user', content: `Context:\n${context}\n\nQuestion: ${query}` },
    ],
    maxTokens: 512,
  })

  return { answer: res.text, mock: res.mock, sources: chunks }
}
