'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function TestPage() {
  const [result, setResult] = useState<any>(null)
  const [envUrl, setEnvUrl] = useState('')

  useEffect(() => {
    setEnvUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET')
    const supabase = createClient()
    supabase.from('shows').select('id, artist, is_published').limit(3).then(({ data, error }) => {
      setResult({ data, error })
    })
  }, [])

  return (
    <div style={{ padding: 40, fontFamily: 'monospace', background: '#080A0F', color: '#E8ECF4', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: 20 }}>Supabase Connection Test</h1>
      <p style={{ marginBottom: 10 }}>SUPABASE_URL: <strong style={{ color: envUrl === 'NOT SET' ? 'red' : '#E8FF47' }}>{envUrl}</strong></p>
      <pre style={{ background: '#0F1219', padding: 20, borderRadius: 8, fontSize: 13 }}>
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  )
}
