import { chunkText } from './chunk.js'
import { embed } from '../llm/embeddings.js'
import { insertChunks } from './vectorStore.js'

/**
 * Ingest a document into the knowledge base:
 *   chunk -> embed (document mode) -> store in pgvector.
 *
 * @param {{ text: string, source?: string, metadata?: object }} doc
 */
export async function ingestDocument({ text, source = 'manual', metadata = {} }) {
  const chunks = chunkText(text)
  if (chunks.length === 0) return { chunks: 0, inserted: 0, ids: [] }

  const embeddings = await embed(chunks, { inputType: 'document' })
  const rows = chunks.map((content, i) => ({
    content,
    embedding: embeddings[i],
    source,
    metadata: { ...metadata, chunk: i },
  }))

  const result = await insertChunks(rows)
  return { chunks: chunks.length, ...result }
}
