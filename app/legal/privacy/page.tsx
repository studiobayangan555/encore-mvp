'use client'

export default function PrivacyPage() {
  const effective = '1 May 2026'
  const H = (t: string) => (
    <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text)', marginTop: 36, marginBottom: 12, lineHeight: 1.3 }}>{t}</h2>
  )
  const P = (t: string) => <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 12 }}>{t}</p>
  const Li = ({ title, body }: { title: string; body: string }) => (
    <li style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 10, paddingLeft: 8 }}>
      <strong style={{ color: 'var(--text)' }}>{title}:</strong> {body}
    </li>
  )

  return (
    <div>
      <div style={{ padding: '32px 0 24px', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
        <span style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.1em', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>Legal</span>
        <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--text)', lineHeight: 1.1, marginBottom: 10 }}>Privacy Policy</h1>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>Effective: {effective} · Last updated: {effective}</p>
      </div>

      {H('1. Introduction')}
      {P("encore ('we', 'us', 'our') is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and your rights in relation to it. By using our platform you agree to the practices described here.")}

      {H('2. Data we collect')}
      {P("We collect information in the following ways:")}
      <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
        <Li title="Account data" body="Name, email address, and password when you register. If you sign in with Google, we receive your name and email from Google." />
        <Li title="Profile data" body="Display name, home countries, and preferences you set in your profile." />
        <Li title="Content data" body="Reviews, comments, photos, and ratings you submit." />
        <Li title="Usage data" body="Pages visited, features used, search queries, and interactions on the platform." />
        <Li title="Device data" body="IP address, browser type, operating system, and device identifiers." />
        <Li title="Promoter registration data" body="Full name, email, company name, and website URL submitted via the promoter registration form." />
      </ul>

      {H('3. How we use your data')}
      <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
        <Li title="To provide the service" body="Authentication, displaying your content, managing your saved shows and reviews." />
        <Li title="To improve the platform" body="Understanding how users interact with encore to make it better." />
        <Li title="To communicate" body="Sending account-related emails, update notices, and (if opted in) promoter programme updates." />
        <Li title="To ensure safety" body="Detecting and preventing fraud, abuse, and violations of our Terms of Service." />
      </ul>
      {P("We do not sell your personal data to third parties. We do not use your data for targeted advertising.")}

      {H('4. Legal basis for processing')}
      {P("We process your data on the following legal bases: (a) performance of a contract — to provide our services; (b) legitimate interests — to improve the platform and ensure security; (c) consent — for optional communications such as promoter programme updates, which you can withdraw at any time.")}

      {H('5. Data sharing')}
      {P("We share data only with:")}
      <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
        <Li title="Supabase" body="Our database and authentication provider, which stores account and content data on servers in the EU/Singapore region." />
        <Li title="Vercel" body="Our hosting provider for the web platform." />
        <Li title="Google" body="If you use Google Sign-In, subject to Google's privacy policy." />
      </ul>
      {P("We may disclose data where required by law or to protect the rights, property, or safety of encore or its users.")}

      {H('6. Data retention')}
      {P("We retain your account data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where retention is required by law or for legitimate business purposes such as fraud prevention. Reviews and comments may remain in anonymised form.")}

      {H('7. Your rights')}
      {P("Depending on your jurisdiction, you may have the right to:")}
      <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
        <Li title="Access" body="Request a copy of the personal data we hold about you." />
        <Li title="Correction" body="Ask us to correct inaccurate data." />
        <Li title="Deletion" body="Request deletion of your personal data." />
        <Li title="Portability" body="Receive your data in a structured, machine-readable format." />
        <Li title="Objection" body="Object to processing of your data for certain purposes." />
        <Li title="Withdrawal of consent" body="Opt out of communications at any time via account settings or by emailing us." />
      </ul>
      {P("To exercise any of these rights, contact us at privacy@encore.app. We will respond within 30 days.")}

      {H('8. Security')}
      {P("We implement appropriate technical and organisational measures to protect your data, including encryption in transit (TLS), secure authentication via Supabase, and row-level security on our database. No method of transmission over the internet is completely secure — we cannot guarantee absolute security.")}

      {H('9. Children')}
      {P("encore is not directed at children under 13. We do not knowingly collect personal data from children under 13. If we become aware that a child has registered, we will delete their account promptly.")}

      {H('10. International transfers')}
      {P("Our infrastructure may store data in the EU or Singapore. By using encore, you consent to the transfer of your data to these jurisdictions. We ensure appropriate safeguards are in place for any cross-border transfers.")}

      {H('11. Changes to this policy')}
      {P("We may update this Privacy Policy periodically. We will notify you of material changes via email or platform notice. The 'last updated' date at the top of this page indicates when the policy was last revised.")}

      {H('12. Contact')}
      {P("For privacy questions or to exercise your rights, contact us at privacy@encore.app.")}
    </div>
  )
}
