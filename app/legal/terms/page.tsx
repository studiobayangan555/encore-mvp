export default function TermsPage() {
  const effective = '1 May 2026'
  const H = (t: string) => (
    <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text)', marginTop: 36, marginBottom: 12, lineHeight: 1.3 }}>{t}</h2>
  )
  const P = (t: string) => <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 12 }}>{t}</p>
  const Li = (t: string) => <li style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 6, paddingLeft: 8 }}>{t}</li>

  return (
    <div>
      <div style={{ padding: '32px 0 24px', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
        <span style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.1em', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>Legal</span>
        <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--text)', lineHeight: 1.1, marginBottom: 10 }}>Terms of Service</h1>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>Effective: {effective} · Last updated: {effective}</p>
      </div>

      {H('1. Acceptance of terms')}
      {P("By accessing or using encore ('the platform', 'we', 'our'), you agree to be bound by these Terms of Service and all applicable laws. If you do not agree, do not use the platform. These terms apply to all users including visitors, registered members, and promoters.")}

      {H('2. Who we are')}
      {P("encore is a community platform for live music discovery and fan-written reviews, operating across Southeast Asia. We are not a ticketing platform, venue operator, or event promoter. We do not sell tickets and are not responsible for the events listed on the platform.")}

      {H('3. Eligibility')}
      {P("You must be at least 13 years of age to create an account. By registering, you confirm that the information you provide is accurate and that you will keep it current. Accounts may not be shared or transferred.")}

      {H('4. User accounts')}
      {P("You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. Notify us immediately at hello@encore.app if you suspect unauthorised access. We reserve the right to suspend or terminate accounts that violate these terms.")}

      {H('5. User content')}
      {P("encore is a user-generated content platform. By submitting reviews, comments, photos, or other content ('User Content'), you:")}
      <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
        {Li("Grant encore a non-exclusive, royalty-free, worldwide licence to use, display, reproduce, and distribute your content on the platform and in promotional materials.")}
        {Li("Confirm that your content is original, does not infringe third-party rights, and does not violate applicable law.")}
        {Li("Retain ownership of your content but accept that it may remain on the platform after account deletion in anonymised or aggregate form.")}
      </ul>
      {P("We reserve the right to remove any content that violates these terms, is misleading, abusive, or otherwise harmful, without prior notice.")}

      {H('6. Prohibited conduct')}
      {P("You may not use encore to:")}
      <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
        {Li("Post false, misleading, defamatory, or fraudulent reviews or content.")}
        {Li("Impersonate any person, artist, promoter, or organisation.")}
        {Li("Collect or harvest personal data from other users without consent.")}
        {Li("Upload malware, spam, or any content that disrupts the platform.")}
        {Li("Use automated tools to scrape, crawl, or extract data without written permission.")}
        {Li("Post content that is unlawful, obscene, hateful, or otherwise objectionable.")}
        {Li("Manipulate ratings or reviews through coordinated, inauthentic behaviour.")}
      </ul>

      {H('7. Promoter registrations')}
      {P("Promoters who register interest through the platform are added to an early-access list. Registration does not constitute a contract, guarantee of listing, or commitment of any service by encore. Promoter tools are in development and subject to change.")}

      {H('8. Intellectual property')}
      {P("All platform content, branding, design, software, and trademarks are the property of encore or its licensors. You may not copy, reproduce, modify, or distribute any part of the platform without written consent.")}

      {H('9. Third-party links')}
      {P("encore may contain links to third-party websites including ticketing platforms and promoter sites. We are not responsible for the content, privacy practices, or accuracy of third-party sites. Links do not constitute an endorsement.")}

      {H('10. Disclaimers')}
      {P("The platform is provided 'as is' without warranties of any kind. We do not guarantee the accuracy of reviews, event listings, or user-submitted content. encore is not liable for decisions made based on content found on the platform, including ticket purchases, event attendance, or any resulting loss.")}

      {H('11. Limitation of liability')}
      {P("To the fullest extent permitted by law, encore and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform. Our total liability to you for any claim shall not exceed the amount you paid to us in the 12 months preceding the claim, or RM100, whichever is greater.")}

      {H('12. Governing law')}
      {P("These terms are governed by and construed in accordance with the laws of Malaysia. Any disputes shall be subject to the exclusive jurisdiction of the courts of Kuala Lumpur, Malaysia.")}

      {H('13. Changes to these terms')}
      {P("We may update these terms from time to time. We will notify registered users of material changes via email or in-app notice. Continued use of the platform after changes constitutes acceptance.")}

      {H('14. Contact')}
      {P("For questions about these terms, contact us at hello@encore.app.")}
    </div>
  )
}
