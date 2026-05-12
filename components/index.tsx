'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useSession } from '@/components/session-provider'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

// ─── THEME ────────────────────────────────────────────────────
export function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  useEffect(() => {
    const saved = localStorage.getItem('encore-theme') as 'dark' | 'light' | null
    const t = saved || 'dark'
    setTheme(t)
    document.documentElement.setAttribute('data-theme', t)
  }, [])
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('encore-theme', next)
  }
  return { theme, toggle }
}

// ─── LOGO ─────────────────────────────────────────────────────
export function Logo({ size = 20 }: { size?: number }) {
  return (
    <Link href="/reviews" style={{ textDecoration: 'none' }}>
      <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: size, color: 'var(--accent)', letterSpacing: 0, lineHeight: 1 }}>encore</span>
    </Link>
  )
}



// ─── SHOW POSTER ─────────────────────────────────────────────
// Renders real poster image if available, falls back to gradient
export function ShowPoster({
  posterUrl, gradient = 'linear-gradient(135deg,#1a0033,#4400aa)',
  style = {}, children
}: {
  posterUrl?: string | null
  gradient?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}) {
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: posterUrl ? 'transparent' : gradient,
      ...style
    }}>
      {posterUrl && (
        <img
          src={posterUrl}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
      {!posterUrl && (
        // Colour tint overlay on gradient (matches the brand treatment)
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(123,97,255,0.4)', mixBlendMode: 'multiply' }} />
      )}
      {posterUrl && (
        // Subtle tint over real images for brand consistency
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,10,15,0.15)' }} />
      )}
      {children && <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>}
    </div>
  )
}

// ─── BLOG IMAGE ───────────────────────────────────────────────
export function BlogImage({
  imageUrl, gradient = 'linear-gradient(135deg,#1a0033,#4400aa)',
  style = {}, children
}: {
  imageUrl?: string | null
  gradient?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}) {
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: imageUrl ? 'transparent' : gradient,
      ...style
    }}>
      {imageUrl && (
        <img
          src={imageUrl}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
      {imageUrl && <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,10,15,0.2)' }} />}
      {children && <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>}
    </div>
  )
}

// ─── SEARCH OVERLAY ───────────────────────────────────────────
export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,10,15,0.85)', backdropFilter: 'blur(8px)' }} onClick={onClose} />
      <div style={{ position: 'relative', zIndex: 1, padding: '24px 20px', maxWidth: 720, margin: '60px auto 0', width: '100%' }}>
        <form onSubmit={e => { e.preventDefault(); const q = (e.currentTarget.querySelector('input') as HTMLInputElement).value.trim(); if (q) { window.location.href = `/search?q=${encodeURIComponent(q)}`; onClose(); } }} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--surface)', border: '2px solid var(--accent)', borderRadius: 12, padding: '16px 20px', boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--accent)', flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input autoFocus placeholder="Search artists, shows, venues, reviews…" style={{ flex: 1, background: 'none', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--text)', outline: 'none' }} />
          <button type="submit" style={{ background: 'var(--accent)', border: 'none', borderRadius: 6, cursor: 'pointer', color: 'var(--bg)', fontSize: 12, fontFamily: 'Unbounded, sans-serif', fontWeight: 700, padding: '5px 12px' }}>Go</button>
          <button type="button" onClick={onClose} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', color: 'var(--muted)', fontSize: 12, fontFamily: 'DM Sans, sans-serif', padding: '3px 8px' }}>ESC</button>
        </form>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 10, paddingLeft: 4 }}>Search reviews, upcoming shows, blog posts, and venues across Southeast Asia</p>
      </div>
    </div>
  )
}

// ─── PAGE SEARCH BAR ──────────────────────────────────────────
export function PageSearchBar({ placeholder }: { placeholder: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 20px', marginBottom: 32 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ color: 'var(--muted)', flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input placeholder={placeholder} style={{ flex: 1, background: 'none', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--text)', outline: 'none' }} />
    </div>
  )
}

