'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { TopNav, BottomNav, Footer, Breadcrumb, Stars, EventBadge, CategoryBadge, Avatar, MobileSearchButton, S } from '@/components'
import { searchShows, searchBlogPosts, type Show, type BlogPost } from '@/lib/queries'

type ResultTab = 'all' | 'shows' | 'reviews' | 'blog'

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [activeTab, setActiveTab] = useState<ResultTab>('all')
  const [showMore, setShowMore] = useState(false)

  const [matchedShows, setMatchedShows] = useState<Show[]>([])
  const [matchedPosts, setMatchedPosts] = useState<BlogPost[]>([])
  const matchedReviews: any[] = [] // reviews searched via shows

  useEffect(() => {
    if (!query) { setMatchedShows([]); setMatchedPosts([]); return }
    searchShows(query).then(setMatchedShows)
    searchBlogPosts(query).then(setMatchedPosts)
  }, [query])

  const totalResults = matchedShows.length + matchedReviews.length + matchedPosts.length

  const tabs: { key: ResultTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: totalResults },
    { key: 'shows', label: 'Shows', count: matchedShows.length },
    { key: 'reviews', label: 'Reviews', count: matchedReviews.length },
    { key: 'blog', label: 'Blog', count: matchedPosts.length },
  ]

  const INITIAL_SHOW = 5
  const showShows = activeTab === 'all' ? matchedShows.slice(0, showMore ? 999 : INITIAL_SHOW) : matchedShows
  const showReviews = activeTab === 'all' ? matchedReviews.slice(0, showMore ? 999 : INITIAL_SHOW) : matchedReviews
  const showPosts = activeTab === 'all' ? matchedPosts.slice(0, showMore ? 999 : INITIAL_SHOW) : matchedPosts

  const tabStyle = (key: ResultTab) => ({
    fontFamily: 'Unbounded, sans-serif',
    fontWeight: 700 as const,
    fontSize: 13,
    color: activeTab === key ? 'var(--text)' : 'var(--muted)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '12px 0',
    marginRight: 28,
    borderBottom: activeTab === key ? '2px solid var(--accent)' : '2px solid transparent',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  })

  return (
    <>
      {/* Header */}
      <div style={{ ...S.pageHeader, marginBottom: 0 }}>
        <span style={S.pageLabel}>Search</span>
        <h1 style={{ ...S.pageTitle, fontSize: 32 }}>
          {query ? (
            <>{totalResults} result{totalResults !== 1 ? 's' : ''} for <span style={{ color: 'var(--accent)' }}>"{query}"</span></>
          ) : 'Search'}
        </h1>
        {!query && <p style={S.pageDesc}>Enter a search term to find shows, reviews, and blog posts.</p>}
      </div>

      {/* Tabs */}
      {query && (
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 32 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={tabStyle(t.key)}>
              {t.label}
              <span style={{ fontSize: 11, background: 'var(--surface2)', border: '1px solid var(--border)', padding: '1px 8px', borderRadius: 100, color: 'var(--muted)', fontWeight: 400 }}>{t.count}</span>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {query && totalResults === 0 && (
        <div style={{ textAlign: 'center' as const, padding: '60px 0' }}>
          <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--text)', marginBottom: 10 }}>No results found</p>
          <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 32 }}>Try a different artist name, venue, or city.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' as const }}>
            <Link href="/events" style={{ background: 'var(--accent)', color: 'var(--bg)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, padding: '11px 22px', borderRadius: 8, textDecoration: 'none' }}>Browse Shows</Link>
            <Link href="/reviews" style={{ background: 'var(--surface2)', color: 'var(--text)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, padding: '11px 22px', borderRadius: 8, textDecoration: 'none', border: '1px solid var(--border)' }}>Read Reviews</Link>
          </div>
        </div>
      )}

      {/* Shows results */}
      {query && (activeTab === 'all' || activeTab === 'shows') && showShows.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          {activeTab === 'all' && (
            <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 16 }}>Shows</p>
          )}
          {showShows.map(show => (
            <Link key={show.id} href={`/events/${show.id}`} style={{ textDecoration: 'none', display: 'flex', gap: 16, alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border)', color: 'inherit' }}>
              <div style={{ width: 52, height: 52, borderRadius: 10, background: 'linear-gradient(135deg,#1a0033,#4400aa)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 14, color: 'rgba(255,255,255,.4)' }}>{show.artist.slice(0,2).toUpperCase()}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{show.artist}</p>
                  <EventBadge type={show.type} />
                </div>
                <p style={{ fontSize: 13, color: 'var(--muted)' }}>{show.venue}, {show.city} · {show.date_display}</p>
              </div>
              <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--accent)', marginBottom: 2 }}>{show.price}</p>
                {show.review_count > 0 && <p style={{ fontSize: 12, color: 'var(--muted)' }}>{show.review_count} reviews</p>}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Reviews results */}
      {query && (activeTab === 'all' || activeTab === 'reviews') && showReviews.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          {activeTab === 'all' && (
            <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 16 }}>Reviews</p>
          )}
          {showReviews.map(review => {
            const show = SHOWS.find(s => s.id === review.showId) || SHOWS[0]
            return (
              <Link key={review.id} href={`/events/${show.id}`} style={{ textDecoration: 'none', display: 'flex', gap: 16, alignItems: 'flex-start', padding: '16px 0', borderBottom: '1px solid var(--border)', color: 'inherit' }}>
                <Avatar initials={review.initials} size={44} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{review.author}</p>
                    <Stars rating={review.rating} size={12} />
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>{show.artist} · {show.venue}</p>
                  <p style={{ fontSize: 14, color: 'var(--text)', fontStyle: 'italic' }}>"{review.headline}"</p>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Blog results */}
      {query && (activeTab === 'all' || activeTab === 'blog') && showPosts.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          {activeTab === 'all' && (
            <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 16 }}>Blog</p>
          )}
          {showPosts.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'flex', gap: 16, alignItems: 'flex-start', padding: '16px 0', borderBottom: '1px solid var(--border)', color: 'inherit' }}>
              <div style={{ width: 52, height: 52, borderRadius: 8, background: 'linear-gradient(135deg,#1a0033,#4400aa)', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 6 }}><CategoryBadge category={post.category} /></div>
                <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 14, color: 'var(--text)', lineHeight: 1.3, marginBottom: 4 }}>{post.title}</p>
                <p style={{ fontSize: 13, color: 'var(--muted)' }}>{post.author} · {post.readTime}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Load more */}
      {query && totalResults > INITIAL_SHOW && activeTab === 'all' && !showMore && (
        <div style={{ textAlign: 'center' as const, padding: '16px 0 40px' }}>
          <button onClick={() => setShowMore(true)} style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text)', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 32px', cursor: 'pointer' }}>
            Load more results
          </button>
        </div>
      )}
    </>
  )
}

export default function SearchPage() {
  return (
    <>
      <div className="hidden lg:block">
        <TopNav />
        <div style={S.container}>
          <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Search' }]} />
          <Suspense fallback={<p style={{ color: 'var(--muted)', padding: '40px 0' }}>Loading…</p>}>
            <SearchResults />
          </Suspense>
        </div>
        <Footer />
      </div>

      <div className="lg:hidden" style={{ paddingBottom: 80 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px 0' }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--accent)' }}>encore</span>
          <MobileSearchButton />
        </div>
        <div style={{ padding: '0 18px' }}>
          <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Search' }]} />
          <Suspense fallback={<p style={{ color: 'var(--muted)', padding: '20px 0' }}>Loading…</p>}>
            <SearchResults />
          </Suspense>
        </div>
        <BottomNav />
      </div>
    </>
  )
}
