import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { Bot, Zap, ShieldAlert, RefreshCw, Plus } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import MetricCard from '@/components/MetricCard'
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui'
import { metrics, activityTrend, recentActivity } from '@/data/mockData'
import { cn } from '@/lib/utils'

const dotTone = {
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  violet: 'bg-violet-500',
  sky: 'bg-sky-500',
  rose: 'bg-rose-500',
}

export default function Dashboard() {
  return (
    <>
      <PageHeader
        title="Overview"
        subtitle="Live view of deployed agents, performance and compliance."
        actions={<Button><Plus className="h-4 w-4" /> New agent</Button>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Active agents"
          value={`${metrics.activeAgents} / ${metrics.totalAgents}`}
          delta={12}
          icon={Bot}
          tone="brand"
        />
        <MetricCard
          label="Runs today"
          value={metrics.runsToday.toLocaleString()}
          delta={8}
          icon={Zap}
          tone="emerald"
        />
        <MetricCard
          label="Avg success rate"
          value={`${Math.round(metrics.avgSuccessRate * 100)}%`}
          delta={2}
          icon={RefreshCw}
          tone="sky"
        />
        <MetricCard
          label="Guardrail blocks"
          value={metrics.guardrailBlocks}
          delta={-5}
          icon={ShieldAlert}
          tone="rose"
        />
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
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid #e2e8f0',
                      fontSize: 13,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="runs"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    fill="url(#runs)"
                  />
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
            <ul className="space-y-4">
              {recentActivity.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <span
                    className={cn(
                      'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                      dotTone[item.tone],
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-700">{item.event}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {item.agent} · {item.time}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
