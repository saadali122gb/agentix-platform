import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { Bot, Zap, ShieldAlert, RefreshCw, Plus, Loader2 } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import MetricCard from '@/components/MetricCard'
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui'
import { activityTrend, AGENT_CATEGORIES } from '@/data/mockData'
import { listAgents, listActivity } from '@/services/db'
import { useTheme } from '@/theme/ThemeProvider'
import { cn } from '@/lib/utils'

const dotTone = {
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  violet: 'bg-violet-500',
  sky: 'bg-sky-500',
  rose: 'bg-rose-500',
}
const barTone = {
  emerald: 'bg-emerald-500',
  sky: 'bg-sky-500',
  violet: 'bg-violet-500',
  amber: 'bg-amber-500',
}

function computeMetrics(agents) {
  const active = agents.filter((a) => a.status === 'active')
  const runsToday = agents.reduce((s, a) => s + (a.runs_today || 0), 0)
  const avg =
    agents.length > 0
      ? agents.reduce((s, a) => s + (a.success_rate || 0), 0) / agents.length
      : 0
  return {
    activeAgents: active.length,
    totalAgents: agents.length,
    runsToday,
    avgSuccessRate: avg,
  }
}

function categoryBreakdown(agents) {
  const totalRuns = agents.reduce((s, a) => s + (a.runs_today || 0), 0) || 1
  return Object.entries(AGENT_CATEGORIES).map(([key, v]) => {
    const list = agents.filter((a) => a.category === key)
    const runs = list.reduce((s, a) => s + (a.runs_today || 0), 0)
    return {
      key,
      label: v.label.split(' ')[0],
      tone: v.tone,
      count: list.length,
      runs,
      pct: Math.round((runs / totalRuns) * 100),
    }
  })
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.round(hrs / 24)}d ago`
}

export default function Dashboard() {
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const [agents, setAgents] = useState([])
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([listAgents(), listActivity(6)])
      .then(([a, act]) => {
        setAgents(a)
        setActivity(act)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const grid = isDark ? '#1e293b' : '#e2e8f0'
  const tick = isDark ? '#94a3b8' : '#64748b'
  const metrics = computeMetrics(agents)
  const breakdown = categoryBreakdown(agents)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Overview"
        subtitle="Live view of deployed agents, performance and compliance."
        actions={
          <Button onClick={() => navigate('/app/builder')}>
            <Plus className="h-4 w-4" /> New agent
          </Button>
        }
      />

      {agents.length === 0 && (
        <Card className="mb-6 p-6 text-center">
          <p className="text-sm font-medium text-content">No agents deployed yet</p>
          <p className="mt-1 text-sm text-muted">
            Head to the catalog to install starter agents or build your own.
          </p>
          <Button className="mt-4" onClick={() => navigate('/app/agents')}>
            Go to Agents Catalog
          </Button>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Active agents" value={`${metrics.activeAgents} / ${metrics.totalAgents}`} icon={Bot} tone="brand" />
        <MetricCard label="Runs today" value={metrics.runsToday.toLocaleString()} icon={Zap} tone="emerald" />
        <MetricCard label="Avg success rate" value={`${Math.round(metrics.avgSuccessRate * 100)}%`} icon={RefreshCw} tone="sky" />
        <MetricCard label="Guardrail blocks" value={0} icon={ShieldAlert} tone="rose" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Agent activity — last 7 days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityTrend} margin={{ left: -20, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="runs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: tick }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: tick }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ stroke: grid }}
                    contentStyle={{
                      borderRadius: 12,
                      border: `1px solid ${grid}`,
                      background: isDark ? '#0f172a' : '#ffffff',
                      color: isDark ? '#e2e8f0' : '#0f172a',
                      fontSize: 13,
                    }}
                  />
                  <Area type="monotone" dataKey="runs" stroke="#10b981" strokeWidth={2.5} fill="url(#runs)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {activity.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted">No activity yet.</p>
            ) : (
              <ul className="space-y-4">
                {activity.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', dotTone[item.tone] || 'bg-sky-500')} />
                    <div className="min-w-0">
                      <p className="text-sm text-content">{item.event}</p>
                      <p className="mt-0.5 text-xs text-subtle">
                        {item.agent_name ? `${item.agent_name} · ` : ''}
                        {timeAgo(item.created_at)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {agents.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Agents by category</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {breakdown.map((c) => (
              <div key={c.key}>
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-medium text-content">{c.label}</p>
                  <p className="text-xs text-subtle">{c.count} agents</p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-canvas">
                  <div className={cn('h-full rounded-full', barTone[c.tone])} style={{ width: `${Math.max(c.pct, 3)}%` }} />
                </div>
                <p className="mt-1.5 text-xs text-muted">
                  <span className="font-semibold tabular-nums text-content">
                    {c.runs.toLocaleString()}
                  </span>{' '}
                  runs · {c.pct}%
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  )
}
