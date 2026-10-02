// Thin client for the cloud backend (Render/Vercel/Cloudflare Workers).
// Configure the endpoint via frontend/.env -> VITE_API_BASE_URL.
// Until the backend is wired up, callers fall back to mock data so the
// UI is fully browsable on GitHub Pages with no backend running.

const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || ''

export const isBackendConfigured = Boolean(BASE_URL)

async function request(path, options = {}) {
  if (!BASE_URL) {
    throw new Error('VITE_API_BASE_URL is not set — running in mock mode.')
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}): ${path}`)
  }
  return res.json()
}

export const api = {
  getAgents: () => request('/agents'),
  getMetrics: () => request('/metrics'),
  createAgent: (payload) =>
    request('/agents', { method: 'POST', body: JSON.stringify(payload) }),
  queryKnowledgeBase: (query) =>
    request('/kb/query', { method: 'POST', body: JSON.stringify({ query }) }),
}
