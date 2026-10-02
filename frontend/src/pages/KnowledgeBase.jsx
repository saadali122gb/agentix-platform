import { useRef, useState } from 'react'
import { UploadCloud, FileText, Search, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Input,
} from '@/components/ui'
import { knowledgeDocs } from '@/data/mockData'
import { api, isBackendConfigured } from '@/services/api'

const statusTone = { indexed: 'emerald', processing: 'amber', failed: 'rose' }
const ACCEPT = '.pdf,.docx,.txt,.md,.csv'

export default function KnowledgeBase() {
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [results, setResults] = useState([])
  const [docs, setDocs] = useState(knowledgeDocs)
  const [dragOver, setDragOver] = useState(false)

  const [query, setQuery] = useState('')
  const [querying, setQuerying] = useState(false)
  const [answer, setAnswer] = useState(null)

  async function handleFiles(fileList) {
    const files = Array.from(fileList || [])
    if (files.length === 0) return
    setUploadError('')
    setResults([])

    if (!isBackendConfigured) {
      setUploadError(
        'Demo mode: set VITE_API_BASE_URL and run the backend to ingest files.',
      )
      return
    }

    setUploading(true)
    try {
      const { files: fileResults } = await api.uploadDocuments(files)
      setResults(fileResults)
      // Prepend successfully ingested files to the indexed-docs list.
      const added = fileResults
        .filter((r) => r.ok)
        .map((r) => ({
          id: `up-${r.file}-${Date.now()}`,
          name: r.file,
          type: 'Uploaded',
          chunks: r.chunks ?? 0,
          status: 'indexed',
          updated: new Date().toISOString().slice(0, 10),
        }))
      if (added.length) setDocs((prev) => [...added, ...prev])
    } catch (err) {
      setUploadError(err.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleQuery() {
    if (!query.trim()) return
    if (!isBackendConfigured) {
      setAnswer({ answer: 'Demo mode: connect the backend to query the knowledge base.', sources: [] })
      return
    }
    setQuerying(true)
    setAnswer(null)
    try {
      const res = await api.queryKnowledgeBase(query.trim())
      setAnswer(res)
    } catch (err) {
      setAnswer({ answer: `Error: ${err.message}`, sources: [] })
    } finally {
      setQuerying(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Knowledge Base"
        subtitle="Ingest SOPs, FAQs, policy documents and training material for RAG."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="p-5">
              <div
                role="button"
                tabIndex={0}
                onClick={() => !uploading && fileInputRef.current?.click()}
                onKeyDown={(e) =>
                  (e.key === 'Enter' || e.key === ' ') &&
                  !uploading &&
                  fileInputRef.current?.click()
                }
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragOver(false)
                  handleFiles(e.dataTransfer.files)
                }}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                  dragOver
                    ? 'border-brand-500 bg-brand-500/10'
                    : 'border-line bg-canvas hover:border-brand-400 hover:bg-brand-500/5'
                }`}
              >
                {uploading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
                ) : (
                  <UploadCloud className="h-8 w-8 text-subtle" />
                )}
                <p className="mt-3 text-sm font-medium text-content">
                  {uploading ? 'Uploading & indexing…' : 'Drop files or click to upload'}
                </p>
                <p className="mt-1 text-xs text-subtle">
                  PDF, DOCX, MD, TXT, CSV — chunked &amp; embedded into the vector store
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  accept={ACCEPT}
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>

              {uploadError && (
                <p className="mt-3 rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-600 dark:text-amber-400">
                  {uploadError}
                </p>
              )}

              {results.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {results.map((r) => (
                    <li
                      key={r.file}
                      className="flex items-center gap-2 text-sm text-muted"
                    >
                      {r.ok ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                      ) : (
                        <XCircle className="h-4 w-4 shrink-0 text-rose-500" />
                      )}
                      <span className="font-medium text-content">{r.file}</span>
                      <span className="text-subtle">
                        {r.ok ? `· ${r.chunks} chunks (${r.chars} chars)` : `· ${r.error}`}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Indexed documents ({docs.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-line">
                {docs.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-canvas text-muted">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-content">
                        {doc.name}
                      </p>
                      <p className="text-xs text-subtle">
                        {doc.type} · {doc.chunks} chunks · updated {doc.updated}
                      </p>
                    </div>
                    <Badge tone={statusTone[doc.status]}>{doc.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Query the knowledge base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
                <Input
                  className="pl-9"
                  placeholder="e.g. What is the claims SLA?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                />
              </div>
              <Button
                className="w-full"
                disabled={!query.trim() || querying}
                onClick={handleQuery}
              >
                {querying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Searching…
                  </>
                ) : (
                  'Search'
                )}
              </Button>

              {answer && (
                <div className="rounded-lg bg-canvas p-3">
                  <p className="text-sm text-content">{answer.answer}</p>
                  {answer.sources?.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {answer.sources.map((s, i) => (
                        <p key={s.id || i} className="text-xs text-subtle">
                          [{i + 1}] {s.content}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <p className="text-xs text-subtle">
                Retrieval runs against the Supabase pgvector store via the backend
                RAG pipeline.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
