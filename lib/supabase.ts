import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Module-level singleton — one instance for the entire browser session
// This persists across Next.js navigation and component remounts
declare global {
  var __supabase_client: SupabaseClient | undefined
  var __supabase_data_client: SupabaseClient | undefined
}

export function createClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    // Server-side — always create fresh
    return createSupabaseClient(url, key, {
      auth: { persistSession: false }
    })
  }
  // Browser — use global singleton
  if (!global.__supabase_client) {
    global.__supabase_client = createSupabaseClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'encore-auth',
        flowType: 'pkce',
      }
    })
  }
  return global.__supabase_client
}

export function createDataClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    return createSupabaseClient(url, key, { auth: { persistSession: false } })
  }
  if (!global.__supabase_data_client) {
    global.__supabase_data_client = createSupabaseClient(url, key, {
      auth: { persistSession: false }
    })
  }
  return global.__supabase_data_client
}
