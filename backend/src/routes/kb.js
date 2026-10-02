import { Router } from 'express'
import { answerFromKnowledgeBase } from '../rag/pipeline.js'
import { ingestDocument } from '../rag/ingest.js'

const router = Router()

// POST /kb/ingest — chunk, embed and store a document in the knowledge base
router.post('/ingest', async (req, res, next) => {
  try {
    const { text, source, metadata } = req.body || {}
    if (!text || typeof text !== 'string') {
      return res
        .status(400)
        .json({ error: 'ValidationError', message: 'text (string) is required.' })
    }
    const result = await ingestDocument({ text, source, metadata })
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
})

// POST /kb/query — RAG query against the knowledge base
router.post('/query', async (req, res, next) => {
  try {
    const { query, matchCount } = req.body || {}
    if (!query) {
      return res
        .status(400)
        .json({ error: 'ValidationError', message: 'query is required.' })
    }
    const result = await answerFromKnowledgeBase(query, { matchCount })
    res.json(result)
  } catch (err) {
    next(err)
  }
})

export default router
