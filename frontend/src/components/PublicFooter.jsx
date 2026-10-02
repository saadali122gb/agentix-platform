import { Link } from 'react-router-dom'
import { Github, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui'
import { Logo } from '@/components/Logo'
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
        <Logo subtitle="AI Agent Platform" />

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
