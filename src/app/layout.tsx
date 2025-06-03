import '@/styles/globals.css'

import type { Metadata } from 'next'
import { Quicksand } from 'next/font/google'
import { Toaster } from 'sonner'

import { GoogleAnalytics } from '@next/third-parties/google'

import { PageTransition, StairTransition } from '@/components/effects'
import { cn } from '@/lib/utils'
import { serverEnv } from '@/utils/env'

const quicksand = Quicksand({
  variable: '--font-quicksand',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Carangola Digital',
  description: 'Tenha a cidade ao seu alcance!',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('text-zinc-700 antialiased', quicksand.className)}>
        <StairTransition />
        <PageTransition>{children}</PageTransition>
        <Toaster richColors position="top-right" />
      </body>
      <GoogleAnalytics gaId={serverEnv.ANALYTICS_GOOGLE_ID} />
    </html>
  )
}
