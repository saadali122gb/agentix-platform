import { cn } from '@/lib/utils'

/** The Agentix glyph — a dual sparkle (modern AI mark). */
export function AgentGlyph({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M13.2 2c.38 4.5 2.3 6.42 6.8 6.8-4.5.38-6.42 2.3-6.8 6.8-.38-4.5-2.3-6.42-6.8-6.8 4.5-.38 6.42-2.3 6.8-6.8Z" />
      <path d="M6.6 13.6c.2 2.3 1.3 3.4 3.6 3.6-2.3.2-3.4 1.3-3.6 3.6-.2-2.3-1.3-3.4-3.6-3.6 2.3-.2 3.4-1.3 3.6-3.6Z" opacity="0.72" />
    </svg>
  )
}

/** Logo badge (gradient square + glyph). */
export function LogoBadge({ className }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 text-white shadow-sm ring-1 ring-white/10',
        className,
      )}
    >
      <AgentGlyph className="h-[58%] w-[58%]" />
    </div>
  )
}

/** Full logo: badge + wordmark. */
export function Logo({ className, subtitle = 'Insurance & Trades' }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <LogoBadge className="h-9 w-9" />
      <div className="leading-tight">
        <p className="text-sm font-bold tracking-tight text-content">Agentix</p>
        {subtitle && <p className="text-[11px] text-muted">{subtitle}</p>}
      </div>
    </div>
  )
}
