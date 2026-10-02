import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Boxes,
  Wand2,
  BookOpen,
  Plug,
  ShieldCheck,
  BarChart3,
  Settings,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const groups = [
  {
    label: 'Platform',
    items: [
      { to: '/app', label: 'Overview', icon: LayoutDashboard, end: true },
      { to: '/app/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Automations',
    items: [
      { to: '/app/agents', label: 'Agents Catalog', icon: Boxes },
      { to: '/app/builder', label: 'Custom Builder', icon: Wand2 },
    ],
  },
  {
    label: 'Data',
    items: [
      { to: '/app/knowledge-base', label: 'Knowledge Base', icon: BookOpen },
      { to: '/app/integrations', label: 'Integrations', icon: Plug },
    ],
  },
  {
    label: 'Security',
    items: [{ to: '/app/guardrails', label: 'Guardrails & RBAC', icon: ShieldCheck }],
  },
  {
    label: 'Workspace',
    items: [{ to: '/app/settings', label: 'Settings', icon: Settings }],
  },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-surface transition-transform duration-200 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-line px-5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 text-white shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold tracking-tight text-content">
                Agentix
              </p>
              <p className="text-[11px] text-muted">Insurance &amp; Trades</p>
            </div>
          </Link>
          <button
            className="rounded-md p-1 text-subtle hover:bg-canvas hover:text-content lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto p-3">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-subtle">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map(({ to, label, icon: Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-brand-500/10 text-brand-600 dark:text-brand-300'
                          : 'text-muted hover:bg-canvas hover:text-content',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={cn(
                            'absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-500 transition-opacity',
                            isActive ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                        <Icon className="h-[18px] w-[18px]" />
                        {label}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-line p-3">
          <div className="rounded-xl bg-canvas p-3 text-xs text-muted">
            <p className="font-medium text-content">Centralized SaaS</p>
            <p className="mt-0.5">Host, manage &amp; monitor agents at scale.</p>
          </div>
        </div>
      </aside>
    </>
  )
}
