import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/components/session-provider'

export const metadata: Metadata = {
  title: 'encore — The home of live music in Southeast Asia',
  description: 'Discover upcoming shows, read fan reviews, and follow the live music scene across Malaysia, Singapore, Thailand, Indonesia, and the Philippines.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