// ─── PHOTO UPLOAD ─────────────────────────────────────────────
export function PhotoUpload({ photos, setPhotos }: { photos: string[]; setPhotos: (p: string[]) => void }) {
  const MAX = 10
  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    const toUpload = files.slice(0, MAX - photos.length)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const uploaded: string[] = []
    for (const file of toUpload) {
      const ext = file.name.split('.').pop()
      const path = `${user?.id || 'anon'}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('review-photos').upload(path, file)
      if (!error) {
        const { data } = supabase.storage.from('review-photos').getPublicUrl(path)
        uploaded.push(data.publicUrl)
      } else {
        // Fallback to object URL for preview if upload fails
        uploaded.push(URL.createObjectURL(file))
      }
    }
    setPhotos([...photos, ...uploaded])
  }
  function remove(idx: number) { setPhotos(photos.filter((_, i) => i !== idx)) }
  return (
    <div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const, marginBottom: 12 }}>
        {photos.map((url, i) => (
          <div key={i} style={{ position: 'relative', width: 80, height: 80 }}>
            <img src={url} alt="" style={{ width: 80, height: 80, objectFit: 'cover' as const, borderRadius: 8, border: '1px solid var(--border)' }} />
            <button onClick={() => remove(i)} style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: 'var(--accent-red)', border: 'none', cursor: 'pointer', color: 'white', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>
        ))}
        {photos.length < MAX && (
          <label style={{ width: 80, height: 80, borderRadius: 8, border: '2px dashed var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 4 }}>
            <span style={{ fontSize: 22, color: 'var(--muted)' }}>+</span>
            <span style={{ fontSize: 10, color: 'var(--muted)', textAlign: 'center' as const }}>Add photo</span>
            <input type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: 'none' }} />
          </label>
        )}
      </div>
      <p style={{ fontSize: 12, color: 'var(--muted)' }}>{photos.length}/{MAX} photos · JPEG or PNG · Max 10MB each</p>
    </div>
  )
}

// ─── TOP NAV ──────────────────────────────────────────────────
export function TopNav() {
  const pathname = usePathname()
  const { theme, toggle } = useTheme()
  const [searchOpen, setSearchOpen] = useState(false)
  const { user, profileName, loading: authLoading } = useSession()
  const links = [
    { label: 'Reviews', href: '/reviews' },
    { label: 'Upcoming Shows', href: '/events' },
    { label: 'Blog', href: '/blog' },
  ]
  // More precise active check — /events/[id]/review shouldn't highlight Upcoming Shows
  function isActive(href: string) {
    if (href === '/events') return pathname === '/events' || (pathname.startsWith('/events/') && !pathname.includes('/review'))
    return pathname.startsWith(href)
  }
  const isHome = pathname === '/' || pathname === '/reviews'
  const [country, setCountry] = useState('All')
  const [navQuery, setNavQuery] = useState('')

  function handleNavSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = navQuery.trim()
    if (q) window.location.href = `/search?q=${encodeURIComponent(q)}${country !== 'All' ? `&country=${country}` : ''}`
  }

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--nav-bg)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', height: 66, display: 'flex', alignItems: 'center', padding: '0 40px', gap: 16 }}>
      <Logo size={20} />
      <div style={{ display: 'flex', gap: 2, marginLeft: 24 }}>
        {links.map(l => (
          <Link key={l.href} href={l.href} style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 14, color: isActive(l.href) ? 'var(--text)' : 'var(--muted)', textDecoration: 'none', padding: '7px 14px', borderRadius: 8, background: isActive(l.href) ? 'var(--surface2)' : 'transparent', transition: 'all 0.15s', whiteSpace: 'nowrap' as const }}>{l.label}</Link>
        ))}
      </div>

      {/* Option A search — shown on all pages except home */}
      {!isHome && (
        <form onSubmit={handleNavSearch} style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 10, overflow: 'hidden', height: 42, transition: 'border-color .2s', marginLeft: 8 }}
          onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'}
          onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
        >
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', borderRight: '1px solid var(--border)', height: '100%' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--muted)', flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={navQuery} onChange={e => setNavQuery(e.target.value)} placeholder="Artist, venue, or show…" style={{ flex: 1, background: 'none', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--text)', outline: 'none', minWidth: 0 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px', borderRight: '1px solid var(--border)', height: '100%', minWidth: 120 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--muted)', flexShrink: 0, marginRight: 6 }}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <select value={country} onChange={e => setCountry(e.target.value)} style={{ background: 'none', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--text)', outline: 'none', cursor: 'pointer', width: '100%' }}>
              <option value="All">All countries</option>
              <option value="MY">Malaysia</option>
              <option value="SG">Singapore</option>
              <option value="TH">Thailand</option>
              <option value="ID">Indonesia</option>
              <option value="PH">Philippines</option>
            </select>
          </div>
          <button type="submit" style={{ width: 42, height: '100%', background: 'var(--accent)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme === 'dark' ? '#080A0F' : 'white'} strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
        </form>
      )}
      {isHome && <div style={{ flex: 1 }} />}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

        <button onClick={toggle} style={{ width: 44, height: 24, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 100, cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--accent)', position: 'absolute', top: 2, left: theme === 'dark' ? 2 : 22, transition: 'left 0.25s', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>{theme === 'dark' ? '☀️' : '🌙'}</div>
        </button>
        {authLoading ? (
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface2)', border: '1px solid var(--border)' }} />
        ) : user ? (
          <Link href="/profile" style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#1a0033,#4400aa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 11, color: 'white', textDecoration: 'none' }}>
            {(profileName || user.user_metadata?.full_name || user.email || 'U').slice(0,2).toUpperCase()}
          </Link>
        ) : (
          <Link href="/auth/login" style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--muted)', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 14px', textDecoration: 'none' }}>Log in</Link>
        )}
      </div>
    </nav>
  )
}


// ─── MOBILE SEARCH BUTTON ─────────────────────────────────────
export function MobileSearchButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 100, padding: '7px 14px', cursor: 'pointer', color: 'var(--muted)', fontFamily: 'DM Sans, sans-serif', fontSize: 13 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        Search
      </button>
      <SearchOverlay open={open} onClose={() => setOpen(false)} />
    </>
  )
}



// ─── VOTE / FLAG BAR ──────────────────────────────────────────
export function VoteBar({ targetId, targetType, initialUp = 0, initialDown = 0 }: {
  targetId: string; targetType: 'review' | 'comment'; initialUp?: number; initialDown?: number
}) {
  const [up, setUp] = useState(initialUp)
  const [down, setDown] = useState(initialDown)
  const [vote, setVote] = useState<'up' | 'down' | null>(null)
  const [flagged, setFlagged] = useState(false)
  const [showFlagMsg, setShowFlagMsg] = useState(false)

  async function handleVote(dir: 'up' | 'down') {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { window.location.href = '/auth/login'; return }
    if (vote === dir) {
      // undo
      setVote(null)
      dir === 'up' ? setUp(u => u - 1) : setDown(d => d - 1)
    } else {
      if (vote === 'up') setUp(u => u - 1)
      if (vote === 'down') setDown(d => d - 1)
      setVote(dir)
      dir === 'up' ? setUp(u => u + 1) : setDown(d => d + 1)
    }
  }

  function handleFlag() {
    if (flagged) return
    setFlagged(true)
    setShowFlagMsg(true)
    setTimeout(() => setShowFlagMsg(false), 3000)
  }

  const btnBase: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 5,
    background: 'none', border: '1px solid var(--border)',
    borderRadius: 100, padding: '4px 10px', cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif', fontSize: 12, transition: 'all .15s',
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, position: 'relative' }}>
      <button onClick={() => handleVote('up')} style={{ ...btnBase, color: vote === 'up' ? 'var(--accent)' : 'var(--muted)', borderColor: vote === 'up' ? 'var(--accent)' : 'var(--border)', background: vote === 'up' ? 'rgba(var(--accent-rgb),.08)' : 'none' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill={vote === 'up' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
        {up > 0 && up}
      </button>
      <button onClick={() => handleVote('down')} style={{ ...btnBase, color: vote === 'down' ? 'var(--accent-red)' : 'var(--muted)', borderColor: vote === 'down' ? 'var(--accent-red)' : 'var(--border)', background: vote === 'down' ? 'rgba(255,77,109,.08)' : 'none' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill={vote === 'down' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg>
        {down > 0 && down}
      </button>
      <button onClick={handleFlag} style={{ ...btnBase, marginLeft: 'auto', color: flagged ? 'var(--accent-red)' : 'var(--muted)', borderColor: flagged ? 'var(--accent-red)' : 'var(--border)', background: flagged ? 'rgba(255,77,109,.08)' : 'none' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill={flagged ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
        {flagged ? 'Flagged' : 'Flag'}
      </button>
      {showFlagMsg && (
        <div style={{ position: 'absolute', bottom: 32, right: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' as const, boxShadow: 'var(--shadow)' }}>
          Thanks — our team will review this.
        </div>
      )}
    </div>
  )
}

// ─── MOBILE HEADER ────────────────────────────────────────────
export function MobileHeader() {
  const [searchOpen, setSearchOpen] = useState(false)
  const { user, profileName } = useSession()
  const initials = profileName
    ? profileName.slice(0,2).toUpperCase()
    : user?.email?.slice(0,2).toUpperCase() || 'U'
  return (
    <>
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--nav-bg)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 18px', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <Link href="/reviews" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--accent)', textDecoration: 'none', flexShrink: 0 }}>encore</Link>

        {/* Right side — search icon circle + profile circle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button onClick={() => setSearchOpen(true)} style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--muted)', flexShrink: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <Link href={user ? '/profile' : '/auth/login'} style={{ width: 34, height: 34, borderRadius: '50%', background: user ? 'linear-gradient(135deg,#1a0033,#4400aa)' : 'var(--surface2)', border: user ? 'none' : '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 10, color: 'white', textDecoration: 'none', flexShrink: 0 }}>
            {user ? initials : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--muted)' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            )}
          </Link>
        </div>
      </div>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}


// ─── MOBILE FOOTER ────────────────────────────────────────────
export function MobileFooter() {
  return (
    <div style={{ background: 'var(--surface2)', borderTop: '1px solid var(--border)', padding: '28px 20px 20px', marginTop: 32 }}>
      <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--accent)', display: 'block', marginBottom: 8 }}>encore</span>
      <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 12 }}>Southeast Asia's home for live music reviews.</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, marginBottom: 14 }}>
        {['MY', 'SG', 'TH', 'ID', 'PH'].map(c => <span key={c} style={{ fontSize: 11, color: 'var(--muted)', background: 'var(--surface)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 100 }}>{c}</span>)}
      </div>
      <Link href="/submit" style={{ display: 'inline-block', marginBottom: 20, fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--bg)', background: 'var(--accent)', borderRadius: 8, padding: '9px 16px', textDecoration: 'none' }}>Submit a Show →</Link>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', gap: 16, flexWrap: 'wrap' as const }}>
        {[['About', '/about'], ['Blog', '/blog'], ['Terms', '/legal/terms'], ['Privacy', '/legal/privacy'], ['Cookies', '/legal/cookies']].map(([label, href]) => (
          <Link key={label} href={href} style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'none' }}>{label}</Link>
        ))}
      </div>
      <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 12, opacity: 0.5 }}>© {new Date().getFullYear()} encore</p>
    </div>
  )
}

// ─── BOTTOM NAV ───────────────────────────────────────────────
export function BottomNav() {
  const pathname = usePathname()
  const { theme } = useTheme()
  const items = [
    { label: 'Reviews', href: '/reviews', icon: '★' },
    { label: 'Shows', href: '/events', icon: '🎟' },
    { label: 'Blog', href: '/blog', icon: '📰' },
    { label: 'Profile', href: '/profile', icon: '👤' },
  ]
  return (
    <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 60, background: 'var(--nav-bg)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-around', zIndex: 100, paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {items.slice(0, 2).map(item => (
        <Link key={item.href} href={item.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: pathname.startsWith(item.href) ? 'var(--accent)' : 'var(--muted)', textDecoration: 'none', fontSize: 10, fontWeight: 600, minWidth: 48 }}>
          <span style={{ fontSize: 20 }}>{item.icon}</span>{item.label}
        </Link>
      ))}

      {items.slice(2).map(item => (
        <Link key={item.href} href={item.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: pathname.startsWith(item.href) ? 'var(--accent)' : 'var(--muted)', textDecoration: 'none', fontSize: 10, fontWeight: 600, minWidth: 48 }}>
          <span style={{ fontSize: 20 }}>{item.icon}</span>{item.label}
        </Link>
      ))}
    </nav>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────
export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)', padding: '48px 0 32px', marginTop: 80 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48 }}>
        <div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--accent)', display: 'block', marginBottom: 10 }}>encore</span>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 12, maxWidth: 220 }}>The home of live music in Southeast Asia. Real reviews from real fans.</p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, marginBottom: 16 }}>
            {['MY', 'SG', 'TH', 'ID', 'PH'].map(c => <span key={c} style={{ fontSize: 11, color: 'var(--muted)', background: 'var(--surface2)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 100 }}>{c}</span>)}
          </div>
          <Link href="/submit" style={{ display: 'inline-block', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--bg)', background: 'var(--accent)', borderRadius: 8, padding: '9px 16px', textDecoration: 'none' }}>Submit a Show →</Link>
        </div>
        {[
          { title: 'Platform', links: [{ label: 'Reviews', href: '/reviews' }, { label: 'Upcoming Shows', href: '/events' }, { label: 'Blog', href: '/blog' }, { label: 'Submit a Show', href: '/submit' }] },
          { title: 'Company', links: [{ label: 'About encore', href: '/about' }, { label: 'Contact us', href: '/contact' }, { label: 'For Organisers', href: '/submit' }] },
          { title: 'Legal', links: [{ label: 'Terms of Service', href: '/legal/terms' }, { label: 'Privacy Policy', href: '/legal/privacy' }, { label: 'Cookie Policy', href: '/legal/cookies' }] },
        ].map(col => (
          <div key={col.title}>
            <span style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 9, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'var(--muted)', display: 'block', marginBottom: 14 }}>{col.title}</span>
            {col.links.map(l => <Link key={l.href} href={l.href} style={{ display: 'block', fontSize: 14, color: 'var(--muted)', textDecoration: 'none', marginBottom: 10 }}>{l.label}</Link>)}
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1100, margin: '32px auto 0', padding: '24px 48px 0', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: 12, color: 'var(--muted)' }}>© 2026 Encore Media. All rights reserved.</p>
        <div style={{ display: 'flex', gap: 20 }}>
          {['/legal/terms', '/legal/privacy', '/legal/cookies'].map((href, i) => (
            <Link key={href} href={href} style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'none' }}>{['Terms', 'Privacy', 'Cookies'][i]}</Link>
          ))}
        </div>
      </div>
    </footer>
  )
}

// ─── BREADCRUMB ───────────────────────────────────────────────
export function Breadcrumb({ crumbs }: { crumbs: { label: string; href?: string }[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '20px 0 16px', fontSize: 12, color: 'var(--muted)' }}>
      {crumbs.map((c, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {i > 0 && <span style={{ opacity: 0.4 }}>›</span>}
          {c.href ? <Link href={c.href} style={{ color: 'var(--muted)', textDecoration: 'none' }}>{c.label}</Link> : <span style={{ color: 'var(--text)' }}>{c.label}</span>}
        </span>
      ))}
    </div>
  )
}

// ─── SHARE BAR ────────────────────────────────────────────────
export function ShareBar({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false)
  function copyLink() {
    navigator.clipboard.writeText(url).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  const waUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  const emailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
  const btnStyle = { display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500, padding: '8px 16px', borderRadius: 100, border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--muted)', cursor: 'pointer', textDecoration: 'none', whiteSpace: 'nowrap' as const }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '18px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', margin: '24px 0', flexWrap: 'wrap' as const }}>
      <span style={{ fontSize: 13, color: 'var(--muted)', marginRight: 4 }}>Share</span>
      <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{ ...btnStyle, color: '#25D366' }}>🟢 WhatsApp</a>
      <a href={xUrl} target="_blank" rel="noopener noreferrer" style={{ ...btnStyle, color: 'var(--text)' }}>✕ Twitter / X</a>
      <a href={emailUrl} style={btnStyle}>📧 Email</a>
      <button onClick={copyLink} style={{ ...btnStyle, color: copied ? 'var(--accent)' : 'var(--muted)', borderColor: copied ? 'var(--accent)' : 'var(--border)' }}>{copied ? '✓ Copied!' : '🔗 Copy link'}</button>
    </div>
  )
}

// ─── COMMENTS ─────────────────────────────────────────────────
import { Comment } from '@/lib/data'

export function CommentsSection({ targetId, initialComments }: { targetId: string; initialComments: Comment[] }) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [body, setBody] = useState('')
  const [bodyError, setBodyError] = useState(false)
  const [openReplies, setOpenReplies] = useState<string[]>([])
  const [replyBodies, setReplyBodies] = useState<Record<string, string>>({})

  async function submitComment() {
    if (!body.trim()) { setBodyError(true); return }
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/auth/login'; return }

    const { data, error } = await supabase.from('comments').insert({
      target_id: targetId,
      target_type: targetType,
      user_id: user.id,
      body: body.trim(),
    }).select('id').single()

    if (!error && data) {
      const profile = await supabase.from('profiles').select('display_name').eq('id', user.id).single()
      const name = profile.data?.display_name || user.email?.split('@')[0] || 'Fan'
      setComments(prev => [{
        id: data.id, targetId, targetType: targetType as 'show' | 'post',
        author: name, initials: name.slice(0,2).toUpperCase(),
        body: body.trim(), date: 'Just now', likes: 0, replies: [],
      }, ...prev])
      setBody('')
    }
  }

  async function submitReply(commentId: string) {
    const rb = replyBodies[commentId]?.trim()
    if (!rb) return
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/auth/login'; return }

    const { data, error } = await supabase.from('comments').insert({
      target_id: targetId,
      target_type: targetType,
      user_id: user.id,
      parent_id: commentId,
      body: rb,
    }).select('id').single()

    if (!error && data) {
      const profile = await supabase.from('profiles').select('display_name').eq('id', user.id).single()
      const name = profile.data?.display_name || user.email?.split('@')[0] || 'Fan'
      setComments(prev => prev.map(c => c.id === commentId ? {
        ...c, replies: [...(c.replies || []), {
          id: data.id, targetId, targetType: targetType as 'show' | 'post',
          author: name, initials: name.slice(0,2).toUpperCase(),
          body: rb, date: 'Just now', likes: 0,
        }],
      } : c))
      setReplyBodies(prev => ({ ...prev, [commentId]: '' }))
      setOpenReplies(prev => prev.filter(id => id !== commentId))
    }
  }

  function toggleReply(id: string) {
    setOpenReplies(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const inputBase = { width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--text)', outline: 'none', resize: 'vertical' as const }

  return (
    <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
      <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--text)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
        Comments
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 400, color: 'var(--muted)', background: 'var(--surface2)', border: '1px solid var(--border)', padding: '2px 10px', borderRadius: 100 }}>{comments.length}</span>
      </h2>
      {/* Write */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 18, marginBottom: 28 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Avatar initials="YN" size={36} />
          <div style={{ flex: 1 }}>
            <textarea value={body} onChange={e => { setBody(e.target.value); setBodyError(false) }} placeholder="Add to the conversation…" rows={3} style={{ ...inputBase, marginBottom: 10, borderColor: bodyError ? 'var(--accent-red)' : 'var(--border)' }} />
            {bodyError && <p style={{ fontSize: 12, color: 'var(--accent-red)', marginBottom: 8 }}>Comment cannot be empty</p>}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={submitComment} style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--bg)', background: 'var(--accent)', border: 'none', borderRadius: 8, padding: '9px 20px', cursor: 'pointer' }}>Post comment</button>
            </div>
          </div>
        </div>
      </div>
      {/* Thread */}
      {comments.length === 0 ? (
        <p style={{ fontSize: 14, color: 'var(--muted)', textAlign: 'center' as const, padding: '32px 0' }}>No comments yet — be the first.</p>
      ) : comments.map(c => (
        <div key={c.id}>
          <div style={{ display: 'flex', gap: 14, padding: '18px 0', borderBottom: '1px solid var(--border)' }}>
            <Avatar initials={c.initials} size={36} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
                <span style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{c.author}</span>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>{c.date}</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 10 }}>{c.body}</p>
              <div style={{ display: 'flex', gap: 14 }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--muted)', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 4 }}>♡ {c.likes}</button>
                <button onClick={() => toggleReply(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--muted)', fontFamily: 'DM Sans, sans-serif' }}>↩ Reply</button>
              </div>
            </div>
          </div>
          {/* Replies */}
          {(c.replies || []).length > 0 && (
            <div style={{ paddingLeft: 50, borderLeft: '2px solid var(--border)', marginLeft: 18 }}>
              {(c.replies || []).map(r => (
                <div key={r.id} style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                  <Avatar initials={r.initials} size={28} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 12, color: 'var(--text)' }}>{r.author}</span>
                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>{r.date}</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65 }}>{r.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Reply input */}
          {openReplies.includes(c.id) && (
            <div style={{ display: 'flex', gap: 10, padding: '12px 0 12px 50px' }}>
              <Avatar initials="YN" size={28} />
              <textarea value={replyBodies[c.id] || ''} onChange={e => setReplyBodies(prev => ({ ...prev, [c.id]: e.target.value }))} placeholder={`Reply to ${c.author}…`} rows={2} style={{ ...inputBase, flex: 1, height: 60 }} />
              <button onClick={() => submitReply(c.id)} style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--bg)', background: 'var(--accent)', border: 'none', borderRadius: 6, padding: '8px 14px', cursor: 'pointer', alignSelf: 'flex-end' }}>Reply</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── SHARED UI ─────────────────────────────────────────────────
export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1 }}>
      {[1,2,3,4,5].map(i => <span key={i} style={{ fontSize: size, color: i <= Math.round(rating) ? 'var(--accent)' : 'var(--border)' }}>★</span>)}
    </span>
  )
}

export function EventBadge({ type }: { type: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    gig:           { bg: 'rgba(232,255,71,0.10)',  color: '#b8cc38',  label: 'Gig' },
    concert:       { bg: 'rgba(100,116,139,0.15)', color: '#64748b',       label: 'Concert' },
    festival:      { bg: 'rgba(123,97,255,0.18)',  color: '#b39dff',  label: 'Festival' },
    'multi-night': { bg: 'rgba(0,201,255,0.12)',   color: '#5dd8ff',  label: 'Multi-night' },
  }
  const s = map[type] || map.concert
  return <span style={{ display: 'inline-block', fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 100, background: s.bg, color: s.color }}>{s.label}</span>
}

export function CategoryBadge({ category }: { category: string }) {
  return <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--accent)', background: 'rgba(var(--accent-rgb),0.1)', padding: '2px 8px', borderRadius: 4 }}>{category}</span>
}

export function Avatar({ initials, size = 40 }: { initials: string; size?: number }) {
  return <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg,#1a0033,#4400aa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: size * 0.32, color: 'white', flexShrink: 0 }}>{initials}</div>
}

export function GradientPoster({ height = 200, width = '100%' }: { height?: number; width?: string }) {
  return <div style={{ height, width, background: 'linear-gradient(135deg,#1a0033 0%,#4400aa 60%,#080A0F 100%)', borderRadius: 'var(--radius)', flexShrink: 0 }} />
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--muted)', marginBottom: 14 }}>{children}</p>
}

export function VenueMapLink({ name, address, transport, mapsUrl }: { name: string; address: string; transport: string; mapsUrl: string }) {
  return (
    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', textDecoration: 'none', color: 'var(--text)', marginTop: 10, transition: 'border-color 0.15s' }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
    >
      <span style={{ fontSize: 20 }}>📍</span>
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 13, color: 'var(--text)', marginBottom: 3 }}>{name}</p>
        <p style={{ fontSize: 12, color: 'var(--muted)' }}>{address}</p>
        <p style={{ fontSize: 12, color: 'var(--muted)' }}>{transport}</p>
      </div>
      <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, whiteSpace: 'nowrap' as const }}>Open in Maps →</span>
    </a>
  )
}

// ─── SIDEBAR HELPERS ───────────────────────────────────────────
export function Sidebar({ children }: { children: React.ReactNode }) {
  return <aside style={{ position: 'sticky', top: 80 }}>{children}</aside>
}

export function SidebarLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--muted)', marginBottom: 10, marginTop: 20 }}>{children}</p>
}

export function SidebarLink({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: active ? 'var(--text)' : 'var(--muted)', fontWeight: active ? 600 : 400, padding: '8px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>{children}</div>
}

export function AdSpot({ placement = 'sidebar' }: { placement?: string }) {
  const [ad, setAd] = useState<{ id: string; image_url: string; link_url: string; title: string } | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('ads')
      .select('id, image_url, link_url, title')
      .eq('placement', placement)
      .eq('is_active', true)
      .limit(1)
      .single()
      .then(({ data }) => { if (data) setAd(data) })
  }, [placement])

  async function handleClick() {
    if (!ad) return
    // Track click — fire and forget
    const supabase = createClient()
    await supabase.from('ads').update({ clicks: ad ? undefined : 0 }).eq('id', ad.id)
    // Use rpc for atomic increment
    supabase.rpc('increment_ad_clicks', { ad_id: ad.id }).catch(() => {
      // Fallback: just navigate
    })
  }

  if (!ad) {
    return (
      <div style={{ width: '100%', height: 200, background: 'var(--surface2)', border: '1px dashed var(--border)', borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--muted)' }}>Advertisement</p>
        <p style={{ fontSize: 12, color: 'var(--muted)', opacity: 0.5 }}>240 × 200 px</p>
      </div>
    )
  }

  return (
    <a href={ad.link_url} target="_blank" rel="noopener" onClick={handleClick} style={{ display: 'block', width: '100%', marginBottom: 28, borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)', textDecoration: 'none' }}>
      <img src={ad.image_url} alt={ad.title || 'Advertisement'} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
    </a>
  )
}

// ─── LAYOUT CONSTANTS ──────────────────────────────────────────
export const S = {
  container: { maxWidth: 1100, margin: '0 auto', padding: '0 48px' } as React.CSSProperties,
  containerNarrow: { maxWidth: 740, margin: '0 auto', padding: '0 48px' } as React.CSSProperties,
  pageHeader: { padding: '44px 0 36px', borderBottom: '1px solid var(--border)', marginBottom: 44 } as React.CSSProperties,
  pageLabel: { fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--accent)', display: 'block', marginBottom: 10 },
  pageTitle: { fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 38, color: 'var(--text)', lineHeight: 1.1, letterSpacing: '-0.01em' } as React.CSSProperties,
  pageDesc: { fontSize: 15, color: 'var(--muted)', marginTop: 10, maxWidth: 520, lineHeight: 1.65 } as React.CSSProperties,
  twoCol: { display: 'grid', gridTemplateColumns: '240px 1fr', gap: 48, alignItems: 'start' } as React.CSSProperties,
}

// ─── ICONS ─────────────────────────────────────────────────────
export function SearchIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
}
export function ArrowLeft({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
}
export function CheckIcon({ size = 32 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
}
