import { useEffect, useState } from 'react'
import { Plug, Check, Plus, X, Link2, Unlink } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import {
  Card,
  CardContent,
  Button,
  Badge,
  Input,
  Label,
} from '@/components/ui'

const CATALOG = [
  { id: 'racing-snail', name: 'Racing Snail CRM', kind: 'CRM', fields: [
    { key: 'apiUrl', label: 'API URL', placeholder: 'https://api.racingsnail.com' },
    { key: 'apiKey', label: 'API key', placeholder: 'rs_live_…', secret: true },
  ] },
  { id: 'outlook', name: 'Outlook', kind: 'Email', oauth: true },
  { id: 'gmail', name: 'Gmail', kind: 'Email', oauth: true },
  { id: 'slack', name: 'Slack', kind: 'Chat', fields: [
    { key: 'webhookUrl', label: 'Incoming webhook URL', placeholder: 'https://hooks.slack.com/…', secret: true },
  ] },
  { id: 'teams', name: 'Microsoft Teams', kind: 'Chat', oauth: true },
]

const STORE = 'agentix:integrations'

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORE) || '{}')
  } catch {
    return {}
  }
}
function saveState(s) {
  try {
    localStorage.setItem(STORE, JSON.stringify(s))
  } catch {
    /* ignore */
  }
}

export default function Integrations() {
  const [state, setState] = useState(loadState)
  const [modal, setModal] = useState(null) // integration being configured

  useEffect(() => saveState(state), [state])

  function connect(id, values) {
    setState((s) => ({ ...s, [id]: { connected: true, values: values || {}, at: Date.now() } }))
    setModal(null)
  }
  function disconnect(id) {
    setState((s) => {
      const next = { ...s }
      delete next[id]
      return next
    })
    setModal(null)
  }

  return (
    <>
      <PageHeader
        title="Integrations"
        subtitle="Connect your CRM and communication channels. Racing Snail is the primary CRM."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CATALOG.map((item) => {
          const connected = Boolean(state[item.id]?.connected)
          return (
            <Card key={item.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-canvas text-muted">
                    <Plug className="h-5 w-5" />
                  </div>
                  <Badge tone={connected ? 'emerald' : 'slate'}>
                    {connected ? 'Connected' : 'Not connected'}
                  </Badge>
                </div>
                <h3 className="mt-3 text-base font-semibold text-content">{item.name}</h3>
                <p className="text-xs uppercase tracking-wide text-subtle">{item.kind}</p>
                <Button
                  variant={connected ? 'secondary' : 'primary'}
                  className="mt-4 w-full"
                  onClick={() => (item.oauth && !connected ? connect(item.id) : setModal(item))}
                >
                  {connected ? (
                    <><Check className="h-4 w-4" /> Manage</>
                  ) : item.oauth ? (
                    <><Link2 className="h-4 w-4" /> Connect</>
                  ) : (
                    <><Plus className="h-4 w-4" /> Connect</>
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="mt-6">
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-content">No CRM yet?</h3>
            <p className="mt-1 text-sm text-muted">
              Spin up a custom CRM schema for clients without an existing system.
            </p>
          </div>
          <Button variant="secondary">Build custom CRM</Button>
        </CardContent>
      </Card>

      {modal && (
        <ConnectModal
          item={modal}
          state={state[modal.id]}
          onClose={() => setModal(null)}
          onConnect={(values) => connect(modal.id, values)}
          onDisconnect={() => disconnect(modal.id)}
        />
      )}
    </>
  )
}

function ConnectModal({ item, state, onClose, onConnect, onDisconnect }) {
  const connected = Boolean(state?.connected)
  const [values, setValues] = useState(state?.values || {})

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface shadow-card-hover">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <p className="text-sm font-semibold text-content">
            {connected ? 'Manage' : 'Connect'} {item.name}
          </p>
          <button onClick={onClose} className="rounded-md p-1.5 text-muted hover:bg-canvas hover:text-content" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 p-5">
          {(item.fields || []).map((f) => (
            <div key={f.key}>
              <Label htmlFor={f.key}>{f.label}</Label>
              <Input
                id={f.key}
                type={f.secret ? 'password' : 'text'}
                placeholder={f.placeholder}
                value={values[f.key] || ''}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              />
            </div>
          ))}
          {!item.fields && (
            <p className="text-sm text-muted">
              This integration connects via OAuth. In this demo it’s marked
              connected locally.
            </p>
          )}
          <div className="flex gap-2 pt-1">
            <Button className="flex-1" onClick={() => onConnect(values)}>
              {connected ? 'Save' : 'Connect'}
            </Button>
            {connected && (
              <Button variant="danger" onClick={onDisconnect}>
                <Unlink className="h-4 w-4" /> Disconnect
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
