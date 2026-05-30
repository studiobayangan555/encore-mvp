'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TopNav, BottomNav, Footer, MobileHeader, MobileFooter, Breadcrumb, Stars, EventBadge, Avatar, VoteBar, CommentsSection, ShareBar, AdSpot, ShowPoster, PhotoGallery, S, ArrowLeft } from '@/components'
import { getShowById, getReviewsByShow, getCommentsByTarget, getShowsByPromoter, getTrendingShows, type Show, type Review, type Comment } from '@/lib/queries'
import { createClient } from '@/lib/supabase'

const LINEUP_LIMIT = 6

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [show, setShow] = useState<Show | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [promoterShows, setPromoterShows] = useState<Show[]>([])
  const [trendingShows, setTrendingShows] = useState<Show[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'reviews' | 'overview' | 'comments'>('reviews')
  const [saved, setSaved] = useState(false)
  const [going, setGoing] = useState(false)
  const [savingLoading, setSavingLoading] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''

  useEffect(() => {
    async function load() {
      const s = await getShowById(params.id)
      if (!s) { router.push('/events'); return }
      setShow(s)
      setActiveTab(s.is_past ? 'reviews' : 'overview')

      // Check if user is going or saved this show
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: savedData } = await supabase
          .from('saved_shows')
          .select('status')
          .eq('user_id', session.user.id)
          .eq('show_id', s.id)
          .single()
        if (savedData) {
          if (savedData.status === 'going') setGoing(true)
          else setSaved(true)
        }
      }

      const [revs, cmts, promo, trending] = await Promise.all([
        getReviewsByShow(s.id),
        getCommentsByTarget(s.id, 'show'),
        getShowsByPromoter(s.promoter_slug, s.id),
        getTrendingShows(s.id),
      ])
      setReviews(revs)
      setComments(cmts as Comment[])
      setPromoterShows(promo)
      setTrendingShows(trending)
      setLoading(false)
    }
    load()
  }, [params.id])

  async function toggleGoing() {
    if (savingLoading || !show) return
    setSavingLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/auth/login'; return }
    if (!going) {
      await supabase.from('saved_shows').upsert({
        user_id: user.id, show_id: show.id, status: 'going'
      }, { onConflict: 'user_id,show_id' })
    } else {
      await supabase.from('saved_shows').delete().match({ user_id: user.id, show_id: show.id })
    }
    setGoing(!going)
    setSavingLoading(false)
  }

  async function toggleSave() {
    if (savingLoading || !show) return
    setSavingLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/auth/login'; return }
    if (!saved) {
      await supabase.from('saved_shows').insert({ user_id: user.id, show_id: show.id })
    } else {
      await supabase.from('saved_shows').delete().match({ user_id: user.id, show_id: show.id })
    }
    setSaved(!saved)
    setSavingLoading(false)
  }

  if (loading || !show) {
    return (
      <>
        <div className="hidden lg:block"><TopNav /></div>
        <div className="lg:hidden"><MobileHeader /></div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <p style={{ fontSize: 15, color: 'var(--muted)' }}>Loading show…</p>
        </div>
      </>
    )
  }

  function MetaField({ label, value }: { label: string; value: string }) {
    return (
      <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
        <p style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 9, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.1em', color: 'var(--muted)', marginBottom: 3 }}>{label}</p>
        <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 13, color: 'var(--text)', lineHeight: 1.3 }}>{value}</p>
      </div>
    )
  }

  const RatingSummary = () => show.is_past ? (
    <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', flex: 1 }}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <div style={{ textAlign: 'center' as const, flexShrink: 0 }}>
          <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 900, fontSize: 48, color: 'var(--accent)', lineHeight: 1 }}>{show.avg_rating.toFixed(1)}</p>
          <Stars rating={show.avg_rating} size={15} />
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{show.review_count} reviews</p>
        </div>
        <div style={{ flex: 1 }}>
          {[5,4,3,2,1].map(star => {
            const count = reviews.filter(r => r.rating === star).length
            const pct = reviews.length ? Math.round(count / reviews.length * 100) : 0
            return (
              <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: 'var(--muted)', width: 8, textAlign: 'right' as const }}>{star}</span>
                <span style={{ fontSize: 11, color: 'var(--accent)' }}>★</span>
                <div style={{ flex: 1, height: 6, background: 'var(--surface)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)', borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: 11, color: 'var(--muted)', width: 20 }}>{count}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  ) : (
    <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#5dd8ff', flexShrink: 0, boxShadow: '0 0 8px #5dd8ff' }} />
        <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 12, color: '#5dd8ff', textTransform: 'uppercase' as const, letterSpacing: '.08em' }}>Upcoming Event</p>
      </div>
      <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>Reviews open after the event takes place. Mark yourself as going or save this show to get notified.</p>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
        <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: '.1em', color: 'var(--muted)', marginBottom: 6 }}>Interested</p>

      </div>
    </div>
  )

  const ActionButtons = ({ stacked = false }: { stacked?: boolean }) => (
    <div style={{ display: 'flex', flexDirection: stacked ? 'column' : 'row', gap: 10 }}>
      {show.is_past ? (
        <Link href={`/events/${show.id}/review`} style={{ background: 'var(--accent)', color: 'var(--bg)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, textAlign: 'center', padding: '13px 20px', borderRadius: 10, textDecoration: 'none', display: 'block' }}>Write A Review</Link>
      ) : (
        <>
          <button style={{ background: 'var(--accent)', color: 'var(--bg)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, padding: '13px 20px', borderRadius: 10, border: 'none', cursor: 'pointer' }}>Going</button>
          <button onClick={toggleSave} style={{ background: saved ? 'rgba(var(--accent-rgb),0.1)' : 'transparent', color: saved ? 'var(--accent)' : 'var(--text)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, padding: '13px 20px', borderRadius: 10, border: `1px solid ${saved ? 'var(--accent)' : 'var(--border)'}`, cursor: 'pointer' }}>{saved ? '★ Saved' : 'Interested / Save'}</button>
          <button style={{ background: 'transparent', color: 'var(--text)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, padding: '13px 20px', borderRadius: 10, border: '1px solid var(--border)', cursor: 'pointer' }}>Share</button>
        </>
      )}
    </div>
  )

  const TabBar = () => (
    <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
      {([['reviews', `Reviews (${show.review_count})`], ['overview', 'Overview'], ['comments', `Comments (${comments.length})`]] as const).map(([key, label]) => (
        <button key={key} onClick={() => setActiveTab(key)} style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 12, color: activeTab === key ? 'var(--text)' : 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '13px 0', marginRight: 28, borderBottom: activeTab === key ? '2px solid var(--accent)' : '2px solid transparent', whiteSpace: 'nowrap' as const }}>{label}</button>
      ))}
    </div>
  )

  function ReviewsTab() {
    return (
      <div>
        {!show?.is_past && (
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 12 }}>
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>This is an upcoming show — reviews open when the event commences.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={toggleGoing} style={{ background: going ? 'rgba(var(--accent-rgb),0.15)' : 'var(--accent)', color: going ? 'var(--accent)' : 'var(--bg)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 12, padding: '10px 18px', borderRadius: 8, border: going ? '1px solid var(--accent)' : 'none', cursor: 'pointer' }}>{going ? '✓ Going' : 'Going'}</button>
              <button onClick={toggleSave} style={{ background: 'transparent', color: 'var(--text)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 12, padding: '10px 18px', borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer' }}>Interested / Save</button>
            </div>
          </div>
        )}
        {show?.is_past && (
          <Link href={`/events/${show.id}/review`} style={{ display: 'block', border: '1px solid var(--accent)', color: 'var(--accent)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, textAlign: 'center', padding: '13px 0', borderRadius: 10, textDecoration: 'none', marginBottom: 24 }}>Write a Review</Link>
        )}
        {reviews.map(r => {
          const authorName = r.profiles?.display_name || 'Fan'
          const initials = authorName.slice(0,2).toUpperCase()
          return (
            <div key={r.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Avatar initials={initials} size={40} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{authorName}</p>
                  <Stars rating={r.rating} size={12} />
                </div>
              </div>
              <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 13, color: 'var(--text)', fontStyle: 'italic', marginBottom: 10 }}>"{r.headline}"</p>
              {r.body && <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 16 }}>{r.body}</p>}
              {r.photos && r.photos.length > 0 && (
                <PhotoGallery photos={r.photos} />
              )}
              {(r.sound || r.visuals || r.setlist || r.crowd || r.event_management) && (
                <div style={{ background: 'var(--surface2)', borderRadius: 8, padding: '12px 14px', marginBottom: 14 }}>
                  {[['Sound', r.sound], ['Visuals', r.visuals], ['Setlist', r.setlist], ['Crowd', r.crowd], ['Event Management', r.event_management]].filter(([, v]) => v).map(([label, val], i, arr) => (
                    <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', fontSize: 14 }}>
                      <span style={{ color: 'var(--muted)' }}>{label}</span>
                      <Stars rating={val as number} size={12} />
                    </div>
                  ))}
                </div>
              )}
              {r.vibes.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, marginBottom: 4 }}>
                  {r.vibes.map(v => <span key={v} style={{ fontSize: 12, color: 'var(--accent)', background: 'rgba(var(--accent-rgb),0.1)', border: '1px solid rgba(var(--accent-rgb),0.2)', padding: '3px 10px', borderRadius: 100 }}>{v}</span>)}
                </div>
              )}
              <VoteBar targetId={r.id} targetType="review" />
            </div>
          )
        })}
        {reviews.length === 0 && show.is_past && (
          <div style={{ textAlign: 'center' as const, padding: '40px 0' }}>
            <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 16 }}>No reviews yet — be the first.</p>
            <Link href={`/events/${show.id}/review`} style={{ background: 'var(--accent)', color: 'var(--bg)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, padding: '12px 24px', borderRadius: 10, textDecoration: 'none' }}>Write a Review</Link>
          </div>
        )}
      </div>
    )
  }

  function OverviewTab() {
    return (
      <div>
        <div style={{ paddingBottom: 22, borderBottom: '1px solid var(--border)', marginBottom: 22 }}>
          <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '.1em', color: 'var(--muted)', marginBottom: 12 }}>About This Show</p>
          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8 }}>{show.description}</p>
        </div>
        <div style={{ paddingBottom: 22, borderBottom: '1px solid var(--border)', marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '.1em', color: 'var(--muted)' }}>Lineup</p>
            {(show.lineup_url || show.ticket_url) && (
              <a href={show.lineup_url || show.ticket_url || '#'} target="_blank" rel="noopener" style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 10, color: 'var(--accent)', textDecoration: 'none' }}>Full lineup →</a>
            )}
          </div>
          {(() => {
            // Use real lineup if available, otherwise fall back to artist as headliner
            const acts = (show.lineup && show.lineup.length > 0)
              ? show.lineup.slice(0, LINEUP_LIMIT)
              : [{ name: show.artist, role: 'Headliner' }]
            return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 12 }}>
                {acts.map((act, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px' }}>
                    <Avatar initials={act.name.slice(0,2).toUpperCase()} size={40} />
                    <div>
                      <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--text)', lineHeight: 1.3 }}>{act.name}</p>
                      <p style={{ fontSize: 11, color: 'var(--muted)' }}>{act.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          })()}
          {show.lineup && show.lineup.length >= LINEUP_LIMIT && (show.lineup_url || show.ticket_url) && (
            <a href={show.lineup_url || show.ticket_url || '#'} target="_blank" rel="noopener" style={{ display: 'block', textAlign: 'center' as const, marginTop: 12, fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>View full lineup →</a>
          )}
        </div>
        {!show?.is_past && (
          <div style={{ paddingBottom: 22, borderBottom: '1px solid var(--border)', marginBottom: 22 }}>
            <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '.1em', color: 'var(--muted)', marginBottom: 12 }}>Tickets</p>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 16 }}>Starting {show.price}</p>
            <a href={show.ticket_url || '#'} target="_blank" rel="noopener" style={{ display: 'block', background: 'var(--accent)', color: 'var(--bg)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, textAlign: 'center' as const, padding: '13px 0', borderRadius: 10, textDecoration: 'none' }}>Buy Tickets →</a>
          </div>
        )}
        <div style={{ paddingBottom: 22, borderBottom: '1px solid var(--border)', marginBottom: 22 }}>
          <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '.1em', color: 'var(--muted)', marginBottom: 12 }}>Venue</p>
          <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 4 }}>{show.venue}</p>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 6 }}>{show.venue_address}</p>
          {show.venue_transport && <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>🚇 {show.venue_transport}</p>}
          {show.venue_maps_url && <a href={show.venue_maps_url} target="_blank" rel="noopener" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>Open in Maps →</a>}
        </div>
      </div>
    )
  }

  const LeftSidebar = () => (
    <aside>
      <div style={{ position: 'sticky', top: 80 }}>
        <ShowPoster posterUrl={show.poster_url} gradient='linear-gradient(160deg,#1a0033,#6600cc,#4400aa)' title={show.artist} clickable style={{ width: '100%', aspectRatio: '2/3', borderRadius: 12, border: '1px solid var(--border)', marginBottom: 16 }}>
          
        </ShowPoster>
        <AdSpot />
        {show.promoter && <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--text)', marginBottom: 12, marginTop: 4 }}>Other Events by "{show.promoter}"</p>}
        {promoterShows.length === 0 ? <p style={{ fontSize: 13, color: 'var(--muted)' }}>No other events listed.</p> : promoterShows.map(s => (
          <Link key={s.id} href={`/events/${s.id}`} style={{ textDecoration: 'none', display: 'flex', gap: 10, marginBottom: 12, alignItems: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: 8, background: 'linear-gradient(135deg,#1a0033,#4400aa)', flexShrink: 0 }} />
            <div>
              <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 12, color: 'var(--text)', lineHeight: 1.3 }}>{s.artist}</p>
              <p style={{ fontSize: 11, color: 'var(--muted)' }}>{s.date_display}</p>
            </div>
          </Link>
        ))}
        <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--text)', margin: '24px 0 12px' }}>{show.is_past ? 'Trending Reviews' : 'Trending Upcoming'}</p>
        {trendingShows.map(s => (
          <Link key={s.id} href={`/events/${s.id}`} style={{ textDecoration: 'none', display: 'flex', gap: 10, marginBottom: 12, alignItems: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: 8, background: 'linear-gradient(135deg,#1a0033,#4400aa)', flexShrink: 0 }} />
            <div>
              <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 12, color: 'var(--text)', lineHeight: 1.3 }}>{s.artist}</p>
              <p style={{ fontSize: 11, color: 'var(--muted)' }}>{show.is_past ? `${s.review_count} reviews` : s.date_display}</p>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  )

  return (
    <>
      <div className="hidden lg:block">
        <TopNav />
        <div style={S.container}>
          <Breadcrumb crumbs={[{ label: 'Shows', href: '/events' }, { label: show.artist }]} />
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 48, paddingTop: 8 }}>
            <LeftSidebar />
            <main>
              <div style={{ marginBottom: 6 }}><EventBadge type={show.type} /></div>
              <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 36, color: 'var(--text)', lineHeight: 1.1, margin: '10px 0 12px' }}>{show.artist}</h1>
              <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>{show.venue}, {show.city}</p>
              <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>{show.date_display}</p>
              {show.promoter && <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>By {show.promoter}</p>}
              <div style={{ display: 'flex', gap: 20, marginBottom: 28, alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, minWidth: 200, maxWidth: 220 }}>
                  {show.is_past ? (
                    <Link href={`/events/${show.id}/review`} style={{ background: 'var(--accent)', color: 'var(--bg)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, textAlign: 'center', padding: '13px 20px', borderRadius: 10, textDecoration: 'none', display: 'block', marginBottom: 12 }}>Write A Review</Link>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                      <button onClick={toggleGoing} style={{ background: going ? 'rgba(var(--accent-rgb),0.15)' : 'var(--accent)', color: going ? 'var(--accent)' : 'var(--bg)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, padding: '13px 20px', borderRadius: 10, border: going ? '1px solid var(--accent)' : 'none', cursor: 'pointer' }}>{going ? '✓ Going' : 'Going'}</button>
                      <button onClick={toggleSave} style={{ background: saved ? 'rgba(var(--accent-rgb),0.1)' : 'transparent', color: saved ? 'var(--accent)' : 'var(--text)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, padding: '13px 20px', borderRadius: 10, border: `1px solid ${saved ? 'var(--accent)' : 'var(--border)'}`, cursor: 'pointer' }}>{saved ? '★ Saved' : 'Interested / Save'}</button>
                      <button style={{ background: 'transparent', color: 'var(--text)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, padding: '13px 20px', borderRadius: 10, border: '1px solid var(--border)', cursor: 'pointer' }}>Share</button>
                    </div>
                  )}
                  {show.is_past && <>

                    <MetaField label="Est. Attendance" value="Fan submitted" />
                  </>}
                </div>
                <RatingSummary />
              </div>
              <TabBar />
              {activeTab === 'reviews' && <ReviewsTab />}
              {activeTab === 'overview' && <OverviewTab />}
              {activeTab === 'comments' && <CommentsSection targetId={show.id} initialComments={comments as any} />}
              <ShareBar title={`${show.artist} at ${show.venue}`} url={url} />
            </main>
          </div>
        </div>
        <Footer />
      </div>

      {/* MOBILE */}
      <div className="lg:hidden" style={{ paddingBottom: 80 }}>
        <MobileHeader />
        <ShowPoster posterUrl={show.poster_url} gradient='linear-gradient(160deg,#1a0033,#6600cc,#4400aa)' title={show.artist} clickable style={{ width: '100%', aspectRatio: '16/9', position: 'relative' }}>
          {!show.poster_url && <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>Poster image</p>}
          <button onClick={() => router.back()} style={{ position: 'absolute', top: 12, left: 14, background: 'rgba(8,10,15,.65)', backdropFilter: 'blur(6px)', border: 'none', borderRadius: 8, padding: '8px 10px', cursor: 'pointer', color: 'white', display: 'flex' }}>
            <ArrowLeft size={16} />
          </button>
        </ShowPoster>
        <div style={{ padding: '16px 18px 0' }}>
          <div style={{ marginBottom: 4 }}><EventBadge type={show.type} /></div>
          <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 26, color: 'var(--text)', lineHeight: 1.1, margin: '8px 0 8px' }}>{show.artist}</h1>
          <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 12, color: 'var(--muted)', marginBottom: 3 }}>{show.venue}, {show.city}</p>
          <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>{show.date_display}</p>
          {show.promoter && <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>By {show.promoter}</p>}
          <div style={{ marginBottom: 20 }}><ActionButtons stacked /></div>
          <div style={{ marginBottom: 20 }}><RatingSummary /></div>
          <TabBar />
          {activeTab === 'reviews' && <ReviewsTab />}
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'comments' && <CommentsSection targetId={show.id} initialComments={comments as any} />}
          <ShareBar title={`${show.artist} at ${show.venue}`} url={url} />
          <MobileFooter />
        </div>
        <BottomNav />
      </div>
    </>
  )
}
