import { useState } from 'react'
import PageHeader from '@/components/PageHeader'
import AgentCard from '@/components/AgentCard'
import { Button } from '@/components/ui'
import { agents, AGENT_CATEGORIES } from '@/data/mockData'
import { cn } from '@/lib/utils'

const filters = [
  { key: 'all', label: 'All' },
  ...Object.entries(AGENT_CATEGORIES).map(([key, v]) => ({
    key,
    label: v.label.split(' ')[0],
  })),
]

export default function AgentsCatalog() {
  const [active, setActive] = useState('all')
  const visible =
    active === 'all' ? agents : agents.filter((a) => a.category === active)

  return (
    <>
      <PageHeader
        title="Agents Catalog"
        subtitle="Standardized, pre-built agent solutions ready to deploy."
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActive(f.key)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
              active === f.key
                ? 'bg-brand-600 text-white'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="text-sm font-medium text-slate-700">
          Need something tailored?
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Build an agent around your own workflow with the Custom Builder.
        </p>
        <Button className="mt-4" onClick={() => (window.location.hash = '#/builder')}>
          Open Custom Builder
        </Button>
      </div>
    </>
  )
}
