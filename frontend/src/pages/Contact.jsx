import { useState } from 'react'
import { Mail, MessageSquare, Github, CheckCircle2 } from 'lucide-react'
import { Button, Input, Textarea, Label, Badge } from '@/components/ui'
import { GITHUB_URL } from '@/lib/site'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  function handleSubmit(e) {
    e.preventDefault()
    // Demo: no backend mail. Wire to your form/email service to go live.
    setSent(true)
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <Badge tone="brand" className="mb-4">Contact</Badge>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Let’s talk
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Questions, a demo, or enterprise needs? Send a note and we’ll get back
          to you.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <InfoRow icon={Mail} title="Email" value="hello@agentix.example" />
          <InfoRow icon={MessageSquare} title="Sales" value="Book a demo for your agency" />
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            <InfoRow icon={Github} title="GitHub" value="Open source — browse the code" />
          </a>
        </div>

        <div className="lg:col-span-3">
          {sent ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-surface p-10 text-center shadow-card">
              <CheckCircle2 className="h-10 w-10 text-brand-600" />
              <p className="mt-3 text-lg font-semibold">Thanks, {form.name || 'there'}!</p>
              <p className="mt-1 text-sm text-muted">
                Your message has been captured (demo). Connect a form service to
                receive it for real.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-card">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
                </div>
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" rows={5} value={form.message} onChange={(e) => update('message', e.target.value)} required />
              </div>
              <Button type="submit" className="w-full">Send message</Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function InfoRow({ icon: Icon, title, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-5 shadow-card">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-content">{title}</p>
        <p className="text-sm text-muted">{value}</p>
      </div>
    </div>
  )
}
