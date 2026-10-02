import { useState } from 'react'
import { Moon, Sun, Download, Trash2, User, Cpu, Palette } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Label,
  Select,
  Badge,
} from '@/components/ui'
import { useAuth } from '@/auth/AuthProvider'
import { useTheme } from '@/theme/ThemeProvider'
import { listAgents } from '@/services/db'
import { downloadJSON } from '@/lib/download'

const MODEL_KEY = 'agentix:defaultModel'

export default function Settings() {
  const { user, devMode, signOut } = useAuth()
  const { isDark, toggle } = useTheme()
  const name = user?.user_metadata?.full_name || user?.email || 'User'

  const [defaultModel, setDefaultModel] = useState(
    () => localStorage.getItem(MODEL_KEY) || 'gemini-flash-lite-latest',
  )
  const [saved, setSaved] = useState(false)

  function saveModel(v) {
    setDefaultModel(v)
    try {
      localStorage.setItem(MODEL_KEY, v)
    } catch {
      /* ignore */
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  async function exportAll() {
    const agents = await listAgents()
    downloadJSON('agentix-agents.json', agents.map(({ user_id, ...a }) => a))
  }

  function clearLocal() {
    if (!window.confirm('Clear all locally stored agents and settings? This cannot be undone.')) return
    try {
      localStorage.removeItem('agentix:agents')
      localStorage.removeItem(MODEL_KEY)
    } catch {
      /* ignore */
    }
    window.location.reload()
  }

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your profile, model and workspace preferences." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4 text-subtle" /> Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-base font-semibold uppercase text-white">
                  {name.slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-content">{name}</p>
                  <p className="text-xs text-muted">{user?.email || 'local session'}</p>
                </div>
                {devMode && <Badge tone="amber" className="ml-auto">Dev mode</Badge>}
              </div>
              {devMode && (
                <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
                  Running without Supabase — data is stored in this browser. Add
                  Supabase keys to enable real accounts.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-subtle" /> Default model
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="model">New agents default to</Label>
                <Select id="model" value={defaultModel} onChange={(e) => saveModel(e.target.value)}>
                  <optgroup label="Google Gemini">
                    <option value="gemini-flash-lite-latest">Gemini Flash-Lite</option>
                    <option value="gemini-flash-latest">Gemini Flash</option>
                    <option value="gemini-pro-latest">Gemini Pro</option>
                  </optgroup>
                  <optgroup label="Anthropic">
                    <option value="claude-opus-4-8">Claude Opus 4.8</option>
                    <option value="claude-sonnet-5-5">Claude Sonnet 5.5</option>
                  </optgroup>
                </Select>
              </div>
              <p className="text-xs text-subtle">
                The backend falls back to whichever provider has a key configured.
              </p>
              {saved && <p className="text-xs text-brand-600">Saved.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-subtle" /> Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-content">Theme</p>
                  <p className="text-xs text-muted">{isDark ? 'Dark' : 'Light'} mode</p>
                </div>
                <Button variant="secondary" onClick={toggle}>
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  Switch to {isDark ? 'light' : 'dark'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="secondary" className="w-full" onClick={exportAll}>
                <Download className="h-4 w-4" /> Export all agents
              </Button>
              <Button variant="danger" className="w-full" onClick={clearLocal}>
                <Trash2 className="h-4 w-4" /> Clear local data
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" onClick={signOut} disabled={devMode}>
                Sign out
              </Button>
              {devMode && (
                <p className="mt-2 text-xs text-subtle">Sign out is available with Supabase auth.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
