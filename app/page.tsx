'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { TopNav, BottomNav, Footer, MobileHeader, MobileFooter, ShowPoster, EventBadge, S } from '@/components'
import { getShowsWithReviews, getUpcomingShows, getReviewsByShow, type Show, type Review } from '@/lib/queries'

const GRADIENTS = [
  'linear-gradient(135deg,#1a0033,#4400aa)',
  'linear-gradient(135deg,#003322,#006644)',
  'linear-gradient(135deg,#1a0044,#7B61FF)',
  'linear-gradient(135deg,#001a33,#0066cc)',
  'linear-gradient(135deg,#1a0a00,#cc4400)',
]

const FILTERS = ['Latest', 'Popular', 'Trending']

export default function HomePage() {
  const [pastShows, setPastShows] = useState<Show[]>([])
  const [upcomingShows, setUpcomingShows] = useState<Show[]>([])
  const [topReviews, setTopReviews] = useState<Record<string, Review>>({})
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('Latest')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchCountry, setSearchCountry] = useState('All')

  useEffect(() => {
    async function load() {
      const [past, upcoming] = await Promise.all([
        getShowsWithReviews(),
        getUpcomingShows(),
      ])
      setPastShows(past)
      setUpcomingShows(upcoming)

      // Fetch top review for each past show (first 5)
      const reviews: Record<string, Review> = {}
      await Promise.all(past.slice(0, 5).map(async show => {
        const r = await getReviewsByShow(show.id)
        if (r.length > 0) reviews[show.id] = r[0]
      }))
      setTopReviews(reviews)
      setLoading(false)
    }
    load()
  }, [])

  const [sorted, setSorted] = useState<Show[]>([])
  useEffect(() => {
    let list = [...pastShows]
    if (activeFilter === 'Popular') list.sort((a, b) => (b.review_count || 0) - (a.review_count || 0))
    else if (activeFilter === 'Trending') list.sort((a, b) => (b.going_count || 0) - (a.going_count || 0))
    else list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    setSorted([...list])
  }, [pastShows, activeFilter])

  const featured = upcomingShows[0] || null
  const showGrid = upcomingShows.slice(1, 4)
  const showList = upcomingShows.slice(4, 10)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q) window.location.href = `/search?q=${encodeURIComponent(q)}${searchCountry !== 'All' ? `&country=${searchCountry}` : ''}`
  }

  const inputStyle: React.CSSProperties = {
    flex: 1, background: 'none', border: 'none',
    fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--text)', outline: 'none'
  }

  const sectionKicker = (text: string) => (
    <span style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: '.12em', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>{text}</span>
  )

  return (
    <>
      {/* ── DESKTOP ─────────────────────────────── */}
      <div className="hidden lg:block">
        <TopNav />

        {/* 1. HERO */}
        <section style={{ background: 'linear-gradient(135deg,#0D0A1A 0%,#1a0033 40%,#080A0F 100%)', borderBottom: '1px solid var(--border)', padding: '80px 48px 72px', textAlign: 'center' as const, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, background: 'radial-gradient(circle,rgba(123,97,255,.07) 0%,transparent 70%)', pointerEvents: 'none' }} />
          <span style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase' as const, color: 'var(--accent)', display: 'block', marginBottom: 20 }}>Southeast Asia's live music community</span>
          <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 52, color: 'white', lineHeight: 1.08, letterSpacing: '-.02em', marginBottom: 16 }}>
            Every show deserves<br />to be <span style={{ color: 'var(--accent)' }}>remembered.</span>
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(232,236,244,.55)', maxWidth: 520, margin: '0 auto 44px', lineHeight: 1.7 }}>
            Real reviews from fans who were actually there — every show, every night, across Malaysia, Singapore, Thailand, Indonesia, and the Philippines.
          </p>
          {/* Hero search */}
          <form onSubmit={handleSearch} style={{ maxWidth: 700, margin: '0 auto 28px', display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: 14, overflow: 'hidden', height: 62, boxShadow: '0 8px 40px rgba(0,0,0,.4)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(232,236,244,.4)" strokeWidth="2" strokeLinecap="round" style={{ marginLeft: 20, flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search artists, shows, venues…" style={{ ...inputStyle, padding: '0 16px' }} />
            <div style={{ width: 1, height: 28, background: 'var(--border)' }} />
            <select value={searchCountry} onChange={e => setSearchCountry(e.target.value)} style={{ background: 'none', border: 'none', padding: '0 16px', fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--text)', outline: 'none', cursor: 'pointer', minWidth: 148, height: '100%' }}>
              <option value="All">All countries</option>
              {['Malaysia','Singapore','Thailand','Indonesia','Philippines'].map(c => <option key={c}>{c}</option>)}
            </select>
            <button type="submit" style={{ height: '100%', padding: '0 32px', background: 'var(--accent)', border: 'none', cursor: 'pointer', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--bg)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Search
            </button>
          </form>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' as const }}>
            {['★ Top rated','🔥 Trending in KL','K-pop','Festivals 2026','Singapore','Gigs this week'].map(tag => (
              <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`} style={{ fontSize: 12, color: 'var(--muted)', background: 'rgba(255,255,255,.04)', border: '1px solid var(--border)', padding: '5px 14px', borderRadius: 100, textDecoration: 'none', transition: 'all .15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)' }}
              >{tag}</Link>
            ))}
          </div>
        </section>

        {/* 2. REVIEWS */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 48px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
            <div>
              {sectionKicker('Community')}
              <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--text)' }}>Reviews</h2>
              <p style={{ fontSize: 15, color: 'var(--muted)', marginTop: 4 }}>Real accounts from fans who were actually there.</p>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {FILTERS.map(f => (
                <button key={f} onClick={() => setActiveFilter(f)} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500, padding: '7px 16px', borderRadius: 100, cursor: 'pointer', border: '1px solid var(--border)', background: activeFilter === f ? 'var(--accent)' : 'var(--surface2)', color: activeFilter === f ? 'var(--bg)' : 'var(--muted)', transition: 'all .15s' }}>{f}</button>
              ))}
            </div>
          </div>

          {/* Review rows — max 5 */}
          {loading ? (
            [1,2,3].map(i => <div key={i} style={{ height: 110, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, marginBottom: 10 }} />)
          ) : sorted.slice(0, 5).map((show, idx) => {
            const topReview = topReviews[show.id]
            const grad = GRADIENTS[idx % GRADIENTS.length]
            const authorName = topReview?.profiles?.display_name || 'Fan'
            return (
              <Link key={show.id} href={`/events/${show.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', border: '1px solid var(--border)', borderRadius: 12, background: 'var(--surface)', overflow: 'hidden', marginBottom: 10, transition: 'border-color .2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
              >
                <ShowPoster posterUrl={show.poster_url} gradient={grad} style={{ width: 88, flexShrink: 0, alignSelf: 'stretch' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--accent)', zIndex: 2 }} />
                </ShowPoster>
                <div style={{ flex: 1, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ marginBottom: 5 }}><EventBadge type={show.type} /></div>
                      <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text)', lineHeight: 1.2, marginBottom: 3 }}>{show.artist}</p>
                      <p style={{ fontSize: 13, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{show.venue}, {show.city} · {show.date_display}</p>
                    </div>
                    <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                      <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 22, color: 'var(--accent)', lineHeight: 1 }}>{show.avg_rating > 0 ? `${show.avg_rating.toFixed(1)} ★` : '—'}</p>
                      <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{show.review_count > 0 ? `${show.review_count} reviews` : 'No reviews yet'}</p>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8, fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.5 }}>
                    {topReview ? (
                      <><span style={{ color: 'var(--text)', fontStyle: 'normal', fontWeight: 500 }}>"{topReview.headline}"</span>{' '}— {authorName} · <span style={{ color: 'var(--accent)', fontStyle: 'normal' }}>Read all {show.review_count} reviews →</span></>
                    ) : (
                      <span style={{ fontStyle: 'normal' }}>No reviews yet — <Link href={`/events/${show.id}/review`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>be the first →</Link></span>
                    )}
                  </div>
                </div>

              </Link>
            )
          })}
          <div style={{ textAlign: 'center' as const, marginTop: 24 }}>
            <Link href="/reviews" style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--bg)', background: 'var(--accent)', border: 'none', borderRadius: 10, padding: '14px 40px', textDecoration: 'none', display: 'inline-block', transition: 'opacity .15s' }}
>View all reviews →</Link>
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />

        {/* 3. UPCOMING SHOWS */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 48px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
            <div>
              {sectionKicker('Discover')}
              <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--text)' }}>Upcoming Shows</h2>
              <p style={{ fontSize: 15, color: 'var(--muted)', marginTop: 4 }}>Concerts, gigs, and festivals across Southeast Asia.</p>
            </div>
          </div>

          {/* Featured hero */}
          {featured && (
            <Link href={`/events/${featured.id}`} style={{ textDecoration: 'none', display: 'block', borderRadius: 12, overflow: 'hidden', position: 'relative', height: 280, marginBottom: 24 }}>
              <ShowPoster posterUrl={featured.poster_url} gradient='linear-gradient(135deg,#1a0033,#6600cc,#080A0F)' style={{ position: 'absolute', inset: 0 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(8,10,15,.95) 0%,rgba(8,10,15,.2) 60%,transparent 100%)', padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: 'rgba(255,77,109,.2)', color: '#FF4D6D', marginBottom: 10, alignSelf: 'flex-start' }}>Selling Fast</span>
                <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 32, color: 'white', lineHeight: 1, marginBottom: 6 }}>{featured.artist}</p>
                <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 500, fontSize: 13, color: 'rgba(255,255,255,.55)', marginBottom: 8 }}>{featured.venue}, {featured.city} · {featured.date_display}</p>
                <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--accent)' }}>{featured.price}</p>
              </div>
              <div style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(8,10,15,.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, padding: '10px 16px', textAlign: 'center' as const }}>
                <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 20, color: '#5dd8ff', lineHeight: 1 }}>{featured.going_count}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>going</p>
              </div>
            </Link>
          )}

          {/* 3-card grid */}
          {showGrid.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
              {showGrid.map((show, i) => (
                <Link key={show.id} href={`/events/${show.id}`} style={{ textDecoration: 'none', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface)', overflow: 'hidden', display: 'block', color: 'inherit', transition: 'border-color .2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
                >
                  <ShowPoster posterUrl={show.poster_url} gradient={GRADIENTS[i % GRADIENTS.length]} style={{ height: 110 }} />
                  <div style={{ padding: 14 }}>
                    <EventBadge type={show.type} />
                    <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text)', lineHeight: 1.2, margin: '6px 0 3px' }}>{show.artist}</p>
                    <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 500, fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>{show.date_display}</p>
                    <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--accent)' }}>{show.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* List rows */}
          {showList.map((show, i) => (
            <Link key={show.id} href={`/events/${show.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--border)', color: 'inherit', transition: 'opacity .15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '.75'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
            >
              <ShowPoster posterUrl={show.poster_url} gradient={GRADIENTS[i % GRADIENTS.length]} style={{ width: 52, height: 52, borderRadius: 10, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 3 }}>{show.artist}</p>
                <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 500, fontSize: 12, color: 'var(--muted)' }}>{show.venue}, {show.city} · {show.date_display}</p>
              </div>
              <EventBadge type={show.type} />
              <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--accent)', whiteSpace: 'nowrap' as const }}>{show.price}</p>
            </Link>
          ))}

          <div style={{ textAlign: 'center' as const, marginTop: 28 }}>
            <Link href="/events" style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--bg)', background: 'var(--accent)', border: 'none', borderRadius: 10, padding: '14px 40px', textDecoration: 'none', display: 'inline-block', transition: 'opacity .15s' }}
>View all upcoming shows →</Link>
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />

        {/* 4. SIGNUP */}
        <section style={{ background: 'linear-gradient(135deg,#0D0A1A 0%,#1a0033 50%,#080A0F 100%)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '96px 48px', textAlign: 'center' as const, position: 'relative', overflow: 'hidden' }}>
          <span style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase' as const, color: 'var(--accent)', display: 'block', marginBottom: 20 }}>Join the community</span>
          <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 40, color: 'white', lineHeight: 1.1, letterSpacing: '-.02em', maxWidth: 680, margin: '0 auto 16px' }}>
            Your next favourite show is waiting to be <span style={{ color: 'var(--accent)' }}>discovered.</span>
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(232,236,244,.55)', maxWidth: 520, margin: '0 auto 48px', lineHeight: 1.7 }}>
            Join encore and become part of Southeast Asia's first fan-driven live music community. Write reviews, track shows you've attended, and help other fans decide what's worth showing up for.
          </p>
          <Link href="/auth/login" style={{ display: 'inline-block', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--bg)', background: 'var(--accent)', borderRadius: 12, padding: '16px 48px', textDecoration: 'none', marginBottom: 16, transition: 'opacity .15s' }}>
            Create a free account →
          </Link>
          <p style={{ fontSize: 13, color: 'rgba(232,236,244,.4)', marginBottom: 52 }}>Free forever · No spam · Unsubscribe any time</p>
          <div style={{ display: 'flex', gap: 56, justifyContent: 'center', flexWrap: 'wrap' as const }}>
            {[['5','Countries'],['350+','Shows reviewed'],['2,400+','Fan reviews'],['100%','Fan written']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' as const }}>
                <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--accent)', lineHeight: 1 }}>{num}</p>
                <p style={{ fontSize: 13, color: 'rgba(232,236,244,.5)', marginTop: 6 }}>{label}</p>
              </div>
            ))}
          </div>
        </section>

        <Footer />
      </div>

      {/* ── MOBILE ──────────────────────────────── */}
      <div className="lg:hidden" style={{ paddingBottom: 80 }}>
        <MobileHeader />

        {/* Mobile hero */}
        <div style={{ background: 'linear-gradient(135deg,#0D0A1A,#1a0033,#080A0F)', borderBottom: '1px solid var(--border)', padding: '36px 20px 32px', textAlign: 'center' as const }}>
          <span style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase' as const, color: 'var(--accent)', display: 'block', marginBottom: 14 }}>Southeast Asia's live music community</span>
          <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 26, color: 'white', lineHeight: 1.1, marginBottom: 10 }}>Every show deserves to be <span style={{ color: 'var(--accent)' }}>remembered.</span></h1>
          <p style={{ fontSize: 14, color: 'rgba(232,236,244,.55)', marginBottom: 24, lineHeight: 1.65 }}>Real reviews from fans who were actually there.</p>
          <form onSubmit={handleSearch} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(232,236,244,.4)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Artist, show, venue…" style={{ flex: 1, background: 'none', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--text)', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px' }}>
              <select style={{ background: 'none', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--muted)', outline: 'none', flex: 1 }}>
                <option>All countries</option>
                {['Malaysia','Singapore','Thailand','Indonesia','Philippines'].map(c => <option key={c}>{c}</option>)}
              </select>
              <button type="submit" style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--bg)', background: 'var(--accent)', border: 'none', borderRadius: 6, padding: '8px 18px', cursor: 'pointer' }}>Search →</button>
            </div>
          </form>
        </div>

        {/* Mobile Reviews */}
        <div style={{ padding: '32px 18px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--text)' }}>Reviews</h2>
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
            {FILTERS.map(f => <button key={f} onClick={() => setActiveFilter(f)} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 500, padding: '6px 14px', borderRadius: 100, cursor: 'pointer', border: '1px solid var(--border)', background: activeFilter === f ? 'var(--accent)' : 'var(--surface2)', color: activeFilter === f ? 'var(--bg)' : 'var(--muted)', whiteSpace: 'nowrap' as const, flexShrink: 0 }}>{f}</button>)}
          </div>
          {loading ? <p style={{ fontSize: 14, color: 'var(--muted)', padding: '20px 0' }}>Loading…</p> : sorted.slice(0, 5).map((show, idx) => {
            const topReview = topReviews[show.id]
            const grad = GRADIENTS[idx % GRADIENTS.length]
            return (
              <Link key={show.id} href={`/events/${show.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface)', overflow: 'hidden', marginBottom: 10 }}>
                <ShowPoster posterUrl={show.poster_url} gradient={grad} style={{ width: 72, flexShrink: 0, alignSelf: 'stretch' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--accent)', zIndex: 2 }} />
                </ShowPoster>
                <div style={{ flex: 1, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                    <div>
                      <div style={{ marginBottom: 4 }}><EventBadge type={show.type} /></div>
                      <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text)', lineHeight: 1.2, marginBottom: 2 }}>{show.artist}</p>
                      <p style={{ fontSize: 11, color: 'var(--muted)' }}>{show.venue} · {show.date_display}</p>
                    </div>
                    <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                      <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--accent)', lineHeight: 1 }}>{show.avg_rating > 0 ? `${show.avg_rating.toFixed(1)} ★` : '—'}</p>
                      <p style={{ fontSize: 10, color: 'var(--muted)' }}>{show.review_count > 0 ? `${show.review_count} reviews` : 'No reviews'}</p>
                    </div>
                  </div>
                  {topReview && <p style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', borderTop: '1px solid var(--border)', paddingTop: 8, lineHeight: 1.5 }}><span style={{ color: 'var(--text)', fontStyle: 'normal' }}>"{topReview.headline}"</span> <span style={{ color: 'var(--accent)', fontStyle: 'normal' }}>Read all →</span></p>}
                </div>
              </Link>
            )
          })}
          <div style={{ textAlign: 'center' as const, marginTop: 20, marginBottom: 32 }}>
            <Link href="/reviews" style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--bg)', background: 'var(--accent)', border: 'none', borderRadius: 8, padding: '11px 28px', textDecoration: 'none', display: 'inline-block' }}>View all reviews →</Link>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />

        {/* Mobile Upcoming */}
        <div style={{ padding: '32px 18px 0' }}>
          <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--text)', marginBottom: 16 }}>Upcoming Shows</h2>
          {featured && (
            <Link href={`/events/${featured.id}`} style={{ textDecoration: 'none', display: 'block', borderRadius: 10, overflow: 'hidden', position: 'relative', height: 180, marginBottom: 12 }}>
              <ShowPoster posterUrl={featured.poster_url} gradient='linear-gradient(135deg,#1a0033,#6600cc)' style={{ position: 'absolute', inset: 0 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(8,10,15,.95),transparent 60%)', padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 20, color: 'white', lineHeight: 1.1, marginBottom: 3 }}>{featured.artist}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,.55)', marginBottom: 3 }}>{featured.venue} · {featured.date_display}</p>
                <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--accent)' }}>{featured.price}</p>
              </div>
            </Link>
          )}
          {showGrid.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 4 }}>
              {showGrid.map((show, i) => (
                <Link key={show.id} href={`/events/${show.id}`} style={{ textDecoration: 'none', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface)', display: 'block', color: 'inherit' }}>
                  <ShowPoster posterUrl={show.poster_url} gradient={GRADIENTS[i % GRADIENTS.length]} style={{ height: 80 }} />
                  <div style={{ padding: '8px 8px 10px' }}>
                    <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 10, color: 'var(--text)', lineHeight: 1.3, marginBottom: 2 }}>{show.artist}</p>
                    <p style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 3 }}>{show.date_display}</p>
                    <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 9, color: 'var(--accent)' }}>{show.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {showList.slice(0, 3).map((show, i) => (
            <Link key={show.id} href={`/events/${show.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--border)', color: 'inherit' }}>
              <ShowPoster posterUrl={show.poster_url} gradient={GRADIENTS[i % GRADIENTS.length]} style={{ width: 44, height: 44, borderRadius: 8, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text)', marginBottom: 2 }}>{show.artist}</p>
                <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 500, fontSize: 11, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{show.venue} · {show.date_display}</p>
              </div>
              <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--accent)', whiteSpace: 'nowrap' as const, flexShrink: 0 }}>{show.price}</p>
            </Link>
          ))}
          <div style={{ textAlign: 'center' as const, marginTop: 20, marginBottom: 32 }}>
            <Link href="/events" style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--bg)', background: 'var(--accent)', border: 'none', borderRadius: 8, padding: '11px 28px', textDecoration: 'none', display: 'inline-block' }}>View all upcoming shows →</Link>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />

        {/* Mobile signup */}
        <div style={{ background: 'linear-gradient(135deg,#0D0A1A,#1a0033,#080A0F)', borderTop: '1px solid var(--border)', padding: '52px 20px', textAlign: 'center' as const }}>
          <span style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase' as const, color: 'var(--accent)', display: 'block', marginBottom: 16 }}>Join the community</span>
          <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 24, color: 'white', lineHeight: 1.15, marginBottom: 12 }}>Your next show is waiting to be <span style={{ color: 'var(--accent)' }}>discovered.</span></h2>
          <p style={{ fontSize: 14, color: 'rgba(232,236,244,.55)', marginBottom: 28, lineHeight: 1.7 }}>Join encore — write reviews, track shows, and help other fans decide what's worth showing up for.</p>
          <Link href="/auth/login" style={{ display: 'inline-block', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--bg)', background: 'var(--accent)', borderRadius: 10, padding: '14px 36px', textDecoration: 'none', marginBottom: 12 }}>Create a free account →</Link>
          <p style={{ fontSize: 12, color: 'rgba(232,236,244,.35)' }}>Free forever · No spam</p>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 36, flexWrap: 'wrap' as const }}>
            {[['5','Countries'],['350+','Shows'],['100%','Fan written']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' as const }}>
                <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 22, color: 'var(--accent)' }}>{num}</p>
                <p style={{ fontSize: 12, color: 'rgba(232,236,244,.45)', marginTop: 4 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        <MobileFooter />
        <BottomNav />
      </div>
    </>
  )
}
