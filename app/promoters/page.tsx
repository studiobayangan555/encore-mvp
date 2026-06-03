'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TopNav, BottomNav, MobileHeader, MobileFooter, Footer, Breadcrumb, S } from '@/components'
import { createClient } from '@/lib/supabase'

const INPUT = {
  width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
  borderRadius: 8, padding: '10px 14px', color: 'var(--text)',
  fontFamily: 'DM Sans, sans-serif', fontSize: 14, outline: 'none',
} as const

const LABEL = {
  fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 10,
  textTransform: 'uppercase' as const, letterSpacing: '.08em',
  color: 'var(--muted)', display: 'block', marginBottom: 6,
} as const

export default function PromotersPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', website: '', consent: false })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!form.name || !form.email || !form.company) return
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.from('promoter_registrations').insert({
      name: form.name, email: form.email,
      company: form.company, website: form.website,
    })
    setLoading(false)
    if (err) { setError('Something went wrong. Please try again.'); return }
    setSubmitted(true)
  }

  const features = [
    { icon: '🌏', title: 'Reach fans across SEA', desc: 'Malaysia, Singapore, Thailand, Indonesia, Philippines' },
    { icon: '★', title: 'Build your reputation', desc: 'Fan reviews create lasting trust in your events' },
    { icon: '📊', title: 'Audience insights', desc: "See who's going, what fans are saying, how shows perform" },
    { icon: '🚀', title: 'Early access', desc: 'First access to promoter tools when they launch' },
  ]

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* DESKTOP */}
      <div className="hidden lg:block">
        <TopNav />
        <div style={S.container}>
          <Breadcrumb crumbs={[{ label: 'For Promoters' }]} />
          <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 0 80px' }}>

            <span style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase' as const, color: 'var(--accent)', display: 'block', marginBottom: 16 }}>For Promoters</span>
            <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 36, color: 'var(--text)', lineHeight: 1.1, marginBottom: 16 }}>Join encore early.</h1>
            <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 48, maxWidth: 540 }}>
              encore is building Southeast Asia's most trusted live music platform. Register now and be the first promoter on board when our tools launch.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 48 }}>
              {features.map(f => (
                <div key={f.title} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px' }}>
                  <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
                  <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--text)', marginBottom: 6 }}>{f.title}</p>
                  <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '36px 40px' }}>
              {submitted ? (
                <div style={{ textAlign: 'center' as const, padding: '24px 0' }}>
                  <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
                  <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--text)', marginBottom: 10 }}>You're on the list.</h2>
                  <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>We'll reach out when promoter tools go live. One email, no spam.</p>
                </div>
              ) : (
                <>
                  <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--text)', marginBottom: 6 }}>Register interest</h2>
                  <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 28, lineHeight: 1.6 }}>We'll reach out when promoter tools go live. No spam — just a single update when we're ready.</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={LABEL}>Full name *</label>
                      <input style={INPUT} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
                    </div>
                    <div>
                      <label style={LABEL}>Email *</label>
                      <input style={INPUT} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email address" />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                    <div>
                      <label style={LABEL}>Company name *</label>
                      <input style={INPUT} value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Company name" />
                    </div>
                    <div>
                      <label style={LABEL}>Company website</label>
                      <input style={INPUT} value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://..." />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 24 }}>
                    <input type="checkbox" id="consent" checked={form.consent} onChange={e => setForm(f => ({ ...f, consent: e.target.checked }))} style={{ marginTop: 2, accentColor: 'var(--accent)', flexShrink: 0 }} />
                    <label htmlFor="consent" style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, cursor: 'pointer' }}>Receive updates about the encore promoter programme, feature launches, and partnership opportunities.</label>
                  </div>

                  {error && <p style={{ fontSize: 13, color: '#f87171', marginBottom: 16 }}>{error}</p>}

                  <button
                    onClick={handleSubmit}
                    disabled={loading || !form.name || !form.email || !form.company}
                    style={{ width: '100%', padding: '13px', background: (form.name && form.email && form.company) ? 'var(--accent)' : 'var(--surface2)', color: (form.name && form.email && form.company) ? 'var(--bg)' : 'var(--muted)', border: 'none', borderRadius: 10, fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all .15s' }}
                  >
                    {loading ? 'Registering…' : 'Register Interest →'}
                  </button>

                  <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center' as const, marginTop: 16 }}>
                    Prefer to reach out directly?{' '}
                    <a href="mailto:admin@studiobayangan.com" style={{ color: 'var(--accent)' }}>admin@studiobayangan.com</a>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>

      {/* MOBILE */}
      <div className="lg:hidden" style={{ paddingBottom: 80 }}>
        <MobileHeader />
        <div style={{ padding: '0 18px' }}>
          <span style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase' as const, color: 'var(--accent)', display: 'block', paddingTop: 24, marginBottom: 10 }}>For Promoters</span>
          <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 24, color: 'var(--text)', lineHeight: 1.15, marginBottom: 12 }}>Join encore early.</h2>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 28, lineHeight: 1.7 }}>Register now and be the first promoter on board when our tools launch.</p>

          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10, marginBottom: 32 }}>
            {features.map(f => (
              <div key={f.title} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--text)', marginBottom: 3 }}>{f.title}</p>
                  <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center' as const, padding: '32px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
              <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--text)', marginBottom: 8 }}>You're on the list.</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>We'll reach out when promoter tools go live. One email, no spam.</p>
            </div>
          ) : (
            <>
              <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 20 }}>Register interest</h3>
              <div style={{ marginBottom: 16 }}>
                <label style={LABEL}>Full name *</label>
                <input style={INPUT} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={LABEL}>Email *</label>
                <input style={INPUT} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email address" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={LABEL}>Company name *</label>
                <input style={INPUT} value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Company name" />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={LABEL}>Company website</label>
                <input style={INPUT} value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://..." />
              </div>
              {error && <p style={{ fontSize: 13, color: '#f87171', marginBottom: 12 }}>{error}</p>}
              <button
                onClick={handleSubmit}
                disabled={loading || !form.name || !form.email || !form.company}
                style={{ width: '100%', padding: '13px', background: (form.name && form.email && form.company) ? 'var(--accent)' : 'var(--surface2)', color: (form.name && form.email && form.company) ? 'var(--bg)' : 'var(--muted)', border: 'none', borderRadius: 10, fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer', marginBottom: 16 }}
              >
                {loading ? 'Registering…' : 'Register Interest →'}
              </button>
              <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center' as const }}>
                Or reach out directly: <a href="mailto:admin@studiobayangan.com" style={{ color: 'var(--accent)' }}>admin@studiobayangan.com</a>
              </p>
            </>
          )}
        </div>
        <MobileFooter />
        <BottomNav />
      </div>
    </div>
  )
}
