import { Routes, Route, Link } from 'react-router-dom'
import Layout from '@/components/Layout'
import PublicLayout from '@/components/PublicLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import Home from '@/pages/Home'
import Features from '@/pages/Features'
import Pricing from '@/pages/Pricing'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import AgentsCatalog from '@/pages/AgentsCatalog'
import AgentDetail from '@/pages/AgentDetail'
import CustomBuilder from '@/pages/CustomBuilder'
import KnowledgeBase from '@/pages/KnowledgeBase'
import Integrations from '@/pages/Integrations'
import Guardrails from '@/pages/Guardrails'
import Analytics from '@/pages/Analytics'
import Settings from '@/pages/Settings'
import { Button } from '@/components/ui'

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-6xl font-bold text-line">404</p>
      <p className="mt-2 text-sm text-muted">This page doesn’t exist.</p>
      <Link to="/app">
        <Button className="mt-4">Back to overview</Button>
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Public marketing site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/login" element={<Login />} />

      {/* App (protected) */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="agents" element={<AgentsCatalog />} />
        <Route path="agents/:id" element={<AgentDetail />} />
        <Route path="builder" element={<CustomBuilder />} />
        <Route path="knowledge-base" element={<KnowledgeBase />} />
        <Route path="integrations" element={<Integrations />} />
        <Route path="guardrails" element={<Guardrails />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
