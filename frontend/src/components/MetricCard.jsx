import { Card } from '@/components/ui'
import { cn } from '@/lib/utils'

const toneBg = {
  brand: 'bg-brand-50 text-brand-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  sky: 'bg-sky-50 text-sky-600',
  violet: 'bg-violet-50 text-violet-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600',
}

export default function MetricCard({ label, value, delta, icon: Icon, tone = 'brand' }) {
  const positive = delta != null && delta >= 0
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        {Icon && (
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', toneBg[tone])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {delta != null && (
        <p className="mt-3 text-xs font-medium">
          <span className={positive ? 'text-emerald-600' : 'text-rose-600'}>
            {positive ? '▲' : '▼'} {Math.abs(delta)}%
          </span>
          <span className="ml-1 text-slate-400">vs last week</span>
        </p>
      )}
    </Card>
  )
}
