/** Central error handler. Maps known error types to status codes. */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500
  if (status >= 500) console.error(err)
  res.status(status).json({
    error: err.name || 'Error',
    message: err.message || 'Something went wrong.',
  })
}

/** 404 fallback for unmatched routes. */
export function notFound(_req, res) {
  res.status(404).json({ error: 'NotFound', message: 'Route not found.' })
}
