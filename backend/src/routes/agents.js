import { Router } from 'express'
import { listAgents, getAgent, runAgent } from '../agents/index.js'

const router = Router()

// GET /agents — public catalog (no internal instructions)
router.get('/', (_req, res) => {
  res.json({ agents: listAgents() })
})

// POST /agents — register a custom agent (stub)
router.post('/', (req, res) => {
  const { name, category } = req.body || {}
  if (!name || !category) {
    return res.status(400).json({ error: 'ValidationError', message: 'name and category are required.' })
  }
  // TODO: persist to the database. For now echo back a generated id.
  res.status(201).json({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    ...req.body,
    status: 'created',
  })
})

// POST /agents/run — run an inline (custom) agent definition through the
// guardrail pipeline. Used by user-created agents stored in the frontend DB.
router.post('/run', async (req, res, next) => {
  try {
    const { name, category, instructions, input, model } = req.body || {}
    if (!category || !input) {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'category and input are required.',
      })
    }
    const agent = {
      id: 'custom',
      name: name || 'Custom agent',
      category,
      instructions: instructions || '',
      model,
    }
    const result = await runAgent(agent, {
      role: req.user.role,
      userId: req.user.userId,
      input,
    })
    res.json(result)
  } catch (err) {
    next(err)
  }
})

// POST /agents/:id/run — execute a predefined agent through the guardrail pipeline
router.post('/:id/run', async (req, res, next) => {
  try {
    const agent = getAgent(req.params.id)
    if (!agent) {
      return res.status(404).json({ error: 'NotFound', message: 'Agent not found.' })
    }
    const { input } = req.body || {}
    if (!input) {
      return res.status(400).json({ error: 'ValidationError', message: 'input is required.' })
    }
    const result = await runAgent(agent, {
      role: req.user.role,
      userId: req.user.userId,
      input,
    })
    res.json(result)
  } catch (err) {
    next(err)
  }
})

export default router
