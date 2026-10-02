import { useState } from 'react'
import { UploadCloud, FileText, Search } from 'lucide-react'
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

const statusTone = { indexed: 'emerald', processing: 'amber', failed: 'rose' }

export default function KnowledgeBase() {
  const [query, setQuery] = useState('')

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
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition-colors hover:border-brand-400 hover:bg-brand-50/40">
                <UploadCloud className="h-8 w-8 text-slate-400" />
                <p className="mt-3 text-sm font-medium text-slate-700">
                  Drop files or click to upload
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  PDF, DOCX, MD, TXT — chunked &amp; embedded into the vector store
                </p>
                <input type="file" className="hidden" multiple />
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Indexed documents ({knowledgeDocs.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {knowledgeDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 px-5 py-3.5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {doc.name}
                      </p>
                      <p className="text-xs text-slate-400">
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
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  className="pl-9"
                  placeholder="e.g. What is the claims SLA?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button className="w-full" disabled={!query.trim()}>
                Search
              </Button>
              <p className="text-xs text-slate-400">
                Retrieval runs against the Supabase pgvector store via the backend
                RAG pipeline. Connect the backend to enable live answers.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
