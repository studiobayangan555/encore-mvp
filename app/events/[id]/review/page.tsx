'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TopNav, BottomNav, Footer, MobileHeader, MobileFooter, Breadcrumb, Stars, PhotoUpload, S, ArrowLeft, CheckIcon } from '@/components'
import { getShowById, type Show } from '@/lib/queries'
import { createClient } from '@/lib/supabase'

const CATEGORIES = ['Sound', 'Visuals', 'Setlist', 'Crowd', 'Event Management']
const VIBES = ['Euphoric', 'Fan Chants', 'Emotional', 'High Energy', 'Intimate', 'Loud', 'All-Ages', 'Chaotic', 'Polished', 'Worth every cent', 'Overpriced']

function StarInput({ value, onChange, size = 32 }: { value: number; onChange: (v: number) => void; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 4 }}>
      {[1,2,3,4,5].map(i => (
        <button key={i} onClick={() => onChange(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, fontSize: size, color: i <= value ? 'var(--accent)' : 'var(--border)', lineHeight: 1 }}>★</button>
      ))}
    </span>
  )
}

export default function WriteReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [show, setShow] = useState<Show | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [rating, setRating] = useState(0)
  const [headline, setHeadline] = useState('')
  const [body, setBody] = useState('')
  const [attendance, setAttendance] = useState('')
  const [catRatings, setCatRatings] = useState<Record<string, number>>(Object.fromEntries(CATEGORIES.map(c => [c, 0])))
  const [vibes, setVibes] = useState<string[]>([])
  const [photos, setPhotos] = useState<string[]>([])
  const [headlineError, setHeadlineError] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    async function init() {
      // Check auth FIRST before showing anything
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace(`/auth/login?next=/events/${params.id}/review`)
        return
      }
      // Load the correct show by ID
      const s = await getShowById(params.id)
      if (!s || !s.is_past) {
        router.replace(`/events/${params.id}`)
        return
      }
      setShow(s)
      setAuthChecked(true)
    }
    init()
  }, [params.id])

  // Don't render anything until auth is confirmed and show is loaded
  if (!authChecked || !show) {
    return (
      <>
        <div className="hidden lg:block"><TopNav /></div>
        <div className="lg:hidden"><MobileHeader /></div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <p style={{ fontSize: 15, color: 'var(--muted)' }}>Loading…</p>
        </div>
      </>
    )
  }

  async function handleSubmit() {
    if (!headline.trim()) { setHeadlineError(true); return }
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const { error } = await supabase.from('reviews').insert({
      show_id: show.id,
      user_id: user.id,
      rating,
      headline: headline.trim(),
      body: body.trim() || null,
      sound: catRatings['Sound'] || null,
      visuals: catRatings['Visuals'] || null,
      setlist: catRatings['Setlist'] || null,
      crowd: catRatings['Crowd'] || null,
      event_management: catRatings['Event Management'] || null,
      vibes,
      est_attendance: attendance ? parseInt(attendance) : null,
      // photos uploaded to Supabase Storage then URLs stored here
      photos: [],
    })

    if (error) {
      if (error.code === '23505') {
        setHeadlineError(false)
        alert('You have already reviewed this show.')
        return
      }
      console.error(error)
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <>
        <TopNav />
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center' as const, padding: '0 32px' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(var(--accent-rgb),.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, color: 'var(--accent)' }}><CheckIcon size={32} /></div>
          <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 24, color: 'var(--text)', marginBottom: 8 }}>Review posted!</h1>
          <p style={{ fontSize: 15, color: 'var(--muted)', fontStyle: 'italic', marginBottom: 6 }}>"{headline}"</p>
          <Stars rating={rating} size={18} />
          {photos.length > 0 && <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 8 }}>{photos.length} photo{photos.length > 1 ? 's' : ''} uploaded</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 32, width: '100%', maxWidth: 300 }}>
            <button onClick={() => router.push(`/events/${show.id}`)} style={{ background: 'var(--accent)', color: 'var(--bg)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 14, padding: '14px 0', borderRadius: 10, border: 'none', cursor: 'pointer' }}>Back to {show.artist}</button>
            <button onClick={() => router.push('/reviews')} style={{ background: 'transparent', color: 'var(--text)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 14, padding: '14px 0', borderRadius: 10, border: '1px solid var(--border)', cursor: 'pointer' }}>See all reviews</button>
          </div>
        </div>
      </>
    )
  }

  const inputStyle: React.CSSProperties = { width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '13px 14px', fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--text)', outline: 'none' }
  const labelStyle: React.CSSProperties = { fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--text)', marginBottom: 10, display: 'block' }
  const sectionStyle: React.CSSProperties = { marginBottom: 28 }

  const form = (
    <div>
      {/* Event ref card */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, marginBottom: 32 }}>
        <div style={{ width: 48, height: 48, borderRadius: 8, background: 'linear-gradient(135deg,#1a0033,#4400aa)', flexShrink: 0 }} />
        <div>
          <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 3 }}>{show.artist}</p>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>{show.venue} · {show.dateDisplay}</p>
        </div>
      </div>

      {/* Overall rating */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Your overall rating</span>
        <StarInput value={rating} onChange={setRating} size={36} />
      </div>

      {/* Headline */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Headline <span style={{ color: 'var(--accent-red)' }}>*</span></span>
        <input value={headline} onChange={e => { setHeadline(e.target.value); setHeadlineError(false) }} placeholder="Sum it up in one line" style={{ ...inputStyle, borderColor: headlineError ? 'var(--accent-red)' : 'var(--border)' }} />
        {headlineError && <p style={{ fontSize: 12, color: 'var(--accent-red)', marginTop: 4 }}>Headline is required</p>}
      </div>

      {/* Full review */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Full review <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--muted)', fontFamily: 'DM Sans, sans-serif' }}>(optional)</span></span>
        <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Tell the crowd what it was really like…" rows={4} style={{ ...inputStyle, resize: 'vertical' as const }} />
      </div>

      {/* Estimated attendance — number input with helper text */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Estimated attendance <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--muted)', fontFamily: 'DM Sans, sans-serif' }}>(optional)</span></span>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>Your rough guess at the crowd size on the night.</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <input
            type="number"
            value={attendance}
            onChange={e => setAttendance(e.target.value)}
            placeholder="e.g. 8000"
            min={1}
            style={{ ...inputStyle, width: 180 }}
          />
          <span style={{ fontSize: 14, color: 'var(--muted)' }}>people</span>
        </div>
      </div>

      {/* Break it down */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Break it down</span>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '4px 16px' }}>
          {CATEGORIES.map((cat, i) => (
            <div key={cat} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < CATEGORIES.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: 15, color: 'var(--text)' }}>{cat}</span>
              <StarInput value={catRatings[cat]} onChange={v => setCatRatings(prev => ({ ...prev, [cat]: v }))} size={20} />
            </div>
          ))}
        </div>
      </div>

      {/* Vibe tags */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Vibe</span>
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
          {VIBES.map(v => (
            <button key={v} onClick={() => setVibes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500, padding: '7px 14px', borderRadius: 100, cursor: 'pointer', border: '1px solid var(--border)', background: vibes.includes(v) ? 'var(--accent)' : 'var(--surface2)', color: vibes.includes(v) ? 'var(--bg)' : 'var(--muted)' }}>{v}</button>
          ))}
        </div>
      </div>

      {/* Photo upload */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Photos <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--muted)', fontFamily: 'DM Sans, sans-serif' }}>(up to 10)</span></span>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>Share what you saw. Uploaded to Encore securely — JPEG or PNG, max 10MB each.</p>
        <PhotoUpload photos={photos} setPhotos={setPhotos} />
      </div>

      <button onClick={handleSubmit} style={{ width: '100%', background: 'var(--accent)', color: 'var(--bg)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 15, padding: '15px 0', borderRadius: 10, border: 'none', cursor: 'pointer', marginBottom: 12 }}>Post My Review</button>
      <p style={{ textAlign: 'center' as const, fontSize: 13, color: 'var(--muted)' }}>Full review optional — star rating is enough.</p>
    </div>
  )

  return (
    <>
      <div className="hidden lg:block">
        <TopNav />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px' }}>
          <Breadcrumb crumbs={[{ label: 'Shows', href: '/events' }, { label: show.artist, href: `/events/${show.id}` }, { label: 'Write Review' }]} />
          <div style={{ display: 'flex', gap: 48, paddingTop: 8 }}>
            <aside style={{ width: 240, flexShrink: 0 }}>
              <div style={{ position: 'sticky', top: 80 }}>
                <div style={{ height: 110, borderRadius: 10, background: 'linear-gradient(135deg,#1a0033,#4400aa)', marginBottom: 14 }} />
                <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 4 }}>{show.artist}</p>
                <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>{show.venue}</p>
                <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>{show.dateDisplay}</p>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: 16 }} />
                <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--text)', marginBottom: 10 }}>Review tips</p>
                {['Be specific about the show', 'One review per night', 'No setlist spoilers for upcoming dates'].map(tip => (
                  <p key={tip} style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6, lineHeight: 1.5 }}>· {tip}</p>
                ))}
                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />
                <p style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--text)', marginBottom: 8 }}>Photo uploads</p>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>Up to 10 photos per review. Stored securely on Encore. Max 10MB each.</p>
              </div>
            </aside>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 26, color: 'var(--text)', marginBottom: 28, lineHeight: 1.2 }}>Write a Review</h1>
              {form}
            </div>
          </div>
        </div>
        <Footer />
      </div>

      <div className="lg:hidden" style={{ paddingBottom: 80 }}>
        <MobileHeader />
        <div style={{ padding: '12px 18px 0' }}>
          <Breadcrumb crumbs={[{ label: 'Shows', href: '/events' }, { label: show.artist, href: `/events/${show.id}` }, { label: 'Write Review' }]} />
          <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 22, color: 'var(--text)', marginBottom: 24, lineHeight: 1.2 }}>Write a Review</h1>
          {form}
        </div>
        <BottomNav />
      </div>
    </>
  )
}
