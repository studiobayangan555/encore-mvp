'use client'

import { createContext, useContext, useEffect, useState } from 'react'
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

  useEffect(() => {
    // Use a single stable reference — do not recreate inside callbacks
    const supabase = createClient()
    let mounted = true

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data } = await supabase
          .from('profiles').select('display_name').eq('id', session.user.id).single()
        if (data?.display_name) setProfileName(data.display_name)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data } = await supabase
          .from('profiles').select('display_name').eq('id', session.user.id).single()
        setProfileName(data?.display_name ?? null)
      } else {
        setProfileName(null)
      }
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return <Ctx.Provider value={{ user, profileName, loading }}>{children}</Ctx.Provider>
}
