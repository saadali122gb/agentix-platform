import { Menu, Search, Bell, Sun, Moon } from 'lucide-react'
import { isBackendConfigured } from '@/services/api'
import { Badge } from '@/components/ui'
import { useTheme } from '@/theme/ThemeProvider'

export default function Topbar({ onMenuClick }) {
  const { isDark, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-surface/80 px-4 backdrop-blur-md lg:px-6">
      <button
        className="rounded-md p-2 text-muted hover:bg-canvas hover:text-content lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
        <input
          type="search"
          placeholder="Search agents, documents, clients…"
          className="w-full max-w-md rounded-lg border border-line bg-canvas py-2 pl-9 pr-3 text-sm text-content placeholder:text-subtle focus:border-brand-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <Badge tone={isBackendConfigured ? 'emerald' : 'amber'}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {isBackendConfigured ? 'Backend connected' : 'Demo mode'}
        </Badge>

        <button
          onClick={toggle}
          className="rounded-lg p-2 text-muted transition-colors hover:bg-canvas hover:text-content"
          aria-label="Toggle theme"
          title={isDark ? 'Switch to light' : 'Switch to dark'}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <button
          className="relative rounded-lg p-2 text-muted transition-colors hover:bg-canvas hover:text-content"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-surface" />
        </button>

        <div className="flex items-center gap-2.5 border-l border-line pl-2 sm:pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-semibold text-white">
            AB
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-medium text-content">Agency Admin</p>
            <p className="text-xs text-muted">Broker workspace</p>
          </div>
        </div>
      </div>
    </header>
  )
}
