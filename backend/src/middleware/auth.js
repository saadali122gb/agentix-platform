import { ROLES } from '../guardrails/rbac.js'

/**
 * Lightweight auth stub.
 * Reads `x-user-id` and `x-user-role` headers and attaches `req.user`.
 * TODO: replace with real JWT / session verification.
 * Defaults to the `admin` role so the demo is usable without auth wiring.
 */
export function auth(req, _res, next) {
  const role = req.header('x-user-role') || 'admin'
  const userId = req.header('x-user-id') || 'demo-user'
  req.user = { userId, role: ROLES[role] ? role : 'customer' }
  next()
}
