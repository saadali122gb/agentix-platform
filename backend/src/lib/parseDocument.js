import mammoth from 'mammoth'
import { extractText, getDocumentProxy } from 'unpdf'

const TEXT_EXT = new Set(['txt', 'md', 'markdown', 'csv', 'log'])

/**
 * Extract plain text from an uploaded document buffer.
 * Supports PDF, DOCX and plain-text formats (TXT/MD/CSV).
 *
 * @param {{ buffer: Buffer, filename?: string, mimetype?: string }} file
 * @returns {Promise<string>}
 */
export async function parseDocument({ buffer, filename = '', mimetype = '' }) {
  const ext = filename.split('.').pop()?.toLowerCase() || ''

  if (ext === 'pdf' || mimetype === 'application/pdf') {
    const pdf = await getDocumentProxy(new Uint8Array(buffer))
    const { text } = await extractText(pdf, { mergePages: true })
    return normalize(text)
  }

  const DOCX_MIME =
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  if (ext === 'docx' || mimetype === DOCX_MIME) {
    const { value } = await mammoth.extractRawText({ buffer })
    return normalize(value)
  }

  if (TEXT_EXT.has(ext) || mimetype.startsWith('text/')) {
    return normalize(buffer.toString('utf-8'))
  }

  const err = new Error(
    `Unsupported file type "${filename || mimetype}". Supported: PDF, DOCX, TXT, MD, CSV.`,
  )
  err.status = 415
  throw err
}

function normalize(text) {
  return String(text || '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
