import type { Metadata } from 'next'
import { getServerSession } from 'next-auth/next'

import { getFeaturedProfiles } from '@/actions/business/get-featured-profiles'
import { getPaginatedProfiles } from '@/actions/business/get-paginated-profiles'
import { searchBusinesses } from '@/actions/business/search-businesses'
import { ClientFeaturedGrid } from '@/components/business/client-featured-grid'
import { ClientHero } from '@/components/business/client-hero'
import { RegistrationCTA } from '@/components/business/registration-cta'
import { authOptions } from '@/lib/auth'
import { trackServerEvent } from '@/lib/mixpanel'
import { BusinessSearchClient } from './_components/business-search-client'

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

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BusinessLandingPage(props: PageProps) {
  const searchParams = await props.searchParams
  const session = await getServerSession(authOptions)
  const featuredProfiles = await getFeaturedProfiles()

  const category = (searchParams.cat as string) || 'Todos'
  const searchTerm = (searchParams.q as string) || ''
  const distance = (searchParams.dist as string) || 'any'

  trackServerEvent('page_view', {
    page: 'business_home',
  })

  // Unified Hydration: If searchTerm is present, search text. Else, search category.
  let initialProfiles: any

  if (searchTerm && searchTerm.trim().length >= 3) {
    const searchResults = await searchBusinesses(searchTerm)

    // Local filter by category if needed
    const filteredResults =
      category !== 'Todos'
        ? searchResults.filter(
            p => p.category === category || p.categories?.includes(category)
          )
        : searchResults

    initialProfiles = {
      profiles: filteredResults,
      lastDocId: null,
      hasMore: false,
    }
  } else {
    initialProfiles = await getPaginatedProfiles(
      category === 'Todos' ? null : category,
      null,
      12
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero Section */}
      <ClientHero />

      {/* Featured Companies Grid */}
      {featuredProfiles &&
        featuredProfiles.length > 0 &&
        category === 'Todos' &&
        !searchTerm && (
          <section className="relative overflow-hidden bg-slate-50 py-16 dark:bg-slate-900/50">
            <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:bg-[url('/images/grid-dark.svg')]" />
            <div className="container relative mx-auto">
              <div className="mb-12 flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:items-end">
                <div className="text-center md:text-left">
                  <h2 className="font-bold text-3xl tracking-tight lg:text-4xl">
                    Empresas em Destaque
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Nossa curadoria com os melhores negócios da cidade.
                  </p>
                </div>
              </div>

              <ClientFeaturedGrid profiles={featuredProfiles} />
            </div>
          </section>
        )}

      {/* Search and Explore Section */}
      <section className="container mx-auto px-4" id="resultados">
        <BusinessSearchClient
          initialProfiles={initialProfiles}
          initialCategory={category}
          initialSearchTerm={searchTerm}
          initialDistance={distance}
        />
      </section>

      {/* Call to Action Section */}
      <RegistrationCTA hasSession={!!session} />
    </div>
  )
}
