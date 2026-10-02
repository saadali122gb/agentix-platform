import { similaritySearch } from './vectorStore.js'
import { embed } from '../llm/embeddings.js'
import { complete } from '../llm/client.js'
import { buildSystemPrompt } from '../guardrails/systemPrompt.js'

/**
 * RAG query pipeline:
 *   embed query -> retrieve chunks -> answer grounded in chunks.
 * Falls back to mock embeddings/chunks and a mock LLM answer when the
 * corresponding services are not configured.
 */
export async function answerFromKnowledgeBase(query, { matchCount = 5 } = {}) {
  const [embedding] = await embed(query, { inputType: 'query' })
  const chunks = await similaritySearch(embedding, matchCount)

  const context = chunks
    .map((c, i) => `[${i + 1}] ${c.content}`)
    .join('\n')

  const system = buildSystemPrompt(
    'Answer ONLY from the provided context. Cite sources as [n]. If the answer is not in the context, say you do not have that information.',
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
