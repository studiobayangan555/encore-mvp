'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TopNav, BottomNav, Footer, Breadcrumb, Stars, Avatar, S } from '@/components'
import { createClient } from '@/lib/supabase'
import { SHOWS } from '@/lib/data'

interface Profile {
  id: string
  display_name: string | null
  email: string | null
  countries: string[]
  show_count: number
  review_count: number
}

interface DBReview {
  id: string
  rating: number
  headline: string
  created_at: string
  shows: { id: string; artist: string } | null
}

interface SavedShow {
  saved_at: string
  shows: {
    id: string
    artist: string
    venue: string
    city: string
    date_display: string
    price: string
    country: string
  } | null
}

const SEA_COUNTRIES = [
  { code: 'MY', flag: '🇲🇾' }, { code: 'SG', flag: '🇸🇬' },
  { code: 'TH', flag: '🇹🇭' }, { code: 'ID', flag: '🇮🇩' }, { code: 'PH', flag: '🇵🇭' },
]

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [reviews, setReviews] = useState<DBReview[]>([])
  const [savedShows, setSavedShows] = useState<SavedShow[]>([])
  const [goingShows, setGoingShows] = useState<SavedShow[]>([])
  const [userComments, setUserComments] = useState<any[]>([])
  const [unreadReplies, setUnreadReplies] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [activeTab, setActiveTab] = useState<'reviews' | 'going' | 'saved' | 'comments'>('reviews')
  const [loading, setLoading] = useState(true)
  const [settingsForm, setSettingsForm] = useState({ display_name: '', countries: [] as string[] })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    const supabase = createClient()
    
    // Hard timeout — never hang more than 8 seconds
    const timeout = setTimeout(() => {
      console.log('[profile] timeout reached')
      setLoading(false)
    }, 8000)
    
    try {
      // Try getUser first — most reliable with new Supabase keys
      let user: any = null
      
      // getSession is fast and local — doesn't make network requests
      const { data: { session } } = await supabase.auth.getSession()
      user = session?.user || null
      
      if (!user) {
        // Only if no local session, try network call
        const { data: { user: u } } = await supabase.auth.getUser()
        user = u || null
      }

      // Fetch user's comments and check for replies
      const { data: userCommentData } = await supabase
        .from('comments')
        .select('id, body, created_at, target_id, target_type')
        .eq('user_id', user.id)
        .is('parent_id', null)
        .order('created_at', { ascending: false })
        .limit(20)
      if (userCommentData && userCommentData.length > 0) {
        setUserComments(userCommentData)
        // Check if any comments have replies
        const commentIds = userCommentData.map((c: any) => c.id)
        const { data: replies } = await supabase
          .from('comments')
          .select('id')
          .in('parent_id', commentIds)
          .neq('user_id', user.id)
          .limit(1)
        if (replies && replies.length > 0) setUnreadReplies(true)
      }
      clearTimeout(timeout)
      
      if (!user) {
          router.push('/auth/login')
        return
      }
      

      // Build fallback profile immediately so page never hangs
      const fallback = {
        id: user.id,
        display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Fan',
        email: user.email || '',
        countries: [] as string[],
        show_count: 0,
        review_count: 0,
      }
      setProfile(fallback)
      setSettingsForm({ display_name: fallback.display_name, countries: [] })
      setLoading(false) // Show page immediately with fallback

      // Then try to enrich with database data
      const { data: prof } = await supabase
        .from('profiles').select('*').eq('id', user.id).single()
      if (prof) {
        setProfile(prof)
        setSettingsForm({ display_name: prof.display_name || fallback.display_name, countries: prof.countries || [] })
      }

      const { data: revs } = await supabase
        .from('reviews').select('id, rating, headline, created_at, shows(id, artist)')
        .eq('user_id', user.id).order('created_at', { ascending: false })
      if (revs) setReviews(revs as any)

      const { data: saved } = await supabase
        .from('saved_shows').select('saved_at, status, shows(id, artist, venue, city, date_display, price, country)')
        .eq('user_id', user.id).order('saved_at', { ascending: false })
      if (saved) {
        setSavedShows((saved as any).filter((s: any) => s.status !== 'going'))
        setGoingShows((saved as any).filter((s: any) => s.status === 'going'))
      }

    } catch (e) {
      // Fetch user's comments and check for replies
      const { data: userCommentData } = await supabase
        .from('comments')
        .select('id, body, created_at, target_id, target_type')
        .eq('user_id', user.id)
        .is('parent_id', null)
        .order('created_at', { ascending: false })
        .limit(20)
      if (userCommentData && userCommentData.length > 0) {
        setUserComments(userCommentData)
        // Check if any comments have replies
        const commentIds = userCommentData.map((c: any) => c.id)
        const { data: replies } = await supabase
          .from('comments')
          .select('id')
          .in('parent_id', commentIds)
          .neq('user_id', user.id)
          .limit(1)
        if (replies && replies.length > 0) setUnreadReplies(true)
      }
      clearTimeout(timeout)
      setLoading(false)
    }
  }

  async function saveSettings() {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('profiles').update({
      display_name: settingsForm.display_name,
      countries: settingsForm.countries,
    }).eq('id', user.id)
    setProfile(prev => prev ? { ...prev, display_name: settingsForm.display_name, countries: settingsForm.countries } : prev)
    setSaving(false)
    setShowSettings(false)
  }

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/reviews')
    router.refresh()
  }

  async function unsave(showId: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('saved_shows').delete().match({ user_id: user.id, show_id: showId })
    setSavedShows(prev => prev.filter(s => s.shows?.id !== showId))
  }

  function toggleCountry(code: string) {
    setSettingsForm(prev => ({
      ...prev,
      countries: prev.countries.includes(code)
        ? prev.countries.filter(c => c !== code)
        : [...prev.countries, code],
    }))
  }

  const displayName = profile?.display_name || profile?.email?.split('@')[0] || 'Your Name'
  const initials = displayName.slice(0, 2).toUpperCase()
  const tabs = [
    { key: 'reviews' as const, label: 'My Reviews', count: reviews.length },
    { key: 'going' as const, label: 'Going', count: goingShows.length },
    { key: 'saved' as const, label: 'Saved Shows', count: savedShows.length },
    { key: 'comments' as const, label: 'My Comments', count: userComments.length },
  ]

  const tabBar = (
    <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 32 }}>
      {tabs.map(t => (
        <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, color: activeTab === t.key ? 'var(--text)' : 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '12px 0', marginRight: 32, borderBottom: activeTab === t.key ? '2px solid var(--accent)' : '2px solid transparent', display: 'flex', alignItems: 'center', gap: 8 }}>
          {t.label}
          <span style={{ fontSize: 11, background: 'var(--surface2)', border: '1px solid var(--border)', padding: '1px 8px', borderRadius: 100, color: 'var(--muted)', fontWeight: 400 }}>{t.count}</span>
        </button>
      ))}
    </div>
  )

  const reviewsContent = (
    <div>
      {reviews.length === 0 ? (
        <div style={{ textAlign: 'center' as const, padding: '40px 0' }}>
          <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 16 }}>No reviews yet — find a show to review.</p>
          <Link href="/events" style={{ background: 'var(--accent)', color: 'var(--bg)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, padding: '10px 24px', borderRadius: 8, textDecoration: 'none' }}>Browse Shows</Link>
        </div>
      ) : reviews.map(r => (
        <Link key={r.id} href={`/events/${r.shows?.id || ''}`} style={{ textDecoration: 'none', display: 'flex', gap: 14, alignItems: 'flex-start', padding: '18px 0', borderBottom: '1px solid var(--border)', color: 'inherit' }}>
          <div style={{ width: 52, height: 52, borderRadius: 8, background: 'linear-gradient(135deg,#1a0033,#4400aa)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 5 }}>{r.shows?.artist || 'Unknown show'}</p>
            <Stars rating={r.rating} size={13} />
            <p style={{ fontSize: 14, color: 'var(--muted)', fontStyle: 'italic', marginTop: 5 }}>"{r.headline}"</p>
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' as const, flexShrink: 0 }}>
            {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </Link>
      ))}
    </div>
  )

  const savedContent = (
    <div>
      {savedShows.length === 0 ? (
        <div style={{ textAlign: 'center' as const, padding: '40px 0' }}>
          <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 16 }}>No saved shows yet.</p>
          <Link href="/events" style={{ background: 'var(--accent)', color: 'var(--bg)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, padding: '10px 24px', borderRadius: 8, textDecoration: 'none' }}>Browse Upcoming Shows</Link>
        </div>
      ) : savedShows.map(s => s.shows && (
        <div key={s.shows.id} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '18px 0', borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: 52, height: 52, borderRadius: 8, background: 'linear-gradient(135deg,#1a0033,#4400aa)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <Link href={`/events/${s.shows.id}`} style={{ textDecoration: 'none' }}>
              <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 3 }}>{s.shows.artist}</p>
            </Link>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>{s.shows.venue}, {s.shows.city} · {s.shows.date_display}</p>
            <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--accent)' }}>{s.shows.price}</p>
          </div>
          <button onClick={() => unsave(s.shows!.id)} style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 11, color: 'var(--muted)', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', whiteSpace: 'nowrap' as const }}>Unsave</button>
        </div>
      ))}
    </div>
  )


  const goingContent = (
    <div>
      {goingShows.length === 0 ? (
        <div style={{ textAlign: 'center' as const, padding: '40px 0' }}>
          <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 16 }}>No upcoming shows marked as going yet.</p>
          <Link href="/events" style={{ background: 'var(--accent)', color: 'var(--bg)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, padding: '10px 24px', borderRadius: 8, textDecoration: 'none' }}>Browse Shows</Link>
        </div>
      ) : goingShows.map((item: any, i: number) => {
        const show = item.shows
        if (!show) return null
        return (
          <Link key={i} href={`/events/${show.id}`} style={{ textDecoration: 'none', display: 'flex', gap: 14, padding: '16px 0', borderBottom: '1px solid var(--border)', alignItems: 'center', color: 'inherit' }}>
            <div style={{ width: 52, height: 52, borderRadius: 8, background: 'linear-gradient(135deg,#1a0033,#4400aa)', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 2 }}>{show.artist}</p>
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>{show.venue}, {show.city} · {show.date_display}</p>
            </div>
            <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--accent)', whiteSpace: 'nowrap' as const }}>{show.price}</p>
          </Link>
        )
      })}
    </div>
  )

  const commentsContent = (
    <div>
      {userComments.length === 0 ? (
        <div style={{ textAlign: 'center' as const, padding: '40px 0' }}>
          <p style={{ fontSize: 15, color: 'var(--muted)' }}>No comments yet.</p>
        </div>
      ) : userComments.map((c: any) => (
        <Link key={c.id} href={`/events/${c.target_id}`} style={{ textDecoration: 'none', display: 'block', padding: '16px 0', borderBottom: '1px solid var(--border)', color: 'inherit' }}>
          <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6, marginBottom: 6 }}>{c.body}</p>
          <p style={{ fontSize: 12, color: 'var(--muted)' }}>{new Date(c.created_at).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })} · <span style={{ color: 'var(--accent)' }}>View show →</span></p>
        </Link>
      ))}
    </div>
  )

  function tabContent() {
    if (activeTab === 'reviews') return reviewsContent
    if (activeTab === 'going') return goingContent
    if (activeTab === 'saved') return savedContent
    if (activeTab === 'comments') return commentsContent
    return null
  }

  if (loading) return (
    <>
      <TopNav />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <p style={{ fontSize: 15, color: 'var(--muted)' }}>Loading profile…</p>
      </div>
    </>
  )

  return (
    <>
      {/* Settings modal */}
      {showSettings && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowSettings(false)} />
          <div style={{ position: 'relative', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 32, width: '100%', maxWidth: 440, zIndex: 1, margin: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>Settings</h2>
              <button onClick={() => setShowSettings(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--muted)' }}>✕</button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 8 }}>Display name</p>
              <input value={settingsForm.display_name} onChange={e => setSettingsForm(p => ({ ...p, display_name: e.target.value }))} style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--text)', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 12 }}>Home countries</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                {SEA_COUNTRIES.map(c => (
                  <button key={c.code} onClick={() => toggleCountry(c.code)} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, padding: '6px 14px', borderRadius: 100, cursor: 'pointer', border: '1px solid var(--border)', background: settingsForm.countries.includes(c.code) ? 'var(--accent)' : 'var(--surface2)', color: settingsForm.countries.includes(c.code) ? 'var(--bg)' : 'var(--muted)' }}>{c.flag} {c.code}</button>
                ))}
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginBottom: 20 }}>
              <button onClick={signOut} style={{ width: '100%', background: 'transparent', color: 'var(--accent-red)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, padding: '12px 0', borderRadius: 10, border: '1px solid rgba(255,77,109,.3)', cursor: 'pointer' }}>Sign out</button>
            </div>
            <button onClick={saveSettings} disabled={saving} style={{ width: '100%', background: 'var(--accent)', color: 'var(--bg)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 14, padding: '13px 0', borderRadius: 10, border: 'none', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>{saving ? 'Saving…' : 'Save changes'}</button>
          </div>
        </div>
      )}

      {/* DESKTOP */}
      <div className="hidden lg:block" style={{ minHeight: '100vh' }}>
        <TopNav />
        <div style={S.container}>
          <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Profile' }]} />
          <div style={{ ...S.pageHeader, marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <Avatar initials={initials} size={64} />
                <div>
                  <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--text)', marginBottom: 10 }}>{displayName}</h1>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>

                    {(profile?.countries || []).map(c => {
                      const country = SEA_COUNTRIES.find(x => x.code === c)
                      return country ? <span key={c} style={{ fontSize: 13, color: 'var(--muted)', background: 'var(--surface2)', border: '1px solid var(--border)', padding: '3px 12px', borderRadius: 100 }}>{country.flag} {c}</span> : null
                    })}
                  </div>
                </div>
              </div>
              <button onClick={() => setShowSettings(true)} style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--text)', background: 'transparent', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: 8, cursor: 'pointer' }}>⚙ Settings</button>
            </div>
          </div>
          {tabBar}
          {tabContent()}
        </div>
        <Footer />
      </div>

      {/* MOBILE */}
      <div className="lg:hidden" style={{ paddingBottom: 80 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px 0' }}>
          <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--text)' }}>Profile</p>
          <button onClick={() => setShowSettings(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>⚙</button>
        </div>
        <div style={{ padding: '0 18px' }}>
          <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Profile' }]} />
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 20 }}>
            <Avatar initials={initials} size={56} />
            <div>
              <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--text)', marginBottom: 8 }}>{displayName}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>

                {(profile?.countries || []).map(c => {
                  const country = SEA_COUNTRIES.find(x => x.code === c)
                  return country ? <span key={c} style={{ fontSize: 12, color: 'var(--muted)', background: 'var(--surface2)', border: '1px solid var(--border)', padding: '3px 10px', borderRadius: 100 }}>{country.flag} {c}</span> : null
                })}
              </div>
            </div>
          </div>
          {tabBar}
          {tabContent()}
        </div>
        <BottomNav />
      </div>
    </>
  )
}
