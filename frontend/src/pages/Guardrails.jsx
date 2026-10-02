import { ShieldCheck, Lock, FileCheck2, UserCog } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
} from '@/components/ui'

const roles = [
  { role: 'Agency Admin', scope: 'Full access · all agents, clients, settings', tone: 'brand' },
  { role: 'Sales Team', scope: 'Lead & renewal agents · own pipeline only', tone: 'emerald' },
  { role: 'Project Manager', scope: 'Workflow & task agents · assigned projects', tone: 'sky' },
  { role: 'Customer', scope: 'Customer-facing agent · own policy data only', tone: 'amber' },
]

const checks = [
  {
    icon: Lock,
    title: 'Role-Based Access Control (RBAC)',
    desc: 'Every database query is filtered by the authenticated user’s role and token. Agents can never read data outside their scope.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance layer',
    desc: 'Unauthorised sales commitments and binding policy advice are blocked before a response leaves the system.',
  },
  {
    icon: FileCheck2,
    title: 'Output checker',
    desc: 'Each agent response is validated by a secondary LLM pass against the compliance policy before delivery.',
  },
]

export default function Guardrails() {
  return (
    <>
      <PageHeader
        title="Guardrails & RBAC"
        subtitle="Security and compliance controls applied across every agent."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {checks.map(({ icon: Icon, title, desc }) => (
          <Card key={title}>
            <CardContent className="p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-300">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-content">
                {title}
              </h3>
              <p className="mt-1.5 text-sm text-muted">{desc}</p>
              <Badge tone="emerald" className="mt-3">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                Enforced
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-4 w-4 text-subtle" />
            Role access matrix
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-line">
            {roles.map((r) => (
              <div
                key={r.role}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <Badge tone={r.tone}>{r.role}</Badge>
                <p className="text-right text-sm text-muted">{r.scope}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Active system guardrail prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
{`SYSTEM PROMPT GUARDRAIL:
- You are an AI Assistant for Insurance & Trades.
- Do NOT issue binding policy coverage guarantees or direct
  policy advice without explicit licensed human approval.
- Strictly verify user permissions before accessing
  customer-specific documents.`}
          </pre>
        </CardContent>
      </Card>
    </>
  )
}
