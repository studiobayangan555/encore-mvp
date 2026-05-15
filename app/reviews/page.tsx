'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TopNav, BottomNav, Footer, MobileHeader, MobileFooter, Breadcrumb, EventBadge, Sidebar, SidebarLabel, SidebarLink, AdSpot, ShowPoster, S } from '@/components'
import { getShowsWithReviews, getReviewsByShow, type Show, type Review } from '@/lib/queries'

const SEA_COUNTRIES = [
  { code: 'MY', label: 'Malaysia' }, { code: 'SG', label: 'Singapore' },
  { code: 'TH', label: 'Thailand' }, { code: 'ID', label: 'Indonesia' },
  { code: 'PH', label: 'Philippines' },
]
const GENRES = ['All genres', 'Pop', 'R&B / Soul', 'K-pop / J-pop', 'Indie / Alt', 'Electronic', 'Rock', 'Hip-hop']
const FILTERS = ['Latest', 'Popular', 'Trending']

function Thumbnail({ gradient, posterUrl }: { gradient: string; posterUrl?: string | null }) {
  return (
    <ShowPoster
      posterUrl={posterUrl}
      gradient={gradient}
      style={{ width: 88, flexShrink: 0, alignSelf: 'stretch' }}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--accent)', zIndex: 2 }} />
    </ShowPoster>
  )
}

const GRADIENTS = [
  'linear-gradient(135deg,#1a0033,#4400aa)',
  'linear-gradient(135deg,#003322,#006644)',
  'linear-gradient(135deg,#1a0044,#7B61FF)',
  'linear-gradient(135deg,#001a33,#0066cc)',
  'linear-gradient(135deg,#1a0a00,#cc4400)',
]

