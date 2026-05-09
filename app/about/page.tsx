import Link from 'next/link'
import { TopNav, BottomNav, Footer, MobileHeader, S } from '@/components'

export default function AboutPage() {
  const section = (title: string, body: React.ReactNode) => (
    <div style={{ paddingBottom: 32, marginBottom: 32, borderBottom: '1px solid var(--border)' }}>
      <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--text)', marginBottom: 16, lineHeight: 1.3 }}>{title}</h2>
      {body}
    </div>
  )

  const p = (text: string) => (
    <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 14 }}>{text}</p>
  )

  return (
    <>
      <div className="hidden lg:block">
        <TopNav />
        <div style={{ ...S.containerNarrow }}>
          <div style={S.pageHeader}>
            <span style={S.pageLabel}>About</span>
            <h1 style={S.pageTitle}>What encore is.</h1>
          </div>

          {section('For the fans', <>
            {p("encore is Southeast Asia's home for live music reviews — written by the people who were actually there. Every show, every night, across Malaysia, Singapore, Thailand, Indonesia, and the Philippines. We built encore because the experience of live music is fleeting, and the voices of fans who lived it deserve a permanent home. Not a star rating buried in a ticketing app. Not a press review written from a media pit. Real accounts from real people — the crowd, the setlist, the energy, the moment.")}
            {p("Whether you're deciding whether to buy a ticket, reliving a show you'll never forget, or building a record of every concert you've attended, encore is where that lives. Create an account, write your first review, and start building your live music history.")}
          </>)}

          {section('For promoters and venues', <>
            {p("encore gives promoters and venues a trusted, independent presence across the region. Fan reviews build the kind of reputation that advertising can't buy — authentic word of mouth from audiences who showed up. When a show delivers, encore ensures people hear about it.")}
            {p("We're currently building our promoter tools, including event listing management, audience insights, and verified promoter profiles. If you run shows across Southeast Asia and want early access, register your interest on our promoter page and we'll be in touch when we're ready to launch.")}
          </>)}

          {section('For investors and partners', <>
            {p("encore is building the region's first community-driven live music intelligence platform. Southeast Asia's live music market is growing rapidly — fragmented, underserved by discovery tools, and without a trusted review layer. encore fills that gap with a fan-first product that naturally aggregates demand signals, builds audience data, and creates a monetisable layer between fans, promoters, and the wider live entertainment ecosystem.")}
            {p("We're a lean, founder-led operation at MVP stage, focused on community depth before scale. If you're interested in partnering or learning more, reach out at hello@encore.app.")}
          </>)}

          <div style={{ padding: '24px 0' }}>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' as const }}>
              <Link href="/submit" style={{ background: 'var(--accent)', color: 'var(--bg)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, padding: '12px 24px', borderRadius: 10, textDecoration: 'none' }}>For Promoters →</Link>
              <a href="mailto:hello@encore.app" style={{ background: 'transparent', color: 'var(--text)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, padding: '12px 24px', borderRadius: 10, textDecoration: 'none', border: '1px solid var(--border)' }}>Get in touch</a>
            </div>
          </div>
        </div>
        <Footer />
      </div>

      <div className="lg:hidden" style={{ paddingBottom: 80 }}>
        <MobileHeader />
        <div style={{ padding: '0 18px' }}>
          <div style={{ padding: '20px 0 24px', borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
            <span style={S.pageLabel}>About</span>
            <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 24, color: 'var(--text)', lineHeight: 1.15 }}>What encore is.</h1>
          </div>
          {[
            { title: 'For the fans', body: "encore is Southeast Asia's home for live music reviews — written by the people who were actually there. Every show, every night, across five countries. Real accounts from real people — the crowd, the setlist, the energy, the moment. Create an account and start building your live music history." },
            { title: 'For promoters', body: "Fan reviews build the kind of reputation advertising can't buy. We're building promoter tools — event listing management, audience insights, and verified profiles. Register your interest and we'll be in touch at launch." },
            { title: 'For investors', body: "encore is building the region's first community-driven live music intelligence platform. Lean, founder-led, at MVP stage. Focused on community depth before scale. Reach out at hello@encore.app." },
          ].map(s => (
            <div key={s.title} style={{ marginBottom: 28, paddingBottom: 28, borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text)', marginBottom: 12 }}>{s.title}</h2>
              <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8 }}>{s.body}</p>
            </div>
          ))}
          <Link href="/submit" style={{ display: 'block', background: 'var(--accent)', color: 'var(--bg)', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 13, padding: '14px 0', borderRadius: 10, textDecoration: 'none', textAlign: 'center' as const, marginBottom: 32 }}>For Promoters →</Link>
        </div>
        <BottomNav />
      </div>
    </>
  )
}
