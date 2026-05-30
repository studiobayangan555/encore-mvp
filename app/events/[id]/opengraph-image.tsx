import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: show } = await supabase
    .from('shows')
    .select('artist, venue, city, date_display, genre, poster_url')
    .eq('id', params.id)
    .maybeSingle()

  const artist = show?.artist || 'encore'
  const venue = show?.venue || ''
  const city = show?.city || ''
  const date = show?.date_display || ''
  const genre = show?.genre || ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #080A0F 0%, #0F1219 60%, #1a0033 100%)',
          padding: '60px 72px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: -100, left: -100,
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(68,0,170,0.15) 0%, transparent 70%)',
        }} />

        {/* encore wordmark */}
        <div style={{
          fontSize: 28, fontWeight: 900, color: '#E8FF47',
          letterSpacing: '-0.5px', marginBottom: 'auto',
        }}>
          encore
        </div>

        {/* Show info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {genre && (
            <div style={{
              fontSize: 14, color: 'rgba(232,236,244,0.5)',
              textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600,
            }}>
              {genre}
            </div>
          )}
          <div style={{
            fontSize: artist.length > 20 ? 64 : 80,
            fontWeight: 900, color: '#E8ECF4',
            lineHeight: 1.05, letterSpacing: '-2px',
          }}>
            {artist}
          </div>
          <div style={{ fontSize: 22, color: 'rgba(232,236,244,0.6)', fontWeight: 400 }}>
            {[venue, city, date].filter(Boolean).join(' · ')}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          position: 'absolute', bottom: 48, right: 72,
          fontSize: 16, color: 'rgba(232,236,244,0.3)',
          letterSpacing: '1px',
        }}>
          enc.asia
        </div>
      </div>
    ),
    { ...size }
  )
}
