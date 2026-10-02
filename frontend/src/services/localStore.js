// Local, in-browser data store used when Supabase is not configured (dev mode).
// Persists to localStorage so agents survive reloads on this browser.
import { STARTER_AGENTS } from '@/data/starterAgents'

const KEY = 'agentix:agents'

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

function write(rows) {
  try {
    localStorage.setItem(KEY, JSON.stringify(rows))
  } catch {
    /* ignore quota/private-mode errors */
  }
  return rows
}

const uid = () =>
  (crypto?.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(16).slice(2)}`)

export async function listAgents() {
  return read().sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
}

export async function createAgent(_userId, payload) {
  const row = { id: uid(), created_at: new Date().toISOString(), ...payload }
  write([row, ...read()])
  return row
}

export async function updateAgent(id, patch) {
  const rows = read().map((a) => (a.id === id ? { ...a, ...patch } : a))
  write(rows)
  return rows.find((a) => a.id === id)
}

export async function deleteAgent(id) {
  write(read().filter((a) => a.id !== id))
}

export async function seedStarterAgents() {
  const rows = STARTER_AGENTS.map((a) => ({
    id: uid(),
    created_at: new Date().toISOString(),
    ...a,
  }))
  write([...rows, ...read()])
  return rows
}

export async function listActivity() {
  return []
}

export async function listDocuments() {
  return []
}