function ListRow({ show, idx, topReviews }: { show: Show; idx: number; topReviews: Record<string, Review> }) {
  const topReview = topReviews[show.id]
  const grad = GRADIENTS[idx % GRADIENTS.length]
  const authorName = topReview?.profiles?.display_name || 'Fan'
  return (
    <Link href={`/events/${show.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface)', overflow: 'hidden', marginBottom: 10, transition: 'border-color .2s' }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
    >
      <ShowPoster posterUrl={show.poster_url} gradient={grad} style={{ width: 88, flexShrink: 0, alignSelf: 'stretch' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--accent)', zIndex: 2 }} />
      </ShowPoster>
      <div style={{ flex: 1, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8, borderRight: '1px solid var(--border)', minWidth: 0 }}>
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
        {topReview ? (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8, fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.5 }}>
            <span style={{ color: 'var(--text)', fontStyle: 'normal', fontWeight: 500 }}>"{topReview.headline}"</span>
            {' '}— {authorName} · <span style={{ color: 'var(--accent)', fontStyle: 'normal' }}>Read all {show.review_count} reviews →</span>
          </div>
        ) : (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8, fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
            No reviews yet — <a href={`/events/${show.id}/review`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>be the first →</a>
          </div>
        )}
      </div>
      <div style={{ width: 130, flexShrink: 0, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
        <div>
          <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: '.1em', color: 'var(--muted)', marginBottom: 3 }}>Reviews</p>
          <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{show.review_count}</p>
        </div>
        <div>
          <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: '.1em', color: 'var(--muted)', marginBottom: 3 }}>Going</p>
          <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{show.going_count}</p>
        </div>
      </div>
    </Link>
  )
}

export default function ReviewsPage() {
  const [shows, setShows] = useState<Show[]>([])
  const [topReviews, setTopReviews] = useState<Record<string, Review>>({})
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('Latest')
  const [ratingFilter, setRatingFilter] = useState(0)
  const [genreFilter, setGenreFilter] = useState('')

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getShowsWithReviews()
        setShows(data)
        const reviews: Record<string, Review> = {}
        await Promise.all(data.slice(0, 10).map(async show => {
          const r = await getReviewsByShow(show.id)
          if (r.length > 0) reviews[show.id] = r[0]
        }))
        setTopReviews(reviews)
      } catch (e: any) {
        setError(e?.message || 'Failed to load reviews')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const [sorted, setSorted] = useState<Show[]>([])
  
  useEffect(() => {
    let list = [...shows]
    if (ratingFilter > 0) list = list.filter(s => s.avg_rating >= ratingFilter)
    if (genreFilter) list = list.filter(s => s.genre?.toLowerCase().includes(genreFilter.toLowerCase()))
    const result = list.sort((a, b) => {
      if (activeFilter === 'Popular') return (b.review_count || 0) - (a.review_count || 0)
      if (activeFilter === 'Trending') return (b.going_count || 0) - (a.going_count || 0)
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    setSorted([...result])
  }, [shows, activeFilter, ratingFilter, genreFilter])


  const skeleton = (
    <div>
      {[1,2,3].map(i => (
        <div key={i} style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface)', overflow: 'hidden', marginBottom: 10, height: 110 }}>
          <div style={{ width: 88, background: 'var(--surface2)' }} />
          <div style={{ flex: 1, padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ height: 14, width: '60%', background: 'var(--surface2)', borderRadius: 6 }} />
            <div style={{ height: 12, width: '40%', background: 'var(--surface2)', borderRadius: 6 }} />
            <div style={{ height: 12, width: '80%', background: 'var(--surface2)', borderRadius: 6 }} />
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <>
      <div className="hidden lg:block">
        <TopNav />
        <div style={S.container}>
          <Breadcrumb crumbs={[{ label: 'Reviews' }]} />

          {/* Hero search */}
          <div style={{ background: 'linear-gradient(135deg,#0D0A1A 0%,#1a0033 40%,#080A0F 100%)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '52px 48px 44px', marginBottom: 36, textAlign: 'center' as const, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: 500, height: 500, background: 'radial-gradient(circle,rgba(123,97,255,.08) 0%,transparent 70%)', pointerEvents: 'none' }} />
            <span style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase' as const, color: 'var(--accent)', display: 'block', marginBottom: 16 }}>Southeast Asia's live music community</span>
            <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 42, color: 'white', lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: 10 }}>Every show deserves<br />to be <span style={{ color: 'var(--accent)' }}>remembered.</span></h1>
            <p style={{ fontSize: 15, color: 'rgba(240,242,247,.55)', marginBottom: 36 }}>Real reviews from fans who were actually there.</p>
            <form onSubmit={e => { e.preventDefault(); const q = (e.currentTarget.querySelector('input') as HTMLInputElement).value.trim(); if (q) window.location.href = `/search?q=${encodeURIComponent(q)}` }} style={{ maxWidth: 680, margin: '0 auto 24px', display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: 12, overflow: 'hidden', height: 58, boxShadow: '0 8px 40px rgba(0,0,0,.4)' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', height: '100%' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--muted)', flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input placeholder="Search artists, shows, venues…" style={{ flex: 1, background: 'none', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--text)', outline: 'none' }} />
              </div>
              <div style={{ width: 1, height: 28, background: 'var(--border)' }} />
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', height: '100%', minWidth: 150 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--muted)', flexShrink: 0, marginRight: 8 }}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <select style={{ background: 'none', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--text)', outline: 'none', cursor: 'pointer', width: '100%' }}>
                  <option>All countries</option>
                  {SEA_COUNTRIES.map(c => <option key={c.code}>{c.label}</option>)}
                </select>
              </div>
              <button type="submit" style={{ height: '100%', padding: '0 28px', background: 'var(--accent)', border: 'none', cursor: 'pointer', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--bg)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                Search
              </button>
            </form>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' as const }}>
              {['Top rated', 'Trending in KL', 'K-pop', 'Festivals 2026', 'Singapore', 'Gigs'].map(tag => (
                <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`} style={{ fontSize: 12, color: 'var(--muted)', background: 'rgba(255,255,255,.04)', border: '1px solid var(--border)', padding: '5px 12px', borderRadius: 100, textDecoration: 'none' }}>{tag}</Link>
              ))}
            </div>
          </div>

          <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--text)', marginBottom: 6 }}>Reviews</h2>
          <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 28 }}>Real reviews from real fans — every show, every night, across Southeast Asia.</p>

          <div style={S.twoCol}>
            <Sidebar>
              <AdSpot />
              <SidebarLabel>Rating</SidebarLabel>
              {[{label:'All ratings',min:0},{label:'★★★★★ only',min:5},{label:'★★★★ and above',min:4},{label:'★★★ and above',min:3}].map((r,i) => (
                <div key={r.label} onClick={() => setRatingFilter(r.min)} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: ratingFilter === r.min ? 'var(--text)' : 'var(--muted)', fontWeight: ratingFilter === r.min ? 600 : 400, padding: '8px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'color .15s' }}>{r.label}</div>
              ))}
              <SidebarLabel>Genre</SidebarLabel>
              {GENRES.map((g) => (
                <div key={g} onClick={() => setGenreFilter(g === 'All genres' ? '' : g)} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: (genreFilter === '' && g === 'All genres') || genreFilter === g ? 'var(--text)' : 'var(--muted)', fontWeight: (genreFilter === '' && g === 'All genres') || genreFilter === g ? 600 : 400, padding: '8px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'color .15s' }}>{g}</div>
              ))}
            </Sidebar>

            <main>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {FILTERS.map(f => (
                    <button key={f} onClick={() => setActiveFilter(f)} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500, padding: '7px 16px', borderRadius: 100, cursor: 'pointer', border: '1px solid var(--border)', background: activeFilter === f ? 'var(--accent)' : 'var(--surface2)', color: activeFilter === f ? 'var(--bg)' : 'var(--muted)', transition: 'all .15s' }}>{f}</button>
                  ))}
                </div>
                <Link href="/search?q=&filter=reviews" style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--accent)', textDecoration: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 14px' }}>All Reviews →</Link>
              </div>
              <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: '.1em', color: 'var(--muted)', marginBottom: 14 }}>
                {loading ? 'Loading…' : error ? 'Error loading data' : `${sorted.length} shows · sorted by ${activeFilter.toLowerCase()}`}
              </p>
              <div key={activeFilter}>
              {loading ? skeleton : error ? (
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 24, textAlign: 'center' as const }}>
                  <p style={{ fontSize: 14, color: 'var(--accent-red)', marginBottom: 8 }}>Could not load reviews</p>
                  <p style={{ fontSize: 13, color: 'var(--muted)' }}>Check the browser console for details. If this is a Supabase permissions issue, run fix-rls.sql in your Supabase SQL Editor.</p>
                </div>
              ) : sorted.length === 0 ? (
                <div style={{ textAlign: 'center' as const, padding: '40px 0' }}>
                  <p style={{ fontSize: 15, color: 'var(--muted)' }}>No reviews yet — be the first to write one after a show.</p>
                </div>
              ) : sorted.map((show, idx) => <ListRow key={show.id} show={show} idx={idx} topReviews={topReviews} />)}
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </div>

      {/* MOBILE */}
      <div className="lg:hidden" style={{ paddingBottom: 80 }}>
        <MobileHeader />
        <div style={{ padding: '0 18px' }}>
          <div style={{ padding: '28px 0 24px', borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
            <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 24, color: 'var(--text)', lineHeight: 1.15, marginBottom: 8, textAlign: 'center' as const }}>Every show deserves to be <span style={{ color: 'var(--accent)' }}>remembered.</span></h1>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20, textAlign: 'center' as const, lineHeight: 1.65 }}>Real reviews from fans across Southeast Asia.</p>
            <form onSubmit={e => { e.preventDefault(); const q = (e.currentTarget.querySelector('input') as HTMLInputElement).value.trim(); if (q) window.location.href = `/search?q=${encodeURIComponent(q)}` }} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--muted)', flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input placeholder="Artist, show, venue…" style={{ flex: 1, background: 'none', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--text)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px' }}>
                <select style={{ background: 'none', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--muted)', outline: 'none', flex: 1 }}>
                  <option>All countries</option>
                  {SEA_COUNTRIES.map(c => <option key={c.code}>{c.label}</option>)}
                </select>
                <button type="submit" style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--bg)', background: 'var(--accent)', border: 'none', borderRadius: 6, padding: '8px 18px', cursor: 'pointer' }}>Search →</button>
              </div>
            </form>
          </div>

          <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--text)', marginBottom: 4 }}>Reviews</h2>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
            {FILTERS.map(f => <button key={f} onClick={() => setActiveFilter(f)} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 500, padding: '6px 14px', borderRadius: 100, cursor: 'pointer', border: '1px solid var(--border)', background: activeFilter === f ? 'var(--accent)' : 'var(--surface2)', color: activeFilter === f ? 'var(--bg)' : 'var(--muted)', whiteSpace: 'nowrap' as const, flexShrink: 0 }}>{f}</button>)}
            <Link href="/search?q=&filter=reviews" style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 11, fontWeight: 700, padding: '6px 14px', borderRadius: 100, border: '1px solid var(--border)', color: 'var(--accent)', textDecoration: 'none', whiteSpace: 'nowrap' as const, flexShrink: 0 }}>All Reviews →</Link>
          </div>

          {loading ? (
            <div style={{ padding: '20px 0', textAlign: 'center' as const }}>
              <p style={{ fontSize: 14, color: 'var(--muted)' }}>Loading reviews…</p>
            </div>
          ) : sorted.map((show, idx) => {
            const topReview = topReviews[show.id]
            const grad = GRADIENTS[idx % GRADIENTS.length]
            const authorName = topReview?.profiles?.display_name || 'Fan'
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
                      <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--accent)', lineHeight: 1 }}>{show.avg_rating.toFixed(1)} ★</p>
                      <p style={{ fontSize: 10, color: 'var(--muted)' }}>{show.review_count} reviews</p>
                    </div>
                  </div>
                  {topReview && (
                    <p style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', borderTop: '1px solid var(--border)', paddingTop: 8, lineHeight: 1.5 }}>
                      <span style={{ color: 'var(--text)', fontStyle: 'normal' }}>"{topReview.headline}"</span> <span style={{ color: 'var(--accent)' }}>Read all →</span>
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
          <MobileFooter />
        </div>
        <BottomNav />
      </div>
    </>
  )
}
