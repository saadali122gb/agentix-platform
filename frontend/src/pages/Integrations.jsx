import { Plug, Check, Plus } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import { Card, CardContent, Button, Badge } from '@/components/ui'
import { integrations } from '@/data/mockData'

export default function Integrations() {
  return (
    <>
      <PageHeader
        title="Integrations"
        subtitle="Connect your CRM and communication channels. Racing Snail is the primary CRM."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {integrations.map((item) => {
          const connected = item.status === 'connected'
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
                <h3 className="mt-3 text-base font-semibold text-content">
                  {item.name}
                </h3>
                <p className="text-xs uppercase tracking-wide text-subtle">
                  {item.kind}
                </p>
                <p className="mt-2 text-sm text-muted">{item.detail}</p>
                <Button
                  variant={connected ? 'secondary' : 'primary'}
                  className="mt-4 w-full"
                >
                  {connected ? (
                    <>
                      <Check className="h-4 w-4" /> Manage
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" /> Connect
                    </>
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
            <h3 className="text-sm font-semibold text-content">
              No CRM yet?
            </h3>
            <p className="mt-1 text-sm text-muted">
              Spin up a custom CRM schema for clients without an existing system.
            </p>
          </div>
          <Button variant="secondary">Build custom CRM</Button>
        </CardContent>
      </Card>
    </>
  )
}
