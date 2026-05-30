import type { Metadata } from 'next'
import { DM_Sans, Unbounded, Syne } from 'next/font/google'
import './globals.css'
import { SessionProvider } from '@/components/session-provider'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const unbounded = Unbounded({
  subsets: ['latin'],
  variable: '--font-unbounded',
  weight: ['700', '800'],
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['800'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://enc.asia'),
  title: {
    default: 'encore — Was it worth showing up?',
    template: '%s · encore',
  },
  description: 'Fan reviews of concerts, gigs, and festivals across Malaysia. Find your next show — or relive the last one.',
  keywords: ['concerts malaysia', 'live music malaysia', 'concert reviews', 'gig guide kl', 'kuala lumpur concerts', 'encore app'],
  authors: [{ name: 'encore' }],
  creator: 'encore',
  publisher: 'Studio Bayangan Enterprise',
  openGraph: {
    type: 'website',
    locale: 'en_MY',
    url: 'https://enc.asia',
    siteName: 'encore',
    title: 'encore — Was it worth showing up?',
    description: 'Fan reviews of concerts, gigs, and festivals across Malaysia.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'encore' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'encore — Was it worth showing up?',
    description: 'Fan reviews of concerts, gigs, and festivals across Malaysia.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${unbounded.variable} ${syne.variable}`}>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
