import { Router } from 'express'
import agents from './agents.js'
import metrics from './metrics.js'
import kb from './kb.js'
import { features } from '../config/env.js'

const router = Router()

// Health & capability report
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', features })
})

router.use('/agents', agents)
router.use('/metrics', metrics)
router.use('/kb', kb)

export default router
