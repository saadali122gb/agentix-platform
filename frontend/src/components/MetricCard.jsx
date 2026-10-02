import { Card } from '@/components/ui'
import { cn } from '@/lib/utils'

const toneBg = {
  brand: 'bg-brand-500/10 text-brand-600 dark:text-brand-300',
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
}

export default function MetricCard({ label, value, delta, icon: Icon, tone = 'brand' }) {
  const positive = delta != null && delta >= 0
  return (
    <Card interactive className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-content">
            {value}
          </p>
        </div>
        {Icon && (
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl',
              toneBg[tone],
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {delta != null && (
        <p className="mt-3 text-xs font-medium">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5',
              positive
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
            )}
          >
            {positive ? '▲' : '▼'} {Math.abs(delta)}%
          </span>
          <span className="ml-1.5 text-subtle">vs last week</span>
        </p>
      )}
    </Card>
  )
}
