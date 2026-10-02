import { Routes, Route, Link } from 'react-router-dom'
import Layout from '@/components/Layout'
import Dashboard from '@/pages/Dashboard'
import AgentsCatalog from '@/pages/AgentsCatalog'
import CustomBuilder from '@/pages/CustomBuilder'
import KnowledgeBase from '@/pages/KnowledgeBase'
import Integrations from '@/pages/Integrations'
import Guardrails from '@/pages/Guardrails'
import { Button } from '@/components/ui'

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-5xl font-bold text-slate-200">404</p>
      <p className="mt-2 text-sm text-slate-500">This page doesn’t exist.</p>
      <Link to="/">
        <Button className="mt-4">Back to overview</Button>
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="agents" element={<AgentsCatalog />} />
        <Route path="builder" element={<CustomBuilder />} />
        <Route path="knowledge-base" element={<KnowledgeBase />} />
        <Route path="integrations" element={<Integrations />} />
        <Route path="guardrails" element={<Guardrails />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
