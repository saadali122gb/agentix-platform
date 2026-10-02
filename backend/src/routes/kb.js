import { Router } from 'express'
import multer from 'multer'
import { answerFromKnowledgeBase } from '../rag/pipeline.js'
import { ingestDocument } from '../rag/ingest.js'
import { parseDocument } from '../lib/parseDocument.js'

const router = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024, files: 10 }, // 20 MB/file, 10 files
})

// POST /kb/upload — upload PDF/DOCX/TXT files; parse -> chunk -> embed -> store
router.post('/upload', upload.array('files', 10), async (req, res, next) => {
  try {
    const files = req.files || []
    if (files.length === 0) {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'No files uploaded (use multipart field name "files").',
      })
    }

    const results = []
    for (const f of files) {
      try {
        const text = await parseDocument({
          buffer: f.buffer,
          filename: f.originalname,
          mimetype: f.mimetype,
        })
        if (!text) {
          results.push({ file: f.originalname, ok: false, error: 'No extractable text found.' })
          continue
        }
        const ingest = await ingestDocument({
          text,
          source: f.originalname,
          metadata: { mimetype: f.mimetype, bytes: f.size },
        })
        results.push({ file: f.originalname, ok: true, chars: text.length, ...ingest })
      } catch (err) {
        results.push({ file: f.originalname, ok: false, error: err.message })
      }
    }

    res.status(201).json({ files: results })
  } catch (err) {
    next(err)
  }
})

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
