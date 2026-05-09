import Link from 'next/link'
import { Logo } from '@/components'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', textAlign: 'center' }}>
      <Logo size={20} />
      <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 96, color: 'rgba(var(--accent-rgb),0.12)', lineHeight: 1, margin: '32px 0 0' }}>404</p>
      <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 24, color: 'var(--text)', margin: '16px 0 12px' }}>Page not found</h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--muted)', marginBottom: 40, maxWidth: 320, lineHeight: 1.6 }}>This page doesn't exist or has moved.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 280 }}>
        <Link href="/reviews" style={{ background: 'var(--accent)', color: 'var(--bg)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 15, padding: '14px 0', borderRadius: 10, textDecoration: 'none' }}>Go to Reviews</Link>
        <Link href="/events" style={{ background: 'transparent', color: 'var(--text)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 15, padding: '14px 0', borderRadius: 10, textDecoration: 'none', border: '1px solid var(--border)' }}>Browse Shows</Link>
      </div>
    </div>
  )
}
