/**
 * Role-Based Access Control.
 *
 * Roles map to the set of agent categories and data scopes they may touch.
 * In production, `scope` is used to filter every database/CRM query so an
 * agent can never read data outside the caller's authorization.
 */
export const ROLES = {
  admin: {
    label: 'Agency Admin',
    categories: ['offensive', 'defensive', 'assistant', 'customer'],
    scope: 'all',
  },
  sales: {
    label: 'Sales Team',
    categories: ['offensive', 'assistant'],
    scope: 'own-pipeline',
  },
  pm: {
    label: 'Project Manager',
    categories: ['defensive', 'assistant'],
    scope: 'assigned-projects',
  },
  customer: {
    label: 'Customer',
    categories: ['customer'],
    scope: 'own-records',
  },
}

export class AccessError extends Error {
  constructor(message) {
    super(message)
    this.name = 'AccessError'
    this.status = 403
  }
}

/** Throw if the role may not use the given agent category. */
export function assertCanUseCategory(role, category) {
  const def = ROLES[role]
  if (!def) throw new AccessError(`Unknown role: ${role}`)
  if (!def.categories.includes(category)) {
    throw new AccessError(
      `Role "${def.label}" is not permitted to use ${category} agents.`,
    )
  }
  return true
}

/**
 * Build a scope filter object to attach to downstream data queries.
 * Downstream integrations translate this into CRM/DB query constraints.
 */
export function scopeFor(role, userId) {
  const def = ROLES[role] || ROLES.customer
  return { scope: def.scope, userId }
}
