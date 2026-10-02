import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Github,
  Download,
  Bot,
  Zap,
  BookOpen,
  Lock,
  Workflow,
  MessagesSquare,
} from 'lucide-react'
import { Button, Badge } from '@/components/ui'
import { STARTER_AGENTS } from '@/data/starterAgents'
import { AGENT_CATEGORIES } from '@/data/mockData'
import { downloadJSON, slugify } from '@/lib/download'
import { GITHUB_URL } from '@/lib/site'

const features = [
  { icon: Zap, title: 'Offensive automations', desc: 'Lead generation, outbound and renewal tracking that grows revenue.' },
  { icon: Workflow, title: 'Defensive automations', desc: 'Reminders, follow-ups, invoicing and automated data entry.' },
  { icon: Bot, title: 'Virtual assistant', desc: 'Answer internal queries on meetings, invoices and metrics.' },
  { icon: MessagesSquare, title: 'Customer-facing', desc: 'Guarded external support that never oversteps compliance.' },
  { icon: BookOpen, title: 'Knowledge base (RAG)', desc: 'Ingest SOPs, FAQs and policies; answers grounded in your docs.' },
  { icon: Lock, title: 'Guardrails & RBAC', desc: 'Role-based access plus a compliance output checker on every reply.' },
]

function downloadAgent(agent) {
  downloadJSON(`${slugify(agent.name)}.agent.json`, agent)
}
function downloadAll() {
  downloadJSON('agentix-starter-agents.json', STARTER_AGENTS)
}

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{ background: 'radial-gradient(60% 50% at 50% 0%, rgba(16,185,129,0.18), transparent 70%)' }}
        />
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <Badge tone="brand" className="mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            AI agents for insurance &amp; trades
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Deploy, manage &amp; monitor{' '}
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
              AI agents
            </span>{' '}
            at scale
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
            One platform to build offensive and defensive automations, a RAG
            knowledge base, CRM integrations and compliance guardrails — for
            brokerages and trades teams.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/app">
              <Button size="lg">
                Launch the platform <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="secondary" onClick={downloadAll}>
              <Download className="h-4 w-4" /> Download starter agents
            </Button>
          </div>
          <p className="mt-4 text-xs text-subtle">
            No credit card · runs in your browser · open source
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold tracking-tight">
          Everything on one platform
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-muted">
          Standardized agents, a custom builder, knowledge base, integrations and
          security — all in a single workspace.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-line bg-surface p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted">{desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/features">
            <Button variant="secondary">
              See all features <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Downloadable agents */}
      <section className="border-y border-line bg-surface/50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Pre-built agents</h2>
              <p className="mt-2 max-w-2xl text-muted">
                Download any agent as a JSON config, or grab them all. Open the
                GitHub repo to browse and contribute.
              </p>
            </div>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              <Button variant="secondary">
                <Github className="h-4 w-4" /> Open GitHub repo
              </Button>
            </a>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STARTER_AGENTS.map((agent) => {
              const cat = AGENT_CATEGORIES[agent.category]
              return (
                <div key={agent.name} className="flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-card">
                  <Badge tone={cat.tone}>{cat.label.split(' ')[0]}</Badge>
                  <h3 className="mt-2 text-base font-semibold">{agent.name}</h3>
                  <p className="mt-1.5 flex-1 text-sm text-muted">{agent.description}</p>
                  <Button variant="secondary" className="mt-4 w-full" onClick={() => downloadAgent(agent)}>
                    <Download className="h-4 w-4" /> Download
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight">Ready to automate?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Launch the platform, install the starter agents, and run your first
          guardrailed AI agent in minutes.
        </p>
        <Link to="/app">
          <Button size="lg" className="mt-6">
            Launch the platform <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>
    </>
  )
}
