import { Menu, Search, Bell } from 'lucide-react'
import { isBackendConfigured } from '@/services/api'
import { Badge } from '@/components/ui'

export default function Topbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur lg:px-6">
      <button
        className="rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search agents, documents, clients…"
          className="w-full max-w-md rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <Badge tone={isBackendConfigured ? 'emerald' : 'amber'}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {isBackendConfigured ? 'Backend connected' : 'Demo mode'}
        </Badge>

        <button
          className="relative rounded-md p-2 text-slate-500 hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-2.5 border-l border-slate-200 pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
            AB
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-medium text-slate-900">Agency Admin</p>
            <p className="text-xs text-slate-500">Broker workspace</p>
          </div>
        </div>
      </div>
    </header>
  )
}
