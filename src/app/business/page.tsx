import type { Metadata } from 'next'
import { getServerSession } from 'next-auth/next'

import { getLatestPublicProfiles } from '@/actions/business/get-latest-public-profiles'
import { ClientFeaturedGrid } from '@/components/business/client-featured-grid'
import { ClientHero } from '@/components/business/client-hero'
import { RegistrationCTA } from '@/components/business/registration-cta'
import { authOptions } from '@/lib/auth'
import { trackServerEvent } from '@/lib/mixpanel'

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

export default async function BusinessLandingPage() {
  const session = await getServerSession(authOptions)
  const latestPublicProfiles = await getLatestPublicProfiles()

  const hasProfileLink = session?.user?.hasProfileLink || false

  trackServerEvent('page_view', {
    page: 'business_home',
  })

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero Section */}
      <ClientHero />

      {/* Featured Companies Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
          <div className="text-center md:text-left">
            <h2 className="font-bold text-3xl tracking-tight lg:text-4xl">
              Empresas em Destaque
            </h2>
            <p className="mt-2 text-muted-foreground">
              Os negócios que movem a nossa cidade em um só lugar.
            </p>
          </div>
          <div className="h-1 w-20 rounded-full bg-primary/20 md:hidden" />
        </div>

        {latestPublicProfiles && latestPublicProfiles.length > 0 ? (
          <ClientFeaturedGrid profiles={latestPublicProfiles} />
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={String(i)}
                className="h-[400px] w-full animate-pulse rounded-2xl bg-muted"
              />
            ))}
          </div>
        )}
      </section>

      {/* Call to Action Section */}
      {!hasProfileLink && <RegistrationCTA />}


    </div>
  )
}
