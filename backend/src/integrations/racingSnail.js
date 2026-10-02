import { config, features } from '../config/env.js'
import { fetchJson } from '../lib/http.js'

/**
 * Racing Snail CRM client (primary CRM).
 *
 * NOTE: Racing Snail's public API spec was not available when this was written,
 * so the paths and query params below are reasonable REST assumptions. Adjust
 * `PATHS` and `scopeParams` to match the real API, then set
 * RACING_SNAIL_API_URL / RACING_SNAIL_API_KEY to leave mock mode.
 *
 * Every read takes an RBAC `scope` (from guardrails/rbac.scopeFor) which is
 * translated into query constraints so an agent never reads data it shouldn't.
 */

/** Map an RBAC scope into CRM query params. */
function scopeParams(scope) {
  if (!scope) return {}
  switch (scope.scope) {
    case 'all':
      return {}
    case 'own-pipeline':
      return { owner_id: scope.userId }
    case 'assigned-projects':
      return { assignee_id: scope.userId }
    case 'own-records':
      return { customer_id: scope.userId }
    default:
      return {}
  }
}

async function call(path, { method = 'GET', body, scope, query } = {}) {
  if (!features.crm) {
    return { mock: true, path, method, scope: scope?.scope, data: [] }
  }

  const url = new URL(`${config.racingSnail.apiUrl}${path}`)
  const params = { ...scopeParams(scope), ...(query || {}) }
  for (const [key, value] of Object.entries(params)) {
    if (value != null) url.searchParams.set(key, String(value))
  }

  return fetchJson(url.toString(), {
    method,
    timeoutMs: 15000,
    headers: {
      Authorization: `Bearer ${config.racingSnail.apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
}

export const racingSnail = {
  listContacts: (scope, query) => call('/contacts', { scope, query }),
  getContact: (id, scope) => call(`/contacts/${encodeURIComponent(id)}`, { scope }),
  getRenewals: (scope, { withinDays = 30 } = {}) =>
    call('/policies/renewals', { scope, query: { within_days: withinDays } }),
  updateRecord: (id, patch, scope) =>
    call(`/records/${encodeURIComponent(id)}`, { method: 'PATCH', body: patch, scope }),
  createTask: (task, scope) => call('/tasks', { method: 'POST', body: task, scope }),
}
