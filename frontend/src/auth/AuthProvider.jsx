import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

const AuthContext = createContext(null)

// Local dev user used when Supabase isn't configured, so the app is fully
// usable (data persists in localStorage via the local store).
const DEV_USER = {
  id: 'dev-user',
  email: 'dev@localhost',
  user_metadata: { full_name: 'Dev User', role: 'Local dev mode' },
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(
    isSupabaseConfigured ? null : { user: DEV_USER },
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    configured: isSupabaseConfigured,
    devMode: !isSupabaseConfigured,

    signIn: (email, password) =>
      supabase.auth.signInWithPassword({ email, password }),

    signUp: (email, password, fullName) =>
      supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      }),

    signOut: () => (supabase ? supabase.auth.signOut() : Promise.resolve()),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
