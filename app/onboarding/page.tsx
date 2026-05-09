'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components'

const MARKETS = [{ code: 'MY', label: 'Malaysia', flag: '🇲🇾' }, { code: 'SG', label: 'Singapore', flag: '🇸🇬' }, { code: 'TH', label: 'Thailand', flag: '🇹🇭' }, { code: 'ID', label: 'Indonesia', flag: '🇮🇩' }]
const GENRES = ['K-pop', 'Pop', 'Rock', 'Indie', 'R&B', 'Electronic', 'Festival', 'Hip-hop']

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [markets, setMarkets] = useState<string[]>([])
  const [genres, setGenres] = useState<string[]>([])

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px' }}>
      <div style={{ marginBottom: 32 }}><Logo size={20} /></div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 48 }}>
        {[1,2,3].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i <= step ? 'var(--accent)' : 'var(--border)', transition: 'background 0.2s' }} />)}
      </div>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {step === 1 && (
          <div>
            <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 24, color: 'var(--text)', textAlign: 'center' as const, marginBottom: 8 }}>Where do you catch shows?</h1>
            <p style={{ fontSize: 14, color: 'var(--muted)', textAlign: 'center' as const, marginBottom: 32 }}>Select all that apply</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
              {MARKETS.map(m => {
                const active = markets.includes(m.code)
                return (
                  <button key={m.code} onClick={() => toggle(markets, setMarkets, m.code)} style={{ background: active ? 'rgba(var(--accent-rgb),0.08)' : 'var(--surface2)', border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 12, padding: '20px 16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'all 0.15s' }}>
                    <span style={{ fontSize: 28 }}>{m.flag}</span>
                    <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 14, color: active ? 'var(--accent)' : 'var(--text)' }}>{m.label}</p>
                  </button>
                )
              })}
            </div>
            <button onClick={() => setStep(2)} style={{ width: '100%', background: 'var(--accent)', color: 'var(--bg)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 15, padding: '14px 0', borderRadius: 10, border: 'none', cursor: 'pointer' }}>Next →</button>
          </div>
        )}
        {step === 2 && (
          <div>
            <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 24, color: 'var(--text)', textAlign: 'center' as const, marginBottom: 8 }}>What are you into?</h1>
            <p style={{ fontSize: 14, color: 'var(--muted)', textAlign: 'center' as const, marginBottom: 32 }}>Pick your genres</p>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 10, justifyContent: 'center', marginBottom: 32 }}>
              {GENRES.map(g => {
                const active = genres.includes(g)
                return <button key={g} onClick={() => toggle(genres, setGenres, g)} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 500, padding: '10px 20px', borderRadius: 100, cursor: 'pointer', border: '1px solid var(--border)', background: active ? 'var(--accent)' : 'var(--surface2)', color: active ? 'var(--bg)' : 'var(--muted)', transition: 'all 0.15s' }}>{g}</button>
              })}
            </div>
            <button onClick={() => setStep(3)} style={{ width: '100%', background: 'var(--accent)', color: 'var(--bg)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 15, padding: '14px 0', borderRadius: 10, border: 'none', cursor: 'pointer', marginBottom: 12 }}>Next →</button>
            <button onClick={() => setStep(1)} style={{ width: '100%', background: 'none', border: 'none', color: 'var(--muted)', fontFamily: 'DM Sans, sans-serif', fontSize: 14, cursor: 'pointer' }}>← Back</button>
          </div>
        )}
        {step === 3 && (
          <div style={{ textAlign: 'center' as const }}>
            <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 24, color: 'var(--text)', marginBottom: 8 }}>You're all set</h1>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 32 }}>Here's what we'll show you</p>
            {markets.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 8 }}>Markets</p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' as const }}>
                  {markets.map(m => <span key={m} style={{ fontSize: 13, color: 'var(--bg)', background: 'var(--accent)', padding: '4px 14px', borderRadius: 100, fontWeight: 600 }}>{m}</span>)}
                </div>
              </div>
            )}
            {genres.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <p style={{ fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 8 }}>Genres</p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' as const }}>
                  {genres.map(g => <span key={g} style={{ fontSize: 13, color: 'var(--muted)', background: 'var(--surface2)', border: '1px solid var(--border)', padding: '4px 14px', borderRadius: 100 }}>{g}</span>)}
                </div>
              </div>
            )}
            <Link href="/reviews" style={{ display: 'block', background: 'var(--accent)', color: 'var(--bg)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 15, padding: '14px 0', borderRadius: 10, textDecoration: 'none', marginBottom: 12 }}>Let's go →</Link>
            <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontFamily: 'DM Sans, sans-serif', fontSize: 14, cursor: 'pointer' }}>← Back</button>
          </div>
        )}
      </div>
    </div>
  )
}
