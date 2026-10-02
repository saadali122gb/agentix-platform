import { cn } from '@/lib/utils'

/* --- Card ------------------------------------------------------------- */
export function Card({ className, interactive = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-line bg-surface shadow-card',
        interactive &&
          'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover hover:border-brand-300/60',
        className,
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('px-5 pt-5', className)} {...props} />
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn('text-sm font-semibold text-content', className)}
      {...props}
    />
  )
}

export function CardContent({ className, ...props }) {
  return <div className={cn('p-5', className)} {...props} />
}

/* --- Button ----------------------------------------------------------- */
const buttonVariants = {
  primary:
    'bg-brand-600 text-white shadow-sm hover:bg-brand-500 focus-visible:ring-brand-500',
  secondary:
    'bg-surface text-content border border-line hover:bg-canvas focus-visible:ring-brand-500',
  ghost: 'text-muted hover:bg-canvas hover:text-content focus-visible:ring-brand-500',
  danger: 'bg-rose-600 text-white shadow-sm hover:bg-rose-500 focus-visible:ring-rose-500',
}

const buttonSizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
}

export function Button({ className, variant = 'primary', size = 'md', ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:opacity-50',
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
      {...props}
    />
  )
}

/* --- Badge ------------------------------------------------------------ */
const toneStyles = {
  emerald:
    'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400',
  sky: 'bg-sky-500/10 text-sky-600 ring-sky-500/20 dark:text-sky-400',
  violet:
    'bg-violet-500/10 text-violet-600 ring-violet-500/20 dark:text-violet-400',
  amber: 'bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400',
  rose: 'bg-rose-500/10 text-rose-600 ring-rose-500/20 dark:text-rose-400',
  slate: 'bg-subtle/10 text-muted ring-subtle/20',
  brand: 'bg-brand-500/10 text-brand-600 ring-brand-500/20 dark:text-brand-300',
}

export function Badge({ className, tone = 'slate', ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        toneStyles[tone],
        className,
      )}
      {...props}
    />
  )
}

/* --- Form fields ------------------------------------------------------ */
const fieldBase =
  'w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-content placeholder:text-subtle focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25'

export function Input({ className, ...props }) {
  return <input className={cn(fieldBase, className)} {...props} />
}

export function Textarea({ className, ...props }) {
  return <textarea className={cn(fieldBase, className)} {...props} />
}

export function Select({ className, children, ...props }) {
  return (
    <select className={cn(fieldBase, className)} {...props}>
      {children}
    </select>
  )
}

export function Label({ className, ...props }) {
  return (
    <label
      className={cn('mb-1.5 block text-sm font-medium text-content', className)}
      {...props}
    />
  )
}
