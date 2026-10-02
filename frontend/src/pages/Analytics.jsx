import { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts'
import { Loader2, Zap, Bot, RefreshCw, ShieldAlert } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import MetricCard from '@/components/MetricCard'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { activityTrend, AGENT_CATEGORIES } from '@/data/mockData'
import { listAgents } from '@/services/db'
import { useTheme } from '@/theme/ThemeProvider'

const CAT_COLORS = { offensive: '#52525b', defensive: '#0ea5e9', assistant: '#8b5cf6', customer: '#f59e0b' }

export default function Analytics() {
  const { isDark } = useTheme()
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listAgents().then(setAgents).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const grid = isDark ? '#1e293b' : '#e2e8f0'
  const tick = isDark ? '#94a3b8' : '#64748b'
  const tooltipStyle = {
    borderRadius: 12,
    border: `1px solid ${grid}`,
    background: isDark ? '#0f172a' : '#ffffff',
    color: isDark ? '#e2e8f0' : '#0f172a',
    fontSize: 13,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
      </div>
    )
  }

  const totalRuns = agents.reduce((s, a) => s + (a.runs_today || 0), 0)
  const avg = agents.length ? agents.reduce((s, a) => s + (a.success_rate || 0), 0) / agents.length : 0
  const runsByAgent = agents
    .map((a) => ({ name: a.name.split(' ').slice(0, 2).join(' '), runs: a.runs_today || 0 }))
    .sort((a, b) => b.runs - a.runs)
  const byCategory = Object.entries(AGENT_CATEGORIES).map(([key, v]) => ({
    key,
    name: v.label.split(' ')[0],
    value: agents.filter((a) => a.category === key).reduce((s, a) => s + (a.runs_today || 0), 0),
  })).filter((d) => d.value > 0)

  return (
    <>
      <PageHeader title="Analytics" subtitle="Performance across your deployed agents." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total runs today" value={totalRuns.toLocaleString()} icon={Zap} tone="emerald" />
        <MetricCard label="Agents" value={agents.length} icon={Bot} tone="brand" />
        <MetricCard label="Avg success rate" value={`${Math.round(avg * 100)}%`} icon={RefreshCw} tone="sky" />
        <MetricCard label="Guardrail blocks" value={0} icon={ShieldAlert} tone="rose" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Runs by agent</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              {runsByAgent.length === 0 ? (
                <p className="py-20 text-center text-sm text-muted">No agents yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={runsByAgent} layout="vertical" margin={{ left: 20, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={grid} horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12, fill: tick }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12, fill: tick }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'rgba(16,185,129,0.08)' }} contentStyle={tooltipStyle} />
                    <Bar dataKey="runs" fill="#52525b" radius={[0, 6, 6, 0]} barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Runs by category</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              {byCategory.length === 0 ? (
                <p className="py-20 text-center text-sm text-muted">No data.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                      {byCategory.map((d) => (
                        <Cell key={d.key} fill={CAT_COLORS[d.key]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {byCategory.map((d) => (
                <span key={d.key} className="flex items-center gap-1.5 text-xs text-muted">
                  <span className="h-2 w-2 rounded-full" style={{ background: CAT_COLORS[d.key] }} />
                  {d.name}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Activity — last 7 days</CardTitle></CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityTrend} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="a" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#52525b" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#52525b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: tick }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: tick }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="runs" stroke="#52525b" strokeWidth={2.5} fill="url(#a)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
