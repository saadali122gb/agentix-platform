import { Link } from 'react-router-dom'
import { Check, ArrowRight } from 'lucide-react'
import { Button, Badge } from '@/components/ui'
import { cn } from '@/lib/utils'

const tiers = [
  {
    name: 'Starter',
    price: '$0',
    period: '/mo',
    desc: 'For solo brokers trying things out.',
    features: [
      'Up to 3 agents',
      'Bring your own LLM key (Gemini/Claude)',
      'Knowledge base — 50 MB',
      'Community support',
    ],
    cta: 'Get started',
    highlight: false,
  },
  {
    name: 'Growth',
    price: '$49',
    period: '/mo',
    desc: 'For growing agencies and teams.',
    features: [
      'Unlimited agents',
      'RAG knowledge base — 5 GB',
      'CRM + email + Slack integrations',
      'RBAC & compliance guardrails',
      'Priority support',
    ],
    cta: 'Start Growth',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For brokerages with custom needs.',
    features: [
      'SSO & advanced RBAC',
      'Custom CRM build',
      'Audit logs & data residency',
      'Dedicated support & SLAs',
    ],
    cta: 'Contact sales',
    highlight: false,
  },
]

export default function Pricing() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
        <Badge tone="brand" className="mb-4">Pricing</Badge>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Simple, transparent pricing
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted">
          Start free and bring your own model key. Upgrade as your agency grows.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={cn(
                'relative flex flex-col rounded-2xl border bg-surface p-6 shadow-card',
                t.highlight ? 'border-brand-500 ring-1 ring-brand-500' : 'border-line',
              )}
            >
              {t.highlight && (
                <Badge tone="brand" className="absolute -top-3 left-6">
                  Most popular
                </Badge>
              )}
              <h3 className="text-lg font-semibold">{t.name}</h3>
              <p className="mt-1 text-sm text-muted">{t.desc}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight">{t.price}</span>
                <span className="text-sm text-muted">{t.period}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to={t.name === 'Enterprise' ? '/contact' : '/app'} className="mt-6">
                <Button variant={t.highlight ? 'primary' : 'secondary'} className="w-full">
                  {t.cta} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-subtle">
          All plans let you self-host the open-source backend and bring your own
          LLM key. Prices shown are illustrative.
        </p>
      </section>
    </>
  )
}
