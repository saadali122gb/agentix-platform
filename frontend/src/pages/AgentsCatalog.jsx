import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Plus, Sparkles, Boxes } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import AgentCard from '@/components/AgentCard'
import AgentRunModal from '@/components/AgentRunModal'
import { Button } from '@/components/ui'
import { AGENT_CATEGORIES } from '@/data/mockData'
import { useAuth } from '@/auth/AuthProvider'
import {
  listAgents,
  deleteAgent,
  updateAgent,
  seedStarterAgents,
} from '@/services/db'
import { cn } from '@/lib/utils'

const filters = [
  { key: 'all', label: 'All' },
  ...Object.entries(AGENT_CATEGORIES).map(([key, v]) => ({
    key,
    label: v.label.split(' ')[0],
  })),
]

export default function AgentsCatalog() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [active, setActive] = useState('all')
  const [seeding, setSeeding] = useState(false)
  const [runAgentTarget, setRunAgentTarget] = useState(null)

  async function load() {
    setLoading(true)
    setError('')
    try {
      setAgents(await listAgents())
    } catch (err) {
      setError(err.message || 'Could not load agents.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleToggle(agent) {
    const next = agent.status === 'active' ? 'paused' : 'active'
    setAgents((list) => list.map((a) => (a.id === agent.id ? { ...a, status: next } : a)))
    try {
      await updateAgent(agent.id, { status: next })
    } catch {
      load() // revert to server truth on failure
    }
  }

  async function handleDelete(agent) {
    if (!window.confirm(`Delete "${agent.name}"? This cannot be undone.`)) return
    const prev = agents
    setAgents((list) => list.filter((a) => a.id !== agent.id))
    try {
      await deleteAgent(agent.id)
    } catch {
      setAgents(prev)
    }
  }

  async function handleSeed() {
    setSeeding(true)
    try {
      await seedStarterAgents(user.id)
      await load()
    } catch (err) {
      setError(err.message || 'Could not install starter agents.')
    } finally {
      setSeeding(false)
    }
  }

  const visible = active === 'all' ? agents : agents.filter((a) => a.category === active)

  return (
    <>
      <PageHeader
        title="Agents Catalog"
        subtitle="Your deployed agents — create, configure, pause or run them."
        actions={
          <Button onClick={() => navigate('/builder')}>
            <Plus className="h-4 w-4" /> New agent
          </Button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-600 dark:text-rose-400">
          {error}
        </div>
      ) : agents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
            <Boxes className="h-6 w-6" />
          </div>
          <p className="mt-4 text-base font-semibold text-content">No agents yet</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted">
            Install the standardized starter agents to get going instantly, or build
            your own from scratch.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <Button onClick={handleSeed} disabled={seeding}>
              {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Install starter agents
            </Button>
            <Button variant="secondary" onClick={() => navigate('/builder')}>
              <Plus className="h-4 w-4" /> Build custom
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-5 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActive(f.key)}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                  active === f.key
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-surface text-muted ring-1 ring-line hover:bg-canvas hover:text-content',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onRun={setRunAgentTarget}
              />
            ))}
          </div>
        </>
      )}

      <AgentRunModal agent={runAgentTarget} onClose={() => setRunAgentTarget(null)} />
    </>
  )
}
