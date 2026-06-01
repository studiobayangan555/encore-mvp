'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TopNav, BottomNav, MobileHeader, MobileFooter, Footer, Breadcrumb, S } from '@/components'
import { createClient } from '@/lib/supabase'
import { useSession } from '@/components/session-provider'

const COUNTRIES = ['Malaysia', 'Singapore', 'Thailand', 'Indonesia', 'Philippines']
const TYPES = ['concert', 'gig', 'festival', 'multi-night']
const GENRES = ['Pop', 'Rock', 'Indie', 'Electronic', 'Hip-Hop', 'R&B', 'Jazz', 'Classical', 'Metal', 'Folk', 'K-Pop', 'J-Pop', 'World', 'Punk', 'Shoegaze', 'Alternative', 'Other']

const INPUT = {
  width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
  borderRadius: 8, padding: '10px 14px', color: 'var(--text)',
  fontFamily: 'DM Sans, sans-serif', fontSize: 14, outline: 'none',
  transition: 'border-color .15s',
} as const

const LABEL = {
  fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 10,
  textTransform: 'uppercase' as const, letterSpacing: '.08em',
  color: 'var(--muted)', display: 'block', marginBottom: 6,
} as const

export default function SubmitPage() {
  const { user } = useSession()
  const [step, setStep] = useState<'show' | 'account' | 'done'>('show')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    artist: '', venue: '', city: '', country: 'Malaysia',
    date: '', date_display: '', type: 'concert', genre: '',
    price: '', ticket_url: '', poster_url: '', description: '',
    promoter: '', lineup: '',
  })

  const [account, setAccount] = useState({
    name: '', email: '', password: '', submitter_note: '',
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit() {
    setLoading(true)
    setError('')
    const supabase = createClient()

    let userId: string | null = user?.id || null
    let submitterName = account.name
    let submitterEmail = account.email

    // If not logged in, create or sign in
    if (!user && account.email && account.password) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: account.email,
        password: account.password,
        options: { data: { full_name: account.name } }
      })
      if (signUpError) {
        const { data: signInData } = await supabase.auth.signInWithPassword({
          email: account.email, password: account.password
        })
        userId = signInData?.user?.id || null
      } else {
        userId = signUpData?.user?.id || null
      }
    }

    // If logged in, use their profile info
    if (user) {
      submitterEmail = user.email || ''
    }

    // Submit the show
    const { error: subError } = await supabase.from('show_submissions').insert({
      ...form,
      submitter_name: submitterName,
      submitter_email: submitterEmail,
      submitter_user_id: userId,
      submitter_note: account.submitter_note,
      status: 'pending',
    })

    setLoading(false)
    if (subError) {
      setError('Something went wrong. Please try again.')
      console.error(subError)
    } else {
      setStep('done')
    }
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* DESKTOP */}
      <div className="hidden lg:block">
        <TopNav />
        <div style={S.container}>
          <Breadcrumb crumbs={[{ label: 'Submit a Show' }]} />
          <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 0 80px' }}>
            {step === 'done' ? <DoneState /> : (
              <>
                <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--text)', marginBottom: 8 }}>Submit a show</h1>
                <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 40, lineHeight: 1.7 }}>Know about a gig, concert, or festival that's not on encore yet? Add it here. We'll review and publish it within 24 hours.</p>

                {step === 'show' && <ShowForm form={form} set={set} onNext={() => user ? handleSubmit() : setStep('account')} isLoggedIn={!!user} />}
                {step === 'account' && <AccountForm account={account} setAccount={setAccount} onBack={() => setStep('show')} onSubmit={handleSubmit} loading={loading} error={error} />}
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>

      {/* MOBILE */}
      <div className="lg:hidden" style={{ paddingBottom: 80 }}>
        <MobileHeader />
        <div style={{ padding: '0 18px' }}>
          <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 22, color: 'var(--text)', marginBottom: 8, paddingTop: 24 }}>Submit a show</h2>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 28, lineHeight: 1.7 }}>Know about a gig or concert not on encore yet? Add it here — we'll review and publish within 24 hours.</p>

          {step === 'done' ? <DoneState /> : (
            <>
              {step === 'show' && <ShowForm form={form} set={set} onNext={() => user ? handleSubmit() : setStep('account')} isLoggedIn={!!user} />}
              {step === 'account' && <AccountForm account={account} setAccount={setAccount} onBack={() => setStep('show')} onSubmit={handleSubmit} loading={loading} error={error} />}
            </>
          )}
        </div>
        <MobileFooter />
        <BottomNav />
      </div>
    </div>
  )
}

