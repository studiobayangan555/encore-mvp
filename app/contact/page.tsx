'use client'
import { useState } from 'react'
import { TopNav, Footer, Breadcrumb, S } from '@/components'
export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const inputStyle = { width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '13px 14px', fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--text)', outline: 'none' }
  return (
    <>
      <TopNav />
      <div style={S.containerNarrow}>
        <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />
        <div style={S.pageHeader}>
          <span style={S.pageLabel}>Get in touch</span>
          <h1 style={S.pageTitle}>Contact</h1>
          <p style={S.pageDesc}>Questions, press enquiries, or partnership requests.</p>
        </div>
        {sent ? (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 32, textAlign: 'center' as const }}>
            <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--text)', marginBottom: 8 }}>Message sent</p>
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>We'll be in touch within 2 business days.</p>
          </div>
        ) : (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28 }}>
            {['Name', 'Email', 'Subject'].map(f => (
              <div key={f} style={{ marginBottom: 14 }}>
                <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 8 }}>{f}</p>
                <input type={f === 'Email' ? 'email' : 'text'} placeholder={f} style={inputStyle} />
              </div>
            ))}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 8 }}>Message</p>
              <textarea rows={5} placeholder="Your message…" style={{ ...inputStyle, resize: 'vertical' as const }} />
            </div>
            <button onClick={() => setSent(true)} style={{ width: '100%', background: 'var(--accent)', color: 'var(--bg)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 14, padding: '14px 0', borderRadius: 10, border: 'none', cursor: 'pointer' }}>Send Message</button>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
