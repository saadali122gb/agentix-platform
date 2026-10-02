import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/auth/AuthProvider'

export default function ProtectedRoute({ children }) {
  const { user, loading, configured } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
      </div>
    )
  }

  // No session (or Supabase not configured) -> send to login.
  if (!user || !configured) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
