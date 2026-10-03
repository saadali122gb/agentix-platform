// Vercel serverless entry — wraps the Express app.
// All routes are rewritten here via vercel.json.
import { createApp } from '../src/app.js'

const app = createApp()

export default function handler(req, res) {
  return app(req, res)
}
