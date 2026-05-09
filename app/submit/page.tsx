'use client'

import { useState } from 'react'
import { TopNav, BottomNav, Footer, Breadcrumb, S, CheckIcon } from '@/components'
import { createClient } from '@/lib/supabase'

export default function SubmitPage() {
  const [form, setForm] = useState({
    fullName: '', email: '', company: '', url: '', updates: true,
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function update(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.fullName.trim()) e.fullName = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.company.trim()) e.company = 'Required'
    return e
  }

  async function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('promoter_registrations').insert({
      full_name: form.fullName,
      email: form.email,
      company: form.company,
      url: form.url || null,
      updates: form.updates,
    })
    setLoading(false)
    if (error) {
      if (error.code === '23505') {
        setErrors({ email: 'This email is already registered.' })
      } else {
        setErrors({ email: 'Something went wrong — please try again.' })
      }
      return
    }
    setSubmitted(true)
  }

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%',
    background: 'var(--surface2)',
    border: `1px solid ${errors[field] ? 'var(--accent-red)' : 'var(--border)'}`,
    borderRadius: 10,
    padding: '13px 14px',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 15,
    color: 'var(--text)',
    outline: 'none',
  })

  const fieldLabel = (text: string, required = false) => (
    <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 8 }}>
      {text}{required && <span style={{ color: 'var(--accent-red)', marginLeft: 4 }}>*</span>}
    </p>
  )

  if (submitted) {
    return (
      <>
        <TopNav />
        <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center' as const, padding: '0 32px' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(var(--accent-rgb),0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, color: 'var(--accent)' }}>
            <CheckIcon size={32} />
          </div>
          <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 24, color: 'var(--text)', marginBottom: 10 }}>You're on the list.</h1>
          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 400, marginBottom: 32 }}>
            We'll be in touch when encore's promoter tools are ready to launch. In the meantime, feel free to browse the platform.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const, justifyContent: 'center' }}>
            <a href="/events" style={{ background: 'var(--accent)', color: 'var(--bg)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, padding: '12px 24px', borderRadius: 10, textDecoration: 'none' }}>Browse Shows</a>
            <a href="/reviews" style={{ background: 'var(--surface2)', color: 'var(--text)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, padding: '12px 24px', borderRadius: 10, textDecoration: 'none', border: '1px solid var(--border)' }}>Read Reviews</a>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const formContent = (
    <div>
      {/* Value props */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 40 }}>
        {[
          { icon: '🌏', title: 'Reach fans across SEA', sub: 'Malaysia, Singapore, Thailand, Indonesia, Philippines' },
          { icon: '★', title: 'Build your reputation', sub: 'Fan reviews create lasting trust in your events' },
          { icon: '🚀', title: 'Early access', sub: 'Registrants get first access to promoter tools at launch' },
        ].map(v => (
          <div key={v.title} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '22px 20px' }}>
            <p style={{ fontSize: 28, marginBottom: 10 }}>{v.icon}</p>
            <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 6, lineHeight: 1.3 }}>{v.title}</p>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{v.sub}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28, marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--text)', marginBottom: 6 }}>Register interest</h2>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 28, lineHeight: 1.6 }}>We'll reach out when promoter tools go live. No spam — just a single update when we're ready.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            {fieldLabel('Full name', true)}
            <input value={form.fullName} onChange={e => update('fullName', e.target.value)} placeholder="Your full name" style={inputStyle('fullName')} />
            {errors.fullName && <p style={{ fontSize: 12, color: 'var(--accent-red)', marginTop: 4 }}>{errors.fullName}</p>}
          </div>
          <div>
            {fieldLabel('Email', true)}
            <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@company.com" style={inputStyle('email')} />
            {errors.email && <p style={{ fontSize: 12, color: 'var(--accent-red)', marginTop: 4 }}>{errors.email}</p>}
          </div>
          <div>
            {fieldLabel('Company name', true)}
            <input value={form.company} onChange={e => update('company', e.target.value)} placeholder="e.g. Live Nation Malaysia" style={inputStyle('company')} />
            {errors.company && <p style={{ fontSize: 12, color: 'var(--accent-red)', marginTop: 4 }}>{errors.company}</p>}
          </div>
          <div>
            {fieldLabel('Company website')}
            <input type="url" value={form.url} onChange={e => update('url', e.target.value)} placeholder="https://yourcompany.com" style={inputStyle('url')} />
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', marginBottom: 28 }}>
          <div onClick={() => update('updates', !form.updates)} style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${form.updates ? 'var(--accent)' : 'var(--border)'}`, background: form.updates ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, cursor: 'pointer', transition: 'all 0.15s' }}>
            {form.updates && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={`var(--bg)`} strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
          </div>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>Receive updates about the encore promoter programme, feature launches, and partnership opportunities.</p>
        </label>

        <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', background: 'var(--accent)', color: 'var(--bg)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 15, padding: '15px 0', borderRadius: 10, border: 'none', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Submitting…' : 'Register Interest →'}
        </button>
      </div>

      {/* Email fallback */}
      <div style={{ textAlign: 'center' as const, padding: '20px 24px', border: '1px dashed var(--border)', borderRadius: 'var(--radius)' }}>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 8 }}>Prefer to reach out directly?</p>
        <a href="mailto:promoters@encore.app" style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--accent)', textDecoration: 'none' }}>promoters@encore.app</a>
      </div>
    </div>
  )

  return (
    <>
      <div className="hidden lg:block">
        <TopNav />
        <div style={{ ...S.containerNarrow, paddingTop: 0 }}>
          <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'For Promoters' }]} />
          <div style={S.pageHeader}>
            <span style={S.pageLabel}>For Promoters</span>
            <h1 style={S.pageTitle}>Join encore early.</h1>
            <p style={S.pageDesc}>encore is building Southeast Asia's most trusted live music platform. Register now and be the first promoter on board when our tools launch.</p>
          </div>
          {formContent}
        </div>
        <Footer />
      </div>

      {/* MOBILE */}
      <div className="lg:hidden" style={{ paddingBottom: 80 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px 0' }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--accent)' }}>encore</span>
        </div>
        <div style={{ padding: '0 18px' }}>
          <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'For Promoters' }]} />
          <div style={{ padding: '24px 0 28px', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
            <span style={S.pageLabel}>For Promoters</span>
            <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 26, color: 'var(--text)', lineHeight: 1.15, marginBottom: 10 }}>Join encore early.</h1>
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65 }}>Register now and be the first promoter on board when our tools launch.</p>
          </div>
          {/* Mobile form — single column */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 16, color: 'var(--text)', marginBottom: 20 }}>Register interest</h2>
            {[
              { field: 'fullName', label: 'Full name', placeholder: 'Your full name', required: true },
              { field: 'email', label: 'Email', placeholder: 'you@company.com', required: true, type: 'email' },
              { field: 'company', label: 'Company name', placeholder: 'e.g. Live Nation Malaysia', required: true },
              { field: 'url', label: 'Company website', placeholder: 'https://yourcompany.com', type: 'url' },
            ].map(f => (
              <div key={f.field} style={{ marginBottom: 14 }}>
                {fieldLabel(f.label, f.required)}
                <input
                  type={f.type || 'text'}
                  value={(form as any)[f.field]}
                  onChange={e => update(f.field, e.target.value)}
                  placeholder={f.placeholder}
                  style={inputStyle(f.field)}
                />
                {errors[f.field] && <p style={{ fontSize: 12, color: 'var(--accent-red)', marginTop: 4 }}>{errors[f.field]}</p>}
              </div>
            ))}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', marginBottom: 24 }}>
              <div onClick={() => update('updates', !form.updates)} style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${form.updates ? 'var(--accent)' : 'var(--border)'}`, background: form.updates ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, cursor: 'pointer' }}>
                {form.updates && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--bg)" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>Receive updates about the encore promoter programme.</p>
            </label>
            <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', background: 'var(--accent)', color: 'var(--bg)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 15, padding: '14px 0', borderRadius: 10, border: 'none', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Submitting…' : 'Register Interest →'}
            </button>
          </div>
          <div style={{ textAlign: 'center' as const, padding: '16px 24px', border: '1px dashed var(--border)', borderRadius: 'var(--radius)', marginBottom: 32 }}>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>Or reach out directly</p>
            <a href="mailto:promoters@encore.app" style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--accent)', textDecoration: 'none' }}>promoters@encore.app</a>
          </div>
        </div>
        <BottomNav />
      </div>
    </>
  )
}
