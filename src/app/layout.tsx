import '@/styles/globals.css'

import { GoogleAnalytics } from '@next/third-parties/google'

import type { Metadata } from 'next'
import { Quicksand } from 'next/font/google'

import { cn } from '@/lib/utils'
import { serverEnv } from '@/utils/env'

const quicksand = Quicksand({
  variable: '--font-quicksand',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Carangola Digital',
  description: 'Tenha a cidade ao seu alcance!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn('text-zinc-700 antialiased', quicksand.className)}>
        {children}
      </body>
      <GoogleAnalytics gaId={serverEnv.ANALYTICS_GOOGLE_ID} />
    </html>
  )
}
