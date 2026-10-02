import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Boxes,
  Wand2,
  BookOpen,
  Plug,
  ShieldCheck,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/agents', label: 'Agents Catalog', icon: Boxes },
  { to: '/builder', label: 'Custom Builder', icon: Wand2 },
  { to: '/knowledge-base', label: 'Knowledge Base', icon: BookOpen },
  { to: '/integrations', label: 'Integrations', icon: Plug },
  { to: '/guardrails', label: 'Guardrails & RBAC', icon: ShieldCheck },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-slate-200 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-slate-900">Agentix</p>
              <p className="text-xs text-slate-500">Insurance &amp; Trades</p>
            </div>
          </div>
          <button
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )
              }
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-3">
          <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
            <p className="font-medium text-slate-700">Centralized SaaS</p>
            <p className="mt-0.5">Host, manage &amp; monitor agents at scale.</p>
          </div>
        </div>
      </aside>
    </>
  )
}
