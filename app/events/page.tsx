'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { TopNav, BottomNav, Footer, MobileHeader, MobileFooter, Breadcrumb, EventBadge, Sidebar, SidebarLabel, SidebarLink, AdSpot, ShowPoster, S } from '@/components'
import { getUpcomingShows, getFeaturedShow, type Show } from '@/lib/queries'

const SEA_COUNTRIES = [
  { code: 'MY', label: 'Malaysia' }, { code: 'SG', label: 'Singapore' },
  { code: 'TH', label: 'Thailand' }, { code: 'ID', label: 'Indonesia' },
  { code: 'PH', label: 'Philippines' },
]
const GENRES = ['All genres', 'Pop', 'R&B / Soul', 'K-pop / J-pop', 'Indie / Alt', 'Electronic', 'Rock']
type Sort = 'soonest' | 'latest' | 'popular' | 'trending' | 'this-week' | 'this-month' | 'all'

export default function EventsPage() {
  const [shows, setShows] = useState<Show[]>([])
  const [featured, setFeatured] = useState<Show | null>(null)
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<Sort>('soonest')
  const [search, setSearch] = useState('')
  const [genreFilter, setGenreFilter] = useState('')

  useEffect(() => {
    getUpcomingShows().then(data => { setShows(data); setLoading(false) })
  }, [])

  const grid = shows.slice(1, 4)

  const filtered = useMemo(() => {
    let list = shows.slice(1)
    if (genreFilter) list = list.filter(s => s.genre?.toLowerCase().includes(genreFilter.toLowerCase()))
    if (search) list = list.filter(s =>
      s.artist.toLowerCase().includes(search.toLowerCase()) ||
      s.venue.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase())
    )
    const now = new Date()
    const weekEnd = new Date(now); weekEnd.setDate(now.getDate() + 7)
    const monthEnd = new Date(now); monthEnd.setDate(now.getDate() + 30)
    if (sort === 'this-week') list = list.filter(s => new Date(s.date) <= weekEnd)
    if (sort === 'this-month') list = list.filter(s => new Date(s.date) <= monthEnd)
    if (sort === 'popular') list = [...list].sort((a, b) => b.review_count - a.review_count)
    if (sort === 'trending') list = [...list].sort((a, b) => b.going_count - a.going_count)
    if (sort === 'latest') list = [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return list
  }, [shows, sort, search, genreFilter])

  const SORTS: { key: Sort; label: string }[] = [
    { key: 'soonest', label: 'Soonest' }, { key: 'latest', label: 'Latest' },
    { key: 'popular', label: 'Popular' }, { key: 'trending', label: 'Trending' },
    { key: 'this-week', label: 'This Week' }, { key: 'this-month', label: 'This Month' },
    { key: 'all', label: 'All Upcoming' },
  ]

  function ShowRow({ show }: { show: Show }) {
    return (
      <Link href={`/events/${show.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--border)', color: 'inherit', transition: 'opacity .15s' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '.75'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
      >
        <div style={{ width: 52, height: 52, borderRadius: 10, background: 'linear-gradient(135deg,#1a0033,#4400aa)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 14, color: 'rgba(255,255,255,.4)' }}>
          {show.artist.slice(0,2).toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 3 }}>{show.artist}</p>
          <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 500, fontSize: 12, color: 'var(--muted)', marginBottom: 5 }}>{show.venue}, {show.city} · {show.date_display}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <EventBadge type={show.type} />
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>💬 {show.comment_count}</span>
          </div>
        </div>
        <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--accent)', whiteSpace: 'nowrap' as const }}>{show.price}</p>
      </Link>
    )
  }

  return (
    <>
      <div className="hidden lg:block">
        <TopNav />
        <div style={S.container}>
          <Breadcrumb crumbs={[{ label: 'Upcoming Shows' }]} />
          <div style={S.pageHeader}>
            <span style={S.pageLabel}>Discover</span>
            <h1 style={S.pageTitle}>Upcoming Shows</h1>
            <p style={S.pageDesc}>Concerts, gigs, festivals, and multi-night runs across Southeast Asia.</p>
          </div>
          <div style={S.twoCol}>
            <Sidebar>
              <AdSpot />
              <SidebarLabel>Genre</SidebarLabel>
              {GENRES.map((g) => (
                <div key={g} onClick={() => setGenreFilter(g === 'All genres' ? '' : g)} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: (genreFilter === '' && g === 'All genres') || genreFilter === g ? 'var(--text)' : 'var(--muted)', fontWeight: (genreFilter === '' && g === 'All genres') || genreFilter === g ? 600 : 400, padding: '8px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'color .15s' }}>{g}</div>
              ))}
            </Sidebar>

            <main>
              {/* Featured hero */}
              {loading ? (
                <div style={{ height: 280, borderRadius: 'var(--radius)', background: 'var(--surface2)', marginBottom: 24, animation: 'pulse 1.5s infinite' }} />
              ) : featured && (
                <Link href={`/events/${featured.id}`} style={{ textDecoration: 'none', display: 'block', borderRadius: 'var(--radius)', overflow: 'hidden', position: 'relative', height: 280, marginBottom: 24 }}>
                  <ShowPoster posterUrl={featured.poster_url} gradient='linear-gradient(135deg,#1a0033,#6600cc,#080A0F)' title={featured.artist} style={{ position: 'absolute', inset: 0 }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(8,10,15,.95) 0%,rgba(8,10,15,.2) 60%,transparent 100%)', padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: 'rgba(255,77,109,.2)', color: '#FF4D6D', marginBottom: 10, alignSelf: 'flex-start' }}>Selling Fast</span>
                    <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 32, color: 'white', lineHeight: 1, marginBottom: 6 }}>{featured.artist}</p>
                    <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 500, fontSize: 13, color: 'rgba(255,255,255,.55)', marginBottom: 8 }}>{featured.venue}, {featured.city} · {featured.date_display}</p>
                    <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--accent)' }}>{featured.price}</p>
                  </div>
                  <div style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(8,10,15,.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, padding: '10px 16px', textAlign: 'center' as const }}>
                    <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 20, color: '#5dd8ff', lineHeight: 1 }}>{featured.comment_count}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>💬 comments</p>
                  </div>
                </Link>
              )}

              {/* Grid */}
              {!loading && grid.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
                  {grid.map(show => (
                    <Link key={show.id} href={`/events/${show.id}`} style={{ textDecoration: 'none', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface)', overflow: 'hidden', transition: 'border-color .2s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
                    >
                      <ShowPoster posterUrl={show.poster_url} gradient='linear-gradient(135deg,#1a0033,#4400aa)' style={{ height: 110 }} />
                      <div style={{ padding: 14 }}>
                        <EventBadge type={show.type} />
                        <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text)', lineHeight: 1.2, margin: '6px 0 3px' }}>{show.artist}</p>
                        <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 500, fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>{show.date_display}</p>
                        <p style={{ fontSize: 12, color: 'var(--muted)' }}>💬 {show.comment_count}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Sort tabs */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, marginBottom: 16 }}>
                {SORTS.map(s => (
                  <button key={s.key} onClick={() => setSort(s.key)} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500, padding: '7px 16px', borderRadius: 100, cursor: 'pointer', border: '1px solid var(--border)', background: sort === s.key ? 'var(--accent)' : 'var(--surface2)', color: sort === s.key ? 'var(--bg)' : 'var(--muted)', transition: 'all .15s' }}>{s.label}</button>
                ))}

              </div>

              <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: '.1em', color: 'var(--muted)', marginBottom: 4 }}>
                {loading ? 'Loading…' : `${filtered.length} shows`}
              </p>

              {loading ? (
                [1,2,3].map(i => <div key={i} style={{ height: 72, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 8 }} />)
              ) : filtered.map(show => <ShowRow key={show.id} show={show} />)}
            </main>
          </div>
        </div>
        <Footer />
      </div>

      {/* MOBILE */}
      <div className="lg:hidden" style={{ paddingBottom: 80 }}>
        <MobileHeader />
        <div style={{ padding: '0 18px' }}>
          <Breadcrumb crumbs={[{ label: 'Upcoming Shows' }]} />
          <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 22, color: 'var(--text)', marginBottom: 16, lineHeight: 1.2 }}>Upcoming Shows</h1>

          {/* 4-card hero grid — featured full width + 3 below */}
          {!loading && shows.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              {/* Featured — full width */}
              {featured && (
                <Link href={`/events/${featured.id}`} style={{ textDecoration: 'none', display: 'block', borderRadius: 10, overflow: 'hidden', position: 'relative', height: 200, marginBottom: 8 }}>
                  <ShowPoster posterUrl={featured.poster_url} gradient='linear-gradient(135deg,#1a0033,#6600cc)' style={{ position: 'absolute', inset: 0 }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(8,10,15,.95),transparent 55%)', padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: 10, background: 'var(--accent)', color: 'var(--bg)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, padding: '2px 8px', borderRadius: 100, alignSelf: 'flex-start', marginBottom: 6 }}>Featured</span>
                    <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 20, color: 'white', lineHeight: 1.1, marginBottom: 3 }}>{featured.artist}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,.55)', marginBottom: 3 }}>{featured.venue} · {featured.date_display}</p>
                    <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--accent)' }}>{featured.price}</p>
                  </div>
                </Link>
              )}
              {/* 3 cards below featured */}
              {shows.slice(1, 4).length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {shows.slice(1, 4).map(show => (
                    <Link key={show.id} href={`/events/${show.id}`} style={{ textDecoration: 'none', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface)', display: 'block', color: 'inherit' }}>
                      <ShowPoster posterUrl={show.poster_url} gradient='linear-gradient(135deg,#1a0033,#4400aa)' style={{ height: 80 }} />
                      <div style={{ padding: '8px 8px 10px' }}>
                        <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 10, color: 'var(--text)', lineHeight: 1.3, marginBottom: 2 }}>{show.artist}</p>
                        <p style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 3, lineHeight: 1.3 }}>{show.date_display}</p>
                        <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 9, color: 'var(--accent)' }}>{show.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sort tabs */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 16, scrollbarWidth: 'none' as const }}>
            {SORTS.map(s => (
              <button key={s.key} onClick={() => setSort(s.key)} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 500, padding: '6px 14px', borderRadius: 100, cursor: 'pointer', border: '1px solid var(--border)', background: sort === s.key ? 'var(--accent)' : 'var(--surface2)', color: sort === s.key ? 'var(--bg)' : 'var(--muted)', whiteSpace: 'nowrap' as const, flexShrink: 0 }}>{s.label}</button>
            ))}
          </div>

          {/* All shows list */}
          {loading ? (
            <p style={{ fontSize: 14, color: 'var(--muted)', padding: '20px 0' }}>Loading shows…</p>
          ) : filtered.map(show => (
            <Link key={show.id} href={`/events/${show.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--border)', color: 'inherit' }}>
              <ShowPoster posterUrl={show.poster_url} gradient='linear-gradient(135deg,#1a0033,#4400aa)' style={{ width: 44, height: 44, borderRadius: 8, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text)', marginBottom: 2 }}>{show.artist}</p>
                <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 500, fontSize: 11, color: 'var(--muted)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{show.venue} · {show.date_display}</p>
                <EventBadge type={show.type} />
              </div>
              <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--accent)', whiteSpace: 'nowrap' as const, flexShrink: 0, paddingLeft: 8 }}>{show.price}</p>
            </Link>
          ))}
          <MobileFooter />
        </div>
        <BottomNav />
      </div>
    </>
  )
}
