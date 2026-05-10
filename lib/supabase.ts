import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

let client: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  if (!client) {
    client = createSupabaseClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'encore-auth',
      },
      global: {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
        }
      }
    })
  }
  return client
}

export function createDataClient() {
  return createSupabaseClient(url, key, {
    auth: { persistSession: false },
    global: {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
      }
    }
  })
}
