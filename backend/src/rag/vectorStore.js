import { createClient } from '@supabase/supabase-js'
import { config, features } from '../config/env.js'

let supabase = null
export function getSupabase() {
  if (!features.vectorStore) return null
  if (!supabase) {
    supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      auth: { persistSession: false },
    })
  }
  return supabase
}

/**
 * Insert embedded chunks into the `documents` table.
 * @param {Array<{content:string, embedding:number[], source?:string, metadata?:object}>} rows
 */
export async function insertChunks(rows) {
  const db = getSupabase()
  if (!db) return { mock: true, inserted: rows.length, ids: [] }

  const { data, error } = await db.from('documents').insert(rows).select('id')
  if (error) throw new Error(`Supabase insert failed: ${error.message}`)
  return { mock: false, inserted: data.length, ids: data.map((d) => d.id) }
}

/**
 * Cosine-similarity search via the `match_documents` RPC (see db/schema.sql).
 * Returns mock chunks when Supabase is not configured so dev keeps working.
 */
export async function similaritySearch(embedding, matchCount = 5) {
  const db = getSupabase()
  if (!db) {
    return [
      { id: 'mock-1', content: '[mock] Claims must be acknowledged within 24h.', score: 0.91, metadata: {} },
      { id: 'mock-2', content: '[mock] Renewal notices go out 30 days before expiry.', score: 0.86, metadata: {} },
    ]
  }

  const { data, error } = await db.rpc('match_documents', {
    query_embedding: embedding,
    match_count: matchCount,
  })
  if (error) throw new Error(`Supabase match_documents failed: ${error.message}`)
  return data.map((d) => ({
    id: d.id,
    content: d.content,
    source: d.source,
    score: d.similarity,
    metadata: d.metadata,
  }))
}
