import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ArrowRight, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui'
import { Logo } from '@/components/Logo'
import { MARKETING_NAV } from '@/lib/site'
import { cn } from '@/lib/utils'

export default function PublicNav() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {MARKETING_NAV.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-brand-600'
                    : 'text-muted hover:bg-canvas hover:text-content',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/login" className="hidden sm:block">
            <Button variant="secondary">Sign in</Button>
          </Link>
          <Link to="/app">
            <Button>
              Launch app <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          {MARKETING_NAV.length > 0 && (
            <button
              className="rounded-md p-2 text-muted hover:bg-canvas md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {open && MARKETING_NAV.length > 0 && (
        <div className="border-t border-line bg-surface px-4 py-3 md:hidden">
          {MARKETING_NAV.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-canvas hover:text-content"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
