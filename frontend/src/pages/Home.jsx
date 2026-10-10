import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Download,
  Bot,
  Zap,
  BookOpen,
  Lock,
  Workflow,
  MessagesSquare,
} from 'lucide-react'
import { Button, Badge } from '@/components/ui'
import { LogoBadge } from '@/components/Logo'
import { STARTER_AGENTS } from '@/data/starterAgents'
import { AGENT_CATEGORIES } from '@/data/mockData'
import { downloadJSON, slugify } from '@/lib/download'

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

const PREVIEW_AGENTS = [
  ['Lead Generation', 92],
  ['Workflow & Tasks', 78],
  ['Data Entry', 64],
  ['Customer Support', 51],
]

function HeroPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_70px_-24px_rgba(0,0,0,0.30)] ring-1 ring-black/5">
      {/* window bar */}
      <div className="flex items-center gap-2 border-b border-line bg-canvas px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-zinc-300" />
        <span className="h-3 w-3 rounded-full bg-zinc-300" />
        <span className="h-3 w-3 rounded-full bg-zinc-300" />
        <div className="mx-auto flex items-center gap-2 rounded-md bg-surface px-3 py-1 text-xs text-subtle ring-1 ring-line">
          app.agentix · Overview
        </div>
      </div>
      {/* body */}
      <div className="grid grid-cols-1 text-left sm:grid-cols-[180px_1fr]">
        {/* mini sidebar */}
        <div className="hidden border-r border-line p-4 sm:block">
          <div className="flex items-center gap-2">
            <LogoBadge className="h-7 w-7" />
            <div className="h-2 w-14 rounded bg-zinc-200" />
          </div>
          <div className="mt-5 space-y-2.5">
            <div className="h-2.5 w-24 rounded bg-zinc-800" />
            <div className="h-2.5 w-20 rounded bg-zinc-200" />
            <div className="h-2.5 w-16 rounded bg-zinc-200" />
            <div className="h-2.5 w-24 rounded bg-zinc-200" />
            <div className="h-2.5 w-20 rounded bg-zinc-200" />
          </div>
        </div>
        {/* content */}
        <div className="p-5">
          <div className="grid grid-cols-3 gap-3">
            {[['Active agents', '6 / 6'], ['Runs today', '1,055'], ['Success', '92%']].map(([l, v]) => (
              <div key={l} className="rounded-xl border border-line bg-canvas/50 p-3">
                <p className="text-[11px] text-subtle">{l}</p>
                <p className="mt-1 text-lg font-bold tabular-nums tracking-tight text-content">{v}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-line p-4">
            <p className="mb-3 text-xs font-medium text-muted">Runs by agent</p>
            <div className="space-y-3">
              {PREVIEW_AGENTS.map(([name, v], i) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-xs text-muted">{name}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100">
                    <span
                      className="block h-full origin-left animate-grow-x rounded-full bg-gradient-to-r from-zinc-700 to-zinc-900"
                      style={{ width: `${v}%`, animationDelay: `${0.6 + i * 0.12}s` }}
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        {/* drifting dotted grid (more visible across the white area) */}
        <div
          className="animate-grid-pan pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(39,39,42,0.18) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(ellipse 100% 90% at 50% 10%, #000 60%, transparent 92%)',
            WebkitMaskImage: 'radial-gradient(ellipse 100% 90% at 50% 10%, #000 60%, transparent 92%)',
          }}
        />
        {/* spinning aurora shades */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            className="animate-spin-slow absolute left-1/2 top-[-280px] h-[760px] w-[760px] -translate-x-1/2 rounded-full opacity-[0.30] blur-3xl"
            style={{
              background:
                'conic-gradient(from 0deg, rgba(39,39,42,0), rgba(39,39,42,0.42), rgba(24,24,27,0), rgba(63,63,70,0.38), rgba(39,39,42,0))',
            }}
          />
          <div
            className="animate-spin-slow absolute bottom-[-260px] left-1/4 h-[560px] w-[560px] rounded-full opacity-[0.22] blur-3xl"
            style={{
              animationDirection: 'reverse',
              animationDuration: '40s',
              background:
                'conic-gradient(from 90deg, rgba(63,63,70,0), rgba(39,39,42,0.34), rgba(63,63,70,0), rgba(24,24,27,0.30), rgba(63,63,70,0))',
            }}
          />
        </div>
        {/* floating glow orbs */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="animate-float-slow animate-pulse-glow absolute -left-10 top-[-60px] h-72 w-72 rounded-full bg-zinc-400/30 blur-3xl" />
          <div className="animate-float animate-pulse-glow absolute right-[-40px] top-10 h-80 w-80 rounded-full bg-zinc-500/25 blur-3xl" />
          <div className="animate-float-slow absolute bottom-6 left-1/3 h-64 w-64 rounded-full bg-zinc-400/20 blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl px-4 pt-20 text-center sm:px-6 sm:pt-28">
          <Badge tone="brand" className="mb-5 animate-fade-up">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
            AI agents for insurance &amp; trades
          </Badge>
          <h1
            className="animate-fade-up text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
            style={{ animationDelay: '0.08s' }}
          >
            Deploy, manage &amp; monitor{' '}
            <span className="animate-gradient-x bg-gradient-to-r from-zinc-900 via-zinc-400 to-zinc-900 bg-[length:200%_auto] bg-clip-text text-transparent">
              AI agents
            </span>
            <br className="hidden sm:block" /> at scale
          </h1>
          <p
            className="mx-auto mt-5 max-w-2xl animate-fade-up text-lg text-muted"
            style={{ animationDelay: '0.16s' }}
          >
            One platform to build offensive and defensive automations, a RAG
            knowledge base, CRM integrations and compliance guardrails — for
            brokerages and trades teams.
          </p>
          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-fade-up"
            style={{ animationDelay: '0.24s' }}
          >
            <Link to="/app">
              <Button size="lg" className="transition-transform hover:scale-[1.03]">
                Launch the platform <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="secondary"
              onClick={downloadAll}
              className="transition-transform hover:scale-[1.03]"
            >
              <Download className="h-4 w-4" /> Download starter agents
            </Button>
          </div>
          <p
            className="mt-4 animate-fade-up text-xs text-subtle"
            style={{ animationDelay: '0.32s' }}
          >
            No credit card · runs in your browser · open source
          </p>
        </div>

        {/* product preview */}
        <div
          className="mx-auto mt-14 max-w-5xl animate-fade-up px-4 sm:px-6"
          style={{ animationDelay: '0.42s' }}
        >
          <div className="animate-float">
            <HeroPreview />
          </div>
        </div>
        <div className="h-16 sm:h-24" />
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
      </section>

      {/* Downloadable agents */}
      <section className="border-y border-line bg-surface/50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Pre-built agents</h2>
            <p className="mt-2 max-w-2xl text-muted">
              Download any agent as a JSON config, or grab them all.
            </p>
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
