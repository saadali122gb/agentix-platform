/**
 * Split text into overlapping chunks suitable for embedding.
 * Packs whole paragraphs up to ~chunkSize characters, with a small overlap
 * between consecutive chunks to preserve context across boundaries.
 */
export function chunkText(text, { chunkSize = 1000, overlap = 150 } = {}) {
  const clean = String(text || '').replace(/\r\n/g, '\n').trim()
  if (!clean) return []

  const paragraphs = clean.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
  const chunks = []
  let buffer = ''

  for (const para of paragraphs) {
    const candidate = buffer ? `${buffer}\n\n${para}` : para
    if (candidate.length > chunkSize && buffer) {
      chunks.push(buffer)
      const tail = buffer.slice(-overlap)
      buffer = `${tail}\n\n${para}`
    } else {
      buffer = candidate
    }
  }
  if (buffer.trim()) chunks.push(buffer.trim())

  // Hard-split any chunk that is still far too large (e.g. one huge paragraph).
  const max = Math.round(chunkSize * 1.5)
  return chunks.flatMap((c) => (c.length > max ? hardSplit(c, chunkSize, overlap) : [c]))
}

function hardSplit(text, size, overlap) {
  const out = []
  let i = 0
  while (i < text.length) {
    out.push(text.slice(i, i + size))
    i += size - overlap
  }
  return out
}
