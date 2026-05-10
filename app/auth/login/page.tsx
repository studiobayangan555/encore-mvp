'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components'
import { createClient } from '@/lib/supabase'

type Mode = 'login' | 'signup'

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleGoogle() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) { setError(error.message); setLoading(false) }
  }

  async function handleSubmit() {
    setError(''); setMessage('')
    if (!email || !password) { setError('Email and password are required'); return }
    setLoading(true)
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      router.push('/reviews')
      router.refresh()
    } else {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } },
      })
      if (error) { setError(error.message); setLoading(false); return }
      if (data.session) {
        // Email confirmation disabled — go straight to onboarding
        window.location.href = '/reviews'
      } else {
        // Email confirmation enabled — show message
        setMessage('Check your email to confirm your account, then log in.')
      }
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '13px 14px', fontFamily: 'DM Sans, sans-serif',
    fontSize: 15, color: 'var(--text)', outline: 'none', marginBottom: 10,
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div style={{ textAlign: 'center' as const, marginBottom: 32 }}><Logo size={24} /></div>
        <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 24, color: 'var(--text)', marginBottom: 24, textAlign: 'center' as const }}>
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h1>

        {/* Mode toggle */}
        <div style={{ display: 'flex', background: 'var(--surface2)', borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {(['login', 'signup'] as Mode[]).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); setMessage('') }} style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 12, background: mode === m ? 'var(--surface)' : 'transparent', color: mode === m ? 'var(--text)' : 'var(--muted)', transition: 'all 0.15s' }}>
              {m === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Google */}
        <button onClick={handleGoogle} disabled={loading} style={{ width: '100%', background: 'white', color: '#1a1a1a', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 14, padding: '13px 0', borderRadius: 10, border: 'none', cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/></svg>
          Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>or</p>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        {mode === 'signup' && (
          <input type="text" placeholder="Display name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
        )}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ ...inputStyle, marginBottom: 20 }} />

        {error && <p style={{ fontSize: 13, color: 'var(--accent-red)', marginBottom: 12, textAlign: 'center' as const }}>{error}</p>}
        {message && <p style={{ fontSize: 13, color: 'var(--accent)', marginBottom: 12, textAlign: 'center' as const }}>{message}</p>}

        <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', background: 'var(--accent)', color: 'var(--bg)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 14, padding: '14px 0', borderRadius: 10, border: 'none', cursor: loading ? 'wait' : 'pointer', marginBottom: 16, opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Create Account'}
        </button>

        <p style={{ fontSize: 14, color: 'var(--muted)', textAlign: 'center' as const }}>
          {mode === 'login'
            ? <><span>No account? </span><button onClick={() => setMode('signup')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 14, fontFamily: 'DM Sans, sans-serif' }}>Sign up →</button></>
            : <><span>Already have one? </span><button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 14, fontFamily: 'DM Sans, sans-serif' }}>Log in →</button></>
          }
        </p>
      </div>
    </div>
  )
}
