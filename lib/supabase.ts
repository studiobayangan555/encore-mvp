import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Always create a fresh client — singleton causes GoTrueClient conflicts
export function createClient() {
  return createSupabaseClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'encore-auth',
      flowType: 'pkce',
    }
  })
}

// Data client — no auth, for public reads
export function createDataClient() {
  return createSupabaseClient(url, key, {
    auth: { persistSession: false }
  })
}
