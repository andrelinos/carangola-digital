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
  metadataBase: new URL('https://carangoladigital.com.br'),

  title: 'Carangola Digital | Guia Comercial e Imóveis',
  description:
    'Encontre lojas, serviços, imóveis para aluguel e venda em Carangola. O Carangola Digital é o guia comercial completo da cidade. Cadastre seu negócio!',
  keywords: [
    'Carangola',
    'Carangola Digital',
    'Guia Comercial',
    'Negócios Locais',
    'Imóveis',
    'Lojas',
    'Serviços',
    'Empresas',
    'Aluguel de Imóveis',
    'Venda de Imóveis',
    'Comércio Local',
    'Diretório de Empresas',
  ],

  openGraph: {
    title: 'Carangola Digital | Guia Comercial e Imóveis',
    description: 'Encontre lojas, serviços e imóveis em Carangola.',
    url: 'https://carangoladigital.com.br/',
    siteName: 'Carangola Digital',
    images: [
      {
        url: 'https://carangoladigital.com.br/images/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'pt-BR',
    type: 'website',
  },

  alternates: {
    canonical: '/',
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
