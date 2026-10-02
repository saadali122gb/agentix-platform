import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Search, Bell, Sun, Moon, LogOut, ChevronDown } from 'lucide-react'
import { Badge } from '@/components/ui'
import { useTheme } from '@/theme/ThemeProvider'
import { useAuth } from '@/auth/AuthProvider'

function initials(nameOrEmail = '') {
  const base = nameOrEmail.split('@')[0]
  const parts = base.split(/[.\s_-]+/).filter(Boolean)
  return (parts[0]?.[0] || '') + (parts[1]?.[0] || '')
}

export default function Topbar({ onMenuClick }) {
  const { isDark, toggle } = useTheme()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const name = user?.user_metadata?.full_name || user?.email || 'Account'
  const role = user?.user_metadata?.role || 'Broker workspace'

  async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }

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
        <Badge tone="emerald">
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          Live
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

        <div ref={menuRef} className="relative border-l border-line pl-2 sm:pl-3">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-lg p-1 hover:bg-canvas"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-semibold uppercase text-white">
              {initials(name) || 'U'}
            </div>
            <div className="hidden leading-tight sm:block">
              <p className="max-w-[140px] truncate text-sm font-medium text-content">
                {name}
              </p>
              <p className="text-xs text-muted">{role}</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-subtle sm:block" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-card-hover">
              <div className="border-b border-line px-3 py-2">
                <p className="truncate text-sm font-medium text-content">{name}</p>
                {user?.email && (
                  <p className="truncate text-xs text-muted">{user.email}</p>
                )}
              </div>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-content hover:bg-canvas"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
