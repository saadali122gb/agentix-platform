import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'
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

/* --- Local file-backed store (used when Supabase isn't configured) ----- */
const __dirname = path.dirname(fileURLToPath(import.meta.url))
// On serverless (Vercel), the project dir is read-only — use a temp path.
const DATA_FILE = process.env.VERCEL
  ? path.join(os.tmpdir(), 'agentix-kb.json')
  : path.join(__dirname, '../../.data/kb.json')

function loadLocal() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
  } catch {
    return []
  }
}
function saveLocal(rows) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })
  fs.writeFileSync(DATA_FILE, JSON.stringify(rows))
}
function cosine(a, b) {
  let dot = 0
  let na = 0
  let nb = 0
  const n = Math.min(a.length, b.length)
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1)
}

/**
 * Insert embedded chunks.
 * @param {Array<{content:string, embedding:number[], source?:string, metadata?:object}>} rows
 */
export async function insertChunks(rows) {
  const db = getSupabase()
  if (!db) {
    const store = loadLocal()
    const added = rows.map((r) => ({ id: randomUUID(), ...r }))
    saveLocal([...store, ...added])
    return { mock: false, local: true, inserted: added.length, ids: added.map((r) => r.id) }
  }
  const { data, error } = await db.from('documents').insert(rows).select('id')
  if (error) throw new Error(`Supabase insert failed: ${error.message}`)
  return { mock: false, inserted: data.length, ids: data.map((d) => d.id) }
}

/** List ingested documents grouped by source (for the KB document list). */
export async function listStoredDocuments() {
  const db = getSupabase()
  if (!db) {
    const grouped = new Map()
    for (const r of loadLocal()) {
      const key = r.source || 'Untitled'
      const e = grouped.get(key) || { source: key, chunks: 0, mimetype: r.metadata?.mimetype }
      e.chunks += 1
      grouped.set(key, e)
    }
    return [...grouped.values()]
  }
  const { data, error } = await db
    .from('documents')
    .select('source, metadata')
    .order('created_at', { ascending: false })
  if (error) throw new Error(`Supabase list failed: ${error.message}`)
  const grouped = new Map()
  for (const r of data) {
    const key = r.source || 'Untitled'
    const e = grouped.get(key) || { source: key, chunks: 0, mimetype: r.metadata?.mimetype }
    e.chunks += 1
    grouped.set(key, e)
  }
  return [...grouped.values()]
}

/** Cosine-similarity search (Supabase pgvector, or the local store). */
export async function similaritySearch(embedding, matchCount = 5) {
  const db = getSupabase()
  if (!db) {
    const store = loadLocal()
    return store
      .map((r) => ({
        id: r.id,
        content: r.content,
        source: r.source,
        metadata: r.metadata,
        score: cosine(embedding, r.embedding || []),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, matchCount)
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
