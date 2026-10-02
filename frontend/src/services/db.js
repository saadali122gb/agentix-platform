import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { STARTER_AGENTS } from '@/data/starterAgents'
import * as local from './localStore'

// When Supabase isn't configured, the app runs in local dev mode backed by
// localStorage (see localStore.js). Otherwise all data lives in Supabase
// (Postgres + RLS), scoped to the signed-in user.

export { STARTER_AGENTS }

/* --- Agents ----------------------------------------------------------- */
export async function listAgents() {
  if (!isSupabaseConfigured) return local.listAgents()
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createAgent(userId, payload) {
  if (!isSupabaseConfigured) return local.createAgent(userId, payload)
  const { data, error } = await supabase
    .from('agents')
    .insert({ ...payload, user_id: userId })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateAgent(id, patch) {
  if (!isSupabaseConfigured) return local.updateAgent(id, patch)
  const { data, error } = await supabase
    .from('agents')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteAgent(id) {
  if (!isSupabaseConfigured) return local.deleteAgent(id)
  const { error } = await supabase.from('agents').delete().eq('id', id)
  if (error) throw error
}

export async function seedStarterAgents(userId) {
  if (!isSupabaseConfigured) return local.seedStarterAgents(userId)
  const rows = STARTER_AGENTS.map((a) => ({ ...a, user_id: userId }))
  const { data, error } = await supabase.from('agents').insert(rows).select()
  if (error) throw error
  return data
}

/* --- Activity --------------------------------------------------------- */
export async function listActivity(limit = 6) {
  if (!isSupabaseConfigured) return local.listActivity()
  const { data, error } = await supabase
    .from('activity')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

/* --- Documents (metadata) -------------------------------------------- */
export async function listDocuments() {
  if (!isSupabaseConfigured) return local.listDocuments()
  const { data, error } = await supabase
    .from('documents')
    .select('id, source, metadata, created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}
