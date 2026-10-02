import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { GITHUB_URL, MARKETING_NAV } from '@/lib/site'

export default function PublicFooter() {
  return (
    <footer className="border-t border-line bg-surface/50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold tracking-tight">Agentix</p>
            </div>
            <p className="mt-3 text-sm text-muted">
              AI agents for insurance brokerages and trades — build, deploy and
              monitor on one platform.
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-subtle">
                Product
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {MARKETING_NAV.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-muted hover:text-content">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-subtle">
                Resources
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link to="/app" className="text-muted hover:text-content">
                    Launch app
                  </Link>
                </li>
                <li>
                  <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="text-muted hover:text-content">
                    GitHub
                  </a>
                </li>
                <li>
                  <Link to="/login" className="text-muted hover:text-content">
                    Sign in
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-line pt-6 text-sm text-muted">
          © {new Date().getFullYear()} Agentix · AI Agent Platform
        </div>
      </div>
    </footer>
  )
}
