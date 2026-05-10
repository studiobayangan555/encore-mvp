'use client'

export default function CookiesPage() {
  const effective = '1 May 2026'
  const H = (t: string) => (
    <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text)', marginTop: 36, marginBottom: 12, lineHeight: 1.3 }}>{t}</h2>
  )
  const P = (t: string) => <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 12 }}>{t}</p>

  const cookies = [
    { name: 'sb-access-token', type: 'Essential', duration: 'Session', purpose: 'Authenticates your login session with Supabase. Required for the platform to function.' },
    { name: 'sb-refresh-token', type: 'Essential', duration: '30 days', purpose: 'Keeps you logged in across sessions. Refreshed automatically when your session is active.' },
    { name: 'theme', type: 'Functional', duration: '1 year', purpose: 'Stores your dark/light theme preference so it persists across visits.' },
    { name: '_vercel_analytics', type: 'Analytics', duration: '30 days', purpose: 'Anonymised usage analytics provided by Vercel. No personal data is collected or shared.' },
  ]

  return (
    <div>
      <div style={{ padding: '32px 0 24px', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
        <span style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.1em', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>Legal</span>
        <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--text)', lineHeight: 1.1, marginBottom: 10 }}>Cookie Policy</h1>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>Effective: {effective} · Last updated: {effective}</p>
      </div>

      {H('What are cookies?')}
      {P("Cookies are small text files placed on your device when you visit a website. They are used to remember your preferences, keep you logged in, and understand how the platform is being used. encore uses a minimal set of cookies — we do not use advertising or tracking cookies.")}

      {H('How we use cookies')}
      {P("We use cookies only for the purposes set out below. We do not use cookies to track you across other websites, serve you targeted advertising, or build profiles of your behaviour.")}

      {/* Cookie table */}
      <div style={{ overflowX: 'auto', marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)' }}>
              {['Cookie name', 'Type', 'Duration', 'Purpose'].map(h => (
                <th key={h} style={{ textAlign: 'left' as const, padding: '10px 14px', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: 'var(--muted)', whiteSpace: 'nowrap' as const }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cookies.map((c, i) => (
              <tr key={c.name} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.02)' }}>
                <td style={{ padding: '12px 14px', fontFamily: 'Unbounded, sans-serif', fontWeight: 600, fontSize: 12, color: 'var(--text)', whiteSpace: 'nowrap' as const }}>{c.name}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 100, background: c.type === 'Essential' ? 'rgba(var(--accent-rgb),.1)' : c.type === 'Functional' ? 'rgba(123,97,255,.15)' : 'rgba(100,116,139,.15)', color: c.type === 'Essential' ? 'var(--accent)' : c.type === 'Functional' ? '#b39dff' : 'var(--muted)' }}>{c.type}</span>
                </td>
                <td style={{ padding: '12px 14px', color: 'var(--muted)', whiteSpace: 'nowrap' as const }}>{c.duration}</td>
                <td style={{ padding: '12px 14px', color: 'var(--muted)', lineHeight: 1.6 }}>{c.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {H('Essential cookies')}
      {P("Essential cookies are required for the platform to function. They enable you to log in, stay logged in, and use core features. These cookies cannot be disabled without breaking the platform. By using encore, you consent to the use of essential cookies.")}

      {H('Functional cookies')}
      {P("Functional cookies remember your preferences — such as your selected theme — to improve your experience. These are not strictly necessary but make the platform more usable. You can clear these via your browser settings.")}

      {H('Analytics cookies')}
      {P("We use Vercel Analytics to understand how the platform is being used. This is anonymised and aggregated — no personal data is collected or shared with third parties. There are no third-party advertising or tracking cookies on encore.")}

      {H('Managing cookies')}
      {P("You can control and delete cookies through your browser settings. Note that disabling essential cookies will prevent you from logging in and using core features of the platform. For guidance on managing cookies in your browser, visit your browser's help documentation.")}
      {P("Most browsers allow you to: view cookies currently stored, delete all or specific cookies, block cookies from specific sites, and block all third-party cookies. We recommend keeping essential cookies enabled for the best experience.")}

      {H('Third-party cookies')}
      {P("encore does not serve third-party advertising cookies. If you sign in with Google, Google may set its own cookies subject to Google's cookie policy. We have no control over these cookies.")}

      {H('Changes to this policy')}
      {P("We may update this Cookie Policy when we change our cookie practices. The 'last updated' date at the top of this page will reflect any revisions.")}

      {H('Contact')}
      {P("For questions about our use of cookies, contact us at privacy@encore.app.")}
    </div>
  )
}
