import { useState } from 'react'
import PageHeader from '@/components/PageHeader'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Textarea,
  Select,
  Label,
  Badge,
} from '@/components/ui'
import { AGENT_CATEGORIES } from '@/data/mockData'
import { cn } from '@/lib/utils'

const TOOLS = [
  'CRM lookup',
  'CRM update',
  'Send email',
  'Schedule meeting',
  'Knowledge base search',
  'Invoice status',
  'Slack notify',
  'Web search',
]

const DEFAULT_GUARDRAIL = `- You are an AI Assistant for Insurance & Trades.
- Do NOT issue binding policy coverage guarantees or direct policy advice without explicit licensed human approval.
- Strictly verify user permissions before accessing customer-specific documents.`

export default function CustomBuilder() {
  const [form, setForm] = useState({
    name: '',
    category: 'defensive',
    model: 'claude-opus-4-8',
    description: '',
    tools: ['Knowledge base search'],
    guardrail: DEFAULT_GUARDRAIL,
  })
  const [saved, setSaved] = useState(false)

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    setSaved(false)
  }

  const toggleTool = (tool) =>
    setForm((f) => ({
      ...f,
      tools: f.tools.includes(tool)
        ? f.tools.filter((t) => t !== tool)
        : [...f.tools, tool],
    }))

  const handleSubmit = (e) => {
    e.preventDefault()
    // In production this calls api.createAgent(form) against the cloud backend.
    setSaved(true)
  }

  return (
    <>
      <PageHeader
        title="Custom Agent Builder"
        subtitle="Design an agent around your own workflow, tools and guardrails."
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Agent basics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Agent name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Renewal Reminder Assistant"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    id="category"
                    value={form.category}
                    onChange={(e) => update('category', e.target.value)}
                  >
                    {Object.entries(AGENT_CATEGORIES).map(([key, v]) => (
                      <option key={key} value={key}>
                        {v.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Select
                    id="model"
                    value={form.model}
                    onChange={(e) => update('model', e.target.value)}
                  >
                    <option value="claude-opus-4-8">Claude Opus 4.8</option>
                    <option value="claude-sonnet-5-5">Claude Sonnet 5.5</option>
                    <option value="claude-haiku-4-5">Claude Haiku 4.5</option>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="desc">Description</Label>
                <Textarea
                  id="desc"
                  rows={3}
                  placeholder="What should this agent do?"
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tools &amp; capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {TOOLS.map((tool) => {
                  const on = form.tools.includes(tool)
                  return (
                    <button
                      type="button"
                      key={tool}
                      onClick={() => toggleTool(tool)}
                      className={cn(
                        'rounded-lg border px-3 py-2 text-left text-sm transition-colors',
                        on
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
                      )}
                    >
                      {tool}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System guardrail prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={6}
                className="font-mono text-xs"
                value={form.guardrail}
                onChange={(e) => update('guardrail', e.target.value)}
              />
              <p className="mt-2 text-xs text-slate-400">
                These restrictions are injected into every prompt and verified by
                the output checker before responses are sent.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Live preview */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Name
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {form.name || 'Untitled agent'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Category
                </p>
                <Badge tone={AGENT_CATEGORIES[form.category].tone} className="mt-1">
                  {AGENT_CATEGORIES[form.category].label}
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Tools ({form.tools.length})
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {form.tools.length ? (
                    form.tools.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                      >
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400">None selected</span>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full">
                Create agent
              </Button>
              {saved && (
                <p className="rounded-lg bg-emerald-50 px-3 py-2 text-center text-sm text-emerald-700">
                  Agent configuration saved (demo). Wire up the backend to deploy.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </form>
    </>
  )
}
