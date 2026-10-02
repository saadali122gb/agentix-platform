import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
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
import { useAuth } from '@/auth/AuthProvider'
import { createAgent } from '@/services/db'
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
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    category: 'defensive',
    model: 'claude-opus-4-8',
    description: '',
    tools: ['Knowledge base search'],
    guardrail: DEFAULT_GUARDRAIL,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    setError('')
  }

  const toggleTool = (tool) =>
    setForm((f) => ({
      ...f,
      tools: f.tools.includes(tool)
        ? f.tools.filter((t) => t !== tool)
        : [...f.tools, tool],
    }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await createAgent(user.id, {
        name: form.name,
        category: form.category,
        model: form.model,
        description: form.description,
        instructions: form.guardrail,
        tools: form.tools,
        guardrails: [],
        status: 'active',
        runs_today: 0,
        success_rate: 0,
      })
      navigate('/agents')
    } catch (err) {
      setError(err.message || 'Could not create agent.')
    } finally {
      setSaving(false)
    }
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
                          ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-300'
                          : 'border-line bg-surface text-muted hover:border-line',
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
              <p className="mt-2 text-xs text-subtle">
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
                <p className="text-xs font-medium uppercase tracking-wide text-subtle">
                  Name
                </p>
                <p className="text-sm font-semibold text-content">
                  {form.name || 'Untitled agent'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-subtle">
                  Category
                </p>
                <Badge tone={AGENT_CATEGORIES[form.category].tone} className="mt-1">
                  {AGENT_CATEGORIES[form.category].label}
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-subtle">
                  Tools ({form.tools.length})
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {form.tools.length ? (
                    form.tools.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-canvas px-2 py-0.5 text-xs text-muted"
                      >
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-subtle">None selected</span>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={saving || !form.name.trim()}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Create agent
              </Button>
              {error && (
                <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-center text-sm text-rose-600 dark:text-rose-400">
                  {error}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </form>
    </>
  )
}
