'use client'

import { TopNav, BottomNav, Footer, MobileHeader, S } from '@/components'

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="hidden lg:block">
        <TopNav />
        <div style={{ ...S.containerNarrow, paddingBottom: 80 }}>
          {children}
        </div>
        <Footer />
      </div>
      <div className="lg:hidden" style={{ paddingBottom: 80 }}>
        <MobileHeader />
        <div style={{ padding: '0 18px 48px' }}>
          {children}
        </div>
        <BottomNav />
      </div>
    </>
  )
}
