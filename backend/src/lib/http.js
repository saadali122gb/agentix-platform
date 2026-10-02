/**
 * Small fetch wrapper: JSON in/out, timeout, and rich errors.
 * Uses the global fetch + AbortSignal.timeout available in Node 18+.
 */
export async function fetchJson(url, { timeoutMs = 20000, ...options } = {}) {
  let res
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs), ...options })
  } catch (err) {
    const wrapped = new Error(
      err.name === 'TimeoutError'
        ? `Request timed out after ${timeoutMs}ms: ${url}`
        : `Network error calling ${url}: ${err.message}`,
    )
    wrapped.status = 502
    wrapped.cause = err
    throw wrapped
  }

  const raw = await res.text()
  let data = null
  try {
    data = raw ? JSON.parse(raw) : null
  } catch {
    data = raw
  }

  if (!res.ok) {
    const detail = typeof data === 'string' ? data : JSON.stringify(data)
    const err = new Error(`HTTP ${res.status} from ${url}: ${detail}`)
    err.status = res.status
    err.body = data
    throw err
  }
  return data
}
