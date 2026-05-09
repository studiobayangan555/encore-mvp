'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TopNav, BottomNav, Breadcrumb, Stars, EventBadge, Avatar, S, ArrowLeft } from '@/components'
import { PROMOTERS, SHOWS, REVIEWS } from '@/lib/data'

export default function PromoterPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const promoter = PROMOTERS.find(p => p.slug === params.slug) || PROMOTERS[0]
  const upcomingShows = SHOWS.filter(s => s.promoterSlug === params.slug)
  const reviews = REVIEWS.slice(0, 2)

  return (
    <>
      <div className="hidden lg:block">
        <TopNav />
        <div style={S.container}>
          <Breadcrumb crumbs={[{ label: 'Shows', href: '/events' }, { label: 'Promoters' }, { label: promoter.name }]} />
          <div style={S.pageHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 72, height: 72, borderRadius: 16, background: 'linear-gradient(135deg,#1a0033,#4400aa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 24, color: 'rgba(255,255,255,0.6)' }}>{promoter.name.slice(0,2).toUpperCase()}</div>
              <div>
                <h1 style={{ ...S.pageTitle, fontSize: 32, marginBottom: 4 }}>{promoter.name}</h1>
                <p style={{ fontSize: 14, color: 'var(--muted)' }}>{promoter.city} · {promoter.type}</p>
              </div>
            </div>
          </div>
          <div style={S.twoCol}>
            <aside style={{ position: 'sticky', top: 80 }}>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 20 }}>{promoter.bio}</p>
              <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
                {[{ label: 'Shows', value: promoter.showCount }, { label: 'Avg Rating', value: `${promoter.avgRating} ★`, accent: true }, { label: 'Reviews', value: promoter.reviewCount }].map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                    <p style={{ fontSize: 13, color: 'var(--muted)' }}>{s.label}</p>
                    <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 14, color: (s as any).accent ? 'var(--accent)' : 'var(--text)' }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </aside>
            <main>
              <PromoterContent promoter={promoter} shows={upcomingShows} reviews={reviews} />
            </main>
          </div>
        </div>
      </div>
      <div className="lg:hidden" style={{ paddingBottom: 80 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px 0' }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', display: 'flex' }}><ArrowLeft /></button>
          <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>{promoter.name}</p>
        </div>
        <div style={{ padding: '0 18px' }}>
          <Breadcrumb crumbs={[{ label: 'Shows', href: '/events' }, { label: promoter.name }]} />
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: 'linear-gradient(135deg,#1a0033,#4400aa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 18, color: 'rgba(255,255,255,0.6)', flexShrink: 0 }}>{promoter.name.slice(0,2).toUpperCase()}</div>
            <div>
              <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--text)', marginBottom: 2 }}>{promoter.name}</p>
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>{promoter.city} · {promoter.type}</p>
            </div>
          </div>
          <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 24 }}>
            {[{ label: 'Shows', value: promoter.showCount }, { label: 'Avg', value: `${promoter.avgRating}★`, accent: true }, { label: 'Reviews', value: promoter.reviewCount }].map((s, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' as const, padding: '12px 0', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
                <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 16, color: (s as any).accent ? 'var(--accent)' : 'var(--text)' }}>{s.value}</p>
                <p style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{s.label}</p>
              </div>
            ))}
          </div>
          <PromoterContent promoter={promoter} shows={upcomingShows} reviews={reviews} />
        </div>
        <BottomNav />
      </div>
    </>
  )
}

function PromoterContent({ promoter, shows, reviews }: any) {
  return (
    <div>
      <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--text)', marginBottom: 16 }}>Upcoming Shows</p>
      {shows.length === 0 ? <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>No upcoming shows listed.</p> : shows.map((s: any) => (
        <Link key={s.id} href={`/events/${s.id}`} style={{ textDecoration: 'none', display: 'flex', gap: 14, alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
              <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{s.artist}</p>
              <EventBadge type={s.type} />
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>{s.venue} · {s.date}</p>
          </div>
          <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--accent)', whiteSpace: 'nowrap' as const }}>{s.price}</p>
        </Link>
      ))}
      <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--text)', margin: '28px 0 8px' }}>Community Reviews</p>
      <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', marginBottom: 16, display: 'inline-block' }}>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>Showing reviews mentioning production & organisation</p>
      </div>
      {reviews.map((r: any) => (
        <div key={r.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
            <Avatar initials={r.initials} size={36} />
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{r.author}</p>
              <Stars rating={r.rating} size={11} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--muted)', background: 'var(--surface2)', border: '1px solid var(--border)', padding: '2px 10px', borderRadius: 100 }}>{SHOWS[0].artist}</span>
          </div>
          <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 14, color: 'var(--text)', fontStyle: 'italic', marginBottom: 8 }}>"{r.headline}"</p>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{r.body.slice(0, 120)}…</p>
        </div>
      ))}
    </div>
  )
}
