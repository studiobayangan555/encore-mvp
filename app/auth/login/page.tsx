'use client'

import { useState, useEffect } from 'react'
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

  // If already logged in, redirect to reviews
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) window.location.href = '/reviews'
    })
  }, [])

  async function handleGoogle() {
    setLoading(true)
    const supabase = createClient()
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
    const supabase = createClient()

    if (mode === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      if (data.session) {
        // Session confirmed — hard redirect so session is picked up
        window.location.replace('/reviews')
      } else {
        setError('Login succeeded but no session returned. Please try again.')
        setLoading(false)
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      if (data.session) {
        window.location.replace('/reviews')
      } else {
        setMessage('Check your email for a confirmation link, then log in here.')
        setLoading(false)
      }
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '13px 14px', fontFamily: 'DM Sans, sans-serif',
    fontSize: 15, color: 'var(--text)', outline: 'none', marginBottom: 10,
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px', background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center' as const, marginBottom: 36 }}>
          <Logo size={24} />
          <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--text)', marginTop: 20, marginBottom: 8 }}>
            {mode === 'login' ? 'Welcome back' : 'Join encore'}
          </h1>
          <p style={{ fontSize: 15, color: 'var(--muted)' }}>
            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{ display: 'flex', background: 'var(--surface2)', borderRadius: 12, padding: 4, marginBottom: 24 }}>
          {(['login', 'signup'] as Mode[]).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); setMessage('') }} style={{ flex: 1, padding: '10px 0', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, background: mode === m ? 'var(--accent)' : 'transparent', color: mode === m ? 'var(--bg)' : 'var(--muted)', transition: 'all .2s' }}>
              {m === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Google */}
        <button onClick={handleGoogle} disabled={loading} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'white', border: '1px solid #ddd', borderRadius: 10, padding: '13px 0', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 15, color: '#333', marginBottom: 20 }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        {mode === 'signup' && (
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inputStyle} />
        )}
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" style={inputStyle} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" style={{ ...inputStyle, marginBottom: 20 }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()} />

        {error && <p style={{ fontSize: 14, color: '#FF4D6D', marginBottom: 14, textAlign: 'center' as const }}>{error}</p>}
        {message && <p style={{ fontSize: 14, color: 'var(--accent)', marginBottom: 14, textAlign: 'center' as const }}>{message}</p>}

        <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', background: loading ? 'var(--muted)' : 'var(--accent)', color: 'var(--bg)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 15, padding: '14px 0', borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background .2s' }}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}
        </button>

        <p style={{ textAlign: 'center' as const, marginTop: 20, fontSize: 14, color: 'var(--muted)' }}>
          {mode === 'login' ? (
            <>No account? <button onClick={() => setMode('signup')} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>Sign up →</button></>
          ) : (
            <>Already have an account? <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>Log in →</button></>
          )}
        </p>
      </div>
    </div>
  )
}
