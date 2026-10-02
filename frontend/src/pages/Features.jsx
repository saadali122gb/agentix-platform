import { Link } from 'react-router-dom'
import {
  Zap,
  Workflow,
  Bot,
  MessagesSquare,
  BookOpen,
  Lock,
  Plug,
  Wand2,
  ArrowRight,
  Check,
} from 'lucide-react'
import { Button, Badge } from '@/components/ui'

const groups = [
  {
    icon: Zap,
    title: 'Offensive automations',
    tagline: 'Revenue & growth',
    points: [
      'Lead generation & outbound with qualification',
      'Intent tracking and renewal reminders',
      'Cross-sell / upsell opportunity spotting',
    ],
  },
  {
    icon: Workflow,
    title: 'Defensive automations',
    tagline: 'Operations & admin',
    points: [
      'Reminders, follow-ups and scheduling',
      'Invoice status and payment follow-up',
      'Automated data entry into your CRM',
    ],
  },
  {
    icon: Bot,
    title: 'Virtual assistant',
    tagline: 'Internal operations',
    points: [
      'Answer staff queries on meetings & invoices',
      'Surface business metrics on demand',
      'RBAC-scoped access to data',
    ],
  },
  {
    icon: MessagesSquare,
    title: 'Customer-facing agent',
    tagline: 'Guarded support',
    points: [
      'Handle external questions safely',
      'Never gives binding advice or quotes',
      'Escalates to a licensed human on doubt',
    ],
  },
  {
    icon: BookOpen,
    title: 'Knowledge base (RAG)',
    tagline: 'Grounded answers',
    points: [
      'Ingest PDF, DOCX, TXT, MD, CSV',
      'Gemini embeddings + semantic retrieval',
      'Answers cite your source documents',
    ],
  },
  {
    icon: Lock,
    title: 'Guardrails & RBAC',
    tagline: 'Security & compliance',
    points: [
      'Role-based access control',
      'Compliance screen + LLM output checker',
      'Fails closed on unsafe content',
    ],
  },
  {
    icon: Wand2,
    title: 'Custom agent builder',
    tagline: 'Your workflow',
    points: [
      'Pick model (Claude or Gemini), tools & guardrails',
      'Live preview while you build',
      'Download / import agents as JSON',
    ],
  },
  {
    icon: Plug,
    title: 'Integrations',
    tagline: 'Your stack',
    points: [
      'Racing Snail CRM (primary)',
      'Outlook, Gmail, Slack, Teams',
      'Custom CRM option when you have none',
    ],
  },
]

export default function Features() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
        <Badge tone="brand" className="mb-4">Features</Badge>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Everything you need to run AI agents
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted">
          A complete platform for insurance and trades — offensive and defensive
          automations, a knowledge base, integrations and compliance, all in one
          place.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {groups.map(({ icon: Icon, title, tagline, points }) => (
            <div key={title} className="rounded-2xl border border-line bg-surface p-6 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">{title}</h3>
                  <p className="text-xs uppercase tracking-wide text-subtle">{tagline}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/app">
            <Button size="lg">
              Launch the platform <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
