import { Router } from 'express'
import { answerFromKnowledgeBase } from '../rag/pipeline.js'

const router = Router()

// POST /kb/query — RAG query against the knowledge base
router.post('/query', async (req, res, next) => {
  try {
    const { query } = req.body || {}
    if (!query) {
      return res.status(400).json({ error: 'ValidationError', message: 'query is required.' })
    }
    const result = await answerFromKnowledgeBase(query)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

export default router
