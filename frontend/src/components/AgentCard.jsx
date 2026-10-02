import { Card, Badge, Button } from '@/components/ui'
import { AGENT_CATEGORIES } from '@/data/mockData'
import { Activity, ShieldCheck } from 'lucide-react'

export default function AgentCard({ agent }) {
  const category = AGENT_CATEGORIES[agent.category]
  const active = agent.status === 'active'

  return (
    <Card interactive className="flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge tone={category.tone}>{category.label.split(' ')[0]}</Badge>
          <h3 className="mt-2 text-base font-semibold text-content">
            {agent.name}
          </h3>
        </div>
        <Badge tone={active ? 'emerald' : 'slate'}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {active ? 'Active' : 'Paused'}
        </Badge>
      </div>

      <p className="mt-2 flex-1 text-sm text-muted">{agent.description}</p>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4">
        <div className="flex items-center gap-2 text-sm">
          <Activity className="h-4 w-4 text-subtle" />
          <span className="font-semibold tabular-nums text-content">
            {agent.runsToday}
          </span>
          <span className="text-subtle">runs</span>
        </div>
        <div className="text-right text-sm">
          <span className="font-semibold tabular-nums text-content">
            {Math.round(agent.successRate * 100)}%
          </span>
          <span className="ml-1 text-subtle">success</span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-subtle" />
        {agent.guardrails.map((g) => (
          <span
            key={g}
            className="rounded-md bg-canvas px-2 py-0.5 text-xs text-muted"
          >
            {g}
          </span>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="secondary" className="flex-1">
          Configure
        </Button>
        <Button className="flex-1">Deploy</Button>
      </div>
    </Card>
  )
}
