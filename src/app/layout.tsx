import '@/styles/globals.css'

import type { Metadata } from 'next'
import { Quicksand } from 'next/font/google'
import { Toaster } from 'sonner'

import { GoogleAnalytics } from '@next/third-parties/google'

import { CookieBanner } from '@/components/commons/cookie-banner'
import { Footer } from '@/components/commons/footer'
import { HeaderHome } from '@/components/commons/headers'
import { PageTransition, StairTransition } from '@/components/effects'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/providers/theme-provider'
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
    <html lang="pt" suppressHydrationWarning>
      <body
        className={cn(
          'bg-background text-content-body antialiased ',
          quicksand.className
        )}
      >
        <ThemeProvider>
          <StairTransition />
          <PageTransition>
            <HeaderHome />
            {children}
            <CookieBanner />
          </PageTransition>
        </ThemeProvider>

        <Toaster richColors position="top-right" />
        <Footer />
      </body>
      <GoogleAnalytics gaId={serverEnv.ANALYTICS_GOOGLE_ID} />
    </html>
  )
}
