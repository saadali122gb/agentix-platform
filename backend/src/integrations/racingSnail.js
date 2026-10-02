import { config, features } from '../config/env.js'

/**
 * Racing Snail CRM client (primary CRM).
 * Methods are stubs that return mock data until API credentials are set.
 * Every read accepts a `scope` from RBAC so queries stay authorization-bound.
 */
async function call(path, { method = 'GET', body, scope } = {}) {
  if (!features.crm) {
    return { mock: true, path, scope, data: [] }
  }
  const res = await fetch(`${config.racingSnail.apiUrl}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${config.racingSnail.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`Racing Snail ${method} ${path} failed: ${res.status}`)
  return res.json()
}

export const racingSnail = {
  listContacts: (scope) => call('/contacts', { scope }),
  getRenewals: (scope) => call('/policies/renewals', { scope }),
  updateRecord: (id, patch, scope) =>
    call(`/records/${id}`, { method: 'PATCH', body: patch, scope }),
}
