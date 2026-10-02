import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/** True when Supabase credentials are present (real backend available). */
export const isSupabaseConfigured = Boolean(url && anonKey)

/**
 * Supabase client — auth + database for the whole app.
 * When not configured, this is null and the UI shows a setup screen.
 */
export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null
