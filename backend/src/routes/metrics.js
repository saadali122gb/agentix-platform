import { Router } from 'express'
import { mockMetrics } from '../data/mock.js'

const router = Router()

// GET /metrics — dashboard KPIs
router.get('/', (_req, res) => {
  res.json(mockMetrics())
})

export default router
