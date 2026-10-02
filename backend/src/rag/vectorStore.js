import { createClient } from '@supabase/supabase-js'
import { config, features } from '../config/env.js'

let supabase = null
export function getSupabase() {
  if (!features.vectorStore) return null
  if (!supabase) {
    supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey)
  }
  return supabase
}

/**
 * Similarity search over the `documents` table using pgvector.
 * Expects a Postgres RPC `match_documents(query_embedding, match_count)`.
 * Returns mock chunks when Supabase is not configured.
 */
export async function similaritySearch(embedding, matchCount = 5) {
  const db = getSupabase()
  if (!db) {
    return [
      { id: 'mock-1', content: '[mock] Claims must be acknowledged within 24h.', score: 0.91 },
      { id: 'mock-2', content: '[mock] Renewal notices go out 30 days before expiry.', score: 0.86 },
    ]
  }

  const { data, error } = await db.rpc('match_documents', {
    query_embedding: embedding,
    match_count: matchCount,
  })
  if (error) throw error
  return data
}
