import { Card, Badge, Button } from '@/components/ui'
import { AGENT_CATEGORIES } from '@/data/mockData'
import { Activity, ShieldCheck, Play, Pause, Trash2, MessageSquare } from 'lucide-react'

export default function AgentCard({ agent, onToggle, onDelete, onRun }) {
  const category = AGENT_CATEGORIES[agent.category] || AGENT_CATEGORIES.defensive
  const active = agent.status === 'active'
  const runs = agent.runs_today ?? agent.runsToday ?? 0
  const success = agent.success_rate ?? agent.successRate ?? 0
  const guardrails = agent.guardrails || []

  return (
    <Card interactive className="flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge tone={category.tone}>{category.label.split(' ')[0]}</Badge>
          <h3 className="mt-2 text-base font-semibold text-content">{agent.name}</h3>
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
          <span className="font-semibold tabular-nums text-content">{runs}</span>
          <span className="text-subtle">runs</span>
        </div>
        <div className="text-right text-sm">
          <span className="font-semibold tabular-nums text-content">
            {Math.round(success * 100)}%
          </span>
          <span className="ml-1 text-subtle">success</span>
        </div>
      </div>

      {guardrails.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-subtle" />
          {guardrails.map((g) => (
            <span key={g} className="rounded-md bg-canvas px-2 py-0.5 text-xs text-muted">
              {g}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <Button className="flex-1" onClick={() => onRun?.(agent)}>
          <MessageSquare className="h-4 w-4" /> Run
        </Button>
        <Button
          variant="secondary"
          onClick={() => onToggle?.(agent)}
          title={active ? 'Pause' : 'Resume'}
          aria-label={active ? 'Pause agent' : 'Resume agent'}
        >
          {active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          onClick={() => onDelete?.(agent)}
          title="Delete"
          aria-label="Delete agent"
          className="text-muted hover:text-rose-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
