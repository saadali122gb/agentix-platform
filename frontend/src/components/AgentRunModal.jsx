import { useEffect, useRef, useState } from 'react'
import { X, Send, Loader2, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui'
import { api, isBackendConfigured } from '@/services/api'
import { cn } from '@/lib/utils'

/**
 * Chat-style run panel for an agent. Sends the turn to the backend guardrail
 * pipeline (/agents/run). Requires the AI backend (VITE_API_BASE_URL).
 */
export default function AgentRunModal({ agent, onClose }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    setMessages([])
    setInput('')
  }, [agent])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, busy])

  if (!agent) return null

  async function send(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || busy) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text }])

    if (!isBackendConfigured) {
      setMessages((m) => [
        ...m,
        {
          role: 'system',
          text: 'The AI backend is not connected. Set VITE_API_BASE_URL to run agents.',
        },
      ])
      return
    }

    setBusy(true)
    try {
      const res = await api.runAgent({
        name: agent.name,
        category: agent.category,
        instructions: agent.instructions || '',
        input: text,
        model: agent.model,
      })
      if (res.blocked) {
        setMessages((m) => [...m, { role: 'blocked', text: res.reason }])
      } else {
        setMessages((m) => [...m, { role: 'assistant', text: res.output }])
      }
    } catch (err) {
      setMessages((m) => [...m, { role: 'system', text: err.message }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-sm sm:items-center">
      <div className="flex h-[80vh] w-full max-w-lg flex-col rounded-t-2xl border border-line bg-surface shadow-card-hover sm:h-[70vh] sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-content">{agent.name}</p>
            <p className="text-xs text-muted">Guardrailed run</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted hover:bg-canvas hover:text-content"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-5">
          {messages.length === 0 && (
            <p className="mt-10 text-center text-sm text-muted">
              Send a message to run this agent. Responses pass through RBAC and the
              compliance output checker.
            </p>
          )}
          {messages.map((m, i) => (
            <Message key={i} message={m} />
          ))}
          {busy && (
            <div className="flex items-center gap-2 text-sm text-muted">
              <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
            </div>
          )}
        </div>

        <form onSubmit={send} className="flex gap-2 border-t border-line p-3">
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the agent…"
            className="flex-1 rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-content placeholder:text-subtle focus:border-brand-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <Button type="submit" disabled={busy || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

function Message({ message }) {
  const { role, text } = message
  if (role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-brand-600 px-3.5 py-2 text-sm text-white">
          {text}
        </div>
      </div>
    )
  }
  if (role === 'blocked') {
    return (
      <div className="flex gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-600 dark:text-rose-400">
        <ShieldAlert className="h-4 w-4 shrink-0" />
        <span>Blocked by compliance: {text}</span>
      </div>
    )
  }
  if (role === 'system') {
    return (
      <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-center text-xs text-amber-600 dark:text-amber-400">
        {text}
      </p>
    )
  }
  return (
    <div className="flex justify-start">
      <div
        className={cn(
          'max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-canvas px-3.5 py-2 text-sm text-content',
        )}
      >
        {text}
      </div>
    </div>
  )
}
