import { Link } from 'react-router-dom'
import { ArrowRight, Target, ShieldCheck, Layers, Cpu } from 'lucide-react'
import { Button, Badge } from '@/components/ui'

const values = [
  { icon: Target, title: 'Outcome-driven', desc: 'Agents that move real numbers — more renewals, fewer missed follow-ups.' },
  { icon: ShieldCheck, title: 'Compliance-first', desc: 'Guardrails and an output checker on every reply, built for regulated work.' },
  { icon: Layers, title: 'All-in-one', desc: 'Build, deploy, monitor, and manage your knowledge base in one platform.' },
  { icon: Cpu, title: 'Model-flexible', desc: 'Use Claude or Gemini per agent — bring your own key.' },
]

const stack = [
  'React + Vite frontend',
  'Supabase (auth + Postgres + RLS)',
  'Node / Express AI backend',
  'Gemini & Claude (per-agent)',
  'RAG with vector search',
  'GitHub Pages deploy',
]

export default function About() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
        <Badge tone="brand" className="mb-4">About</Badge>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Built for insurance &amp; trades teams
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted">
          Agentix helps brokerages and trades businesses deploy AI agents that
          actually respect compliance — automating the busywork so people can
          focus on clients.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-line bg-surface p-6 shadow-card">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-line bg-surface p-8 shadow-card">
          <h2 className="text-xl font-bold tracking-tight">Under the hood</h2>
          <p className="mt-2 max-w-2xl text-muted">
            An open, hybrid architecture — a static frontend plus a cloud AI
            backend that holds your keys. Self-host it or run it in your browser.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {stack.map((s) => (
              <span key={s} className="rounded-lg bg-canvas px-3 py-1.5 text-sm text-muted">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-20 text-center sm:px-6">
        <Link to="/app">
          <Button size="lg">
            Launch the platform <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>
    </>
  )
}
