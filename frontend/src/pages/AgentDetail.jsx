import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Loader2,
  ArrowLeft,
  MessageSquare,
  Play,
  Pause,
  Trash2,
  Download,
  Activity,
  ShieldCheck,
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
} from '@/components/ui'
import AgentRunModal from '@/components/AgentRunModal'
import { AGENT_CATEGORIES } from '@/data/mockData'
import { listAgents, updateAgent, deleteAgent } from '@/services/db'
import { downloadJSON, slugify } from '@/lib/download'

export default function AgentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [agent, setAgent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    listAgents()
      .then((list) => setAgent(list.find((a) => String(a.id) === String(id)) || null))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-muted">Agent not found.</p>
        <Link to="/app/agents">
          <Button className="mt-4">Back to catalog</Button>
        </Link>
      </div>
    )
  }

  const cat = AGENT_CATEGORIES[agent.category] || AGENT_CATEGORIES.defensive
  const active = agent.status === 'active'

  async function toggle() {
    const next = active ? 'paused' : 'active'
    setAgent((a) => ({ ...a, status: next }))
    try {
      await updateAgent(agent.id, { status: next })
    } catch {
      /* ignore */
    }
  }

  async function remove() {
    if (!window.confirm(`Delete "${agent.name}"?`)) return
    await deleteAgent(agent.id)
    navigate('/app/agents')
  }

  function download() {
    const { id: _i, user_id, created_at, runs_today, success_rate, ...config } = agent
    downloadJSON(`${slugify(agent.name)}.agent.json`, config)
  }

  return (
    <>
      <Link to="/app/agents" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-content">
        <ArrowLeft className="h-4 w-4" /> Agents Catalog
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge tone={cat.tone}>{cat.label.split(' ')[0]}</Badge>
            <Badge tone={active ? 'emerald' : 'slate'}>
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {active ? 'Active' : 'Paused'}
            </Badge>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-content">{agent.name}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">{agent.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setRunning(true)}>
            <MessageSquare className="h-4 w-4" /> Run
          </Button>
          <Button variant="secondary" onClick={toggle}>
            {active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {active ? 'Pause' : 'Resume'}
          </Button>
          <Button variant="secondary" onClick={download}>
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button variant="ghost" className="text-muted hover:text-rose-600" onClick={remove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>System prompt &amp; guardrails</CardTitle></CardHeader>
            <CardContent>
              <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
{agent.instructions || '(no custom instructions)'}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Tools</CardTitle></CardHeader>
            <CardContent>
              {agent.tools?.length ? (
                <div className="flex flex-wrap gap-2">
                  {agent.tools.map((t) => (
                    <span key={t} className="rounded-lg bg-canvas px-3 py-1.5 text-sm text-muted">{t}</span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">No tools configured.</p>
              )}
            </CardContent>
          </Card>

          {agent.guardrails?.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-subtle" /> Guardrails</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {agent.guardrails.map((g) => (
                    <li key={g} className="flex items-center gap-2 text-sm text-muted">
                      <ShieldCheck className="h-4 w-4 text-brand-600" /> {g}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="Model"><span className="font-mono text-xs">{agent.model}</span></Row>
              <Row label="Category">{cat.label}</Row>
              <Row label="Status">{active ? 'Active' : 'Paused'}</Row>
              <Row label="Runs today">
                <span className="inline-flex items-center gap-1 font-semibold tabular-nums text-content">
                  <Activity className="h-3.5 w-3.5 text-subtle" />{agent.runs_today ?? 0}
                </span>
              </Row>
              <Row label="Success rate">
                <span className="font-semibold tabular-nums text-content">
                  {Math.round((agent.success_rate ?? 0) * 100)}%
                </span>
              </Row>
            </CardContent>
          </Card>
        </div>
      </div>

      <AgentRunModal agent={running ? agent : null} onClose={() => setRunning(false)} />
    </>
  )
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between border-b border-line pb-2 last:border-0 last:pb-0">
      <span className="text-muted">{label}</span>
      <span className="text-content">{children}</span>
    </div>
  )
}
