import { Link } from 'react-router-dom'
import { ShieldCheck, Github, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui'
import { GITHUB_URL, COMPANY } from '@/lib/site'

export default function PublicFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      {/* CTA band */}
      <div className="border-b border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 text-center sm:flex-row sm:px-6 sm:text-left">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-content">
              Ready to deploy your AI agents?
            </h3>
            <p className="mt-1 text-sm text-muted">
              Launch the platform and run your first guardrailed agent in minutes.
            </p>
          </div>
          <div className="flex gap-2">
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              <Button variant="secondary">
                <Github className="h-4 w-4" /> GitHub
              </Button>
            </a>
            <Link to="/app">
              <Button>
                Launch app <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-tight text-content">Agentix</p>
            <p className="text-[11px] text-muted">AI Agent Platform</p>
          </div>
        </div>

        <div className="text-center text-sm text-muted sm:text-right">
          <p>
            Built by <span className="font-semibold text-content">{COMPANY}</span>
          </p>
          <p className="mt-0.5 text-xs text-subtle">
            © {new Date().getFullYear()} {COMPANY}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
