'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase'

interface SessionCtx {
  user: any
  profileName: string | null
  loading: boolean
}

const Ctx = createContext<SessionCtx>({ user: null, profileName: null, loading: true })

export function useSession() { return useContext(Ctx) }

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [profileName, setProfileName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const initialized = useRef(false)

  useEffect(() => {
    // Only initialize once — prevents re-fetching on navigation
    if (initialized.current) return
    initialized.current = true

    const supabase = createClient()

    // Get initial session from localStorage (fast, no network)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const name = session.user.user_metadata?.full_name 
          || session.user.email?.split('@')[0] 
          || null
        setProfileName(name)
        // Try to get display_name from profiles table
        supabase.from('profiles')
          .select('display_name')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data?.display_name) setProfileName(data.display_name)
          })
      }
      setLoading(false)
    })

    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const name = session.user.user_metadata?.full_name
          || session.user.email?.split('@')[0]
          || null
        setProfileName(name)
        if (event === 'SIGNED_IN') {
          supabase.from('profiles')
            .select('display_name')
            .eq('id', session.user.id)
            .single()
            .then(({ data }) => {
              if (data?.display_name) setProfileName(data.display_name)
            })
        }
      } else {
        setProfileName(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return <Ctx.Provider value={{ user, profileName, loading }}>{children}</Ctx.Provider>
}