function ShowForm({ form, set, onNext, isLoggedIn }: { form: any, set: any, onNext: () => void, isLoggedIn: boolean }) {
  const canProceed = form.artist && form.venue && form.city

  const fieldStyle = { marginBottom: 20 }

  return (
    <div>
      {/* Step indicator — only show steps if not logged in */}
      {!isLoggedIn && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--bg)' }}>1</div>
          <span style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>Show details</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--muted)' }}>2</div>
          <span style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--muted)' }}>Your account</span>
        </div>
      )}
      {isLoggedIn && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>✓</span>
          <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>Submitting as <strong style={{ color: 'var(--text)' }}>you</strong> — your account is already linked to this submission.</p>
        </div>
      )}

      <div style={fieldStyle}>
        <label style={LABEL}>Artist / Show name *</label>
        <input style={INPUT} value={form.artist} onChange={e => set('artist', e.target.value)} placeholder="Artist or event name" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div>
          <label style={LABEL}>Venue *</label>
          <input style={INPUT} value={form.venue} onChange={e => set('venue', e.target.value)} placeholder="Venue name" />
        </div>
        <div>
          <label style={LABEL}>City *</label>
          <input style={INPUT} value={form.city} onChange={e => set('city', e.target.value)} placeholder="City" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div>
          <label style={LABEL}>Country</label>
          <select style={INPUT} value={form.country} onChange={e => set('country', e.target.value)}>
            {COUNTRIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={LABEL}>Type</label>
          <select style={INPUT} value={form.type} onChange={e => set('type', e.target.value)}>
            {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div>
          <label style={LABEL}>Date</label>
          <input style={INPUT} type="date" value={form.date} onChange={e => {
            const d = new Date(e.target.value)
            const display = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
            set('date', e.target.value)
            set('date_display', display)
          }} />
        </div>
        <div>
          <label style={LABEL}>Genre</label>
          <select style={INPUT} value={form.genre} onChange={e => set('genre', e.target.value)}>
            <option value="">— Select —</option>
            {GENRES.map(g => <option key={g}>{g}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div>
          <label style={LABEL}>Ticket price</label>
          <input style={INPUT} value={form.price} onChange={e => set('price', e.target.value)} placeholder="Ticket price" />
        </div>
        <div>
          <label style={LABEL}>Promoter</label>
          <input style={INPUT} value={form.promoter} onChange={e => set('promoter', e.target.value)} placeholder="Promoter or organiser" />
        </div>
      </div>

      <div style={fieldStyle}>
        <label style={LABEL}>Ticket URL</label>
        <input style={INPUT} value={form.ticket_url} onChange={e => set('ticket_url', e.target.value)} placeholder="https://..." />
      </div>

      <div style={fieldStyle}>
        <label style={LABEL}>Poster image URL</label>
        <input style={INPUT} value={form.poster_url} onChange={e => set('poster_url', e.target.value)} placeholder="https://..." />
      </div>

      <div style={fieldStyle}>
        <label style={LABEL}>Supporting acts / Lineup</label>
        <input style={INPUT} value={form.lineup} onChange={e => set('lineup', e.target.value)} placeholder="Supporting acts, lineup" />
      </div>

      <div style={fieldStyle}>
        <label style={LABEL}>Description</label>
        <textarea style={{ ...INPUT, resize: 'vertical' as const }} rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Tell fans about the show..." />
      </div>

      <button
        onClick={onNext}
        disabled={!canProceed}
        style={{ width: '100%', padding: '13px', background: canProceed ? 'var(--accent)' : 'var(--surface2)', color: canProceed ? 'var(--bg)' : 'var(--muted)', border: 'none', borderRadius: 10, fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, cursor: canProceed ? 'pointer' : 'not-allowed', transition: 'all .15s' }}
      >
        {isLoggedIn ? 'Submit show →' : 'Next — Your account →'}
      </button>
    </div>
  )
}

function AccountForm({ account, setAccount, onBack, onSubmit, loading, error }: any) {
  function set(field: string, value: string) {
    setAccount((a: any) => ({ ...a, [field]: value }))
  }

  const fieldStyle = { marginBottom: 20 }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--muted)' }}>1</div>
        <span style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--muted)' }}>Show details</span>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--bg)' }}>2</div>
        <span style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>Your account</span>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', marginBottom: 28 }}>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>Create a free encore account to track your submission and write reviews. Already have one? Enter the same email and password to sign in.</p>
      </div>

      <div style={fieldStyle}>
        <label style={LABEL}>Your name</label>
        <input style={INPUT} value={account.name} onChange={e => set('name', e.target.value)} placeholder="Your name" />
      </div>

      <div style={fieldStyle}>
        <label style={LABEL}>Email *</label>
        <input style={INPUT} type="email" value={account.email} onChange={e => set('email', e.target.value)} placeholder="you@email.com" />
      </div>

      <div style={fieldStyle}>
        <label style={LABEL}>Password *</label>
        <input style={INPUT} type="password" value={account.password} onChange={e => set('password', e.target.value)} placeholder="Min. 6 characters" />
      </div>

      <div style={fieldStyle}>
        <label style={LABEL}>Anything else we should know?</label>
        <textarea style={{ ...INPUT, resize: 'vertical' as const }} rows={2} value={account.submitter_note} onChange={e => set('submitter_note', e.target.value)} placeholder="Source link, social media, notes for the team..." />
      </div>

      {error && <p style={{ fontSize: 13, color: '#f87171', marginBottom: 16 }}>{error}</p>}

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onBack} style={{ padding: '13px 20px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--muted)', cursor: 'pointer' }}>
          ← Back
        </button>
        <button
          onClick={onSubmit}
          disabled={loading || !account.email || !account.password}
          style={{ flex: 1, padding: '13px', background: (!loading && account.email && account.password) ? 'var(--accent)' : 'var(--surface2)', color: (!loading && account.email && account.password) ? 'var(--bg)' : 'var(--muted)', border: 'none', borderRadius: 10, fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all .15s' }}
        >
          {loading ? 'Submitting…' : 'Submit show →'}
        </button>
      </div>

      <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center' as const, marginTop: 16, lineHeight: 1.6 }}>
        By submitting you agree to encore's{' '}
        <Link href="/legal/terms" style={{ color: 'var(--accent)' }}>Terms of Service</Link>.
        Submissions are reviewed before publishing.
      </p>
    </div>
  )
}

function DoneState() {
  return (
    <div style={{ textAlign: 'center' as const, padding: '48px 0' }}>
      <div style={{ fontSize: 48, marginBottom: 20 }}>🎉</div>
      <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 22, color: 'var(--text)', marginBottom: 12 }}>Show submitted!</h2>
      <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 32, lineHeight: 1.7, maxWidth: 400, margin: '0 auto 32px' }}>
        We'll review and publish your submission within 24 hours. Check your email for confirmation.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Link href="/events" style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--bg)', background: 'var(--accent)', textDecoration: 'none', padding: '12px 24px', borderRadius: 10 }}>Browse upcoming shows</Link>
        <Link href="/submit" style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--muted)', background: 'var(--surface2)', border: '1px solid var(--border)', textDecoration: 'none', padding: '12px 24px', borderRadius: 10 }}>Submit another</Link>
      </div>
    </div>
  )
}
