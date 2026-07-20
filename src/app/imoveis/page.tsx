import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getServerSession } from 'next-auth/next'

import { getLatestPublicProperties } from '@/actions/properties/get-latest-public-properties'
import { getPaginatedProperties } from '@/actions/properties/get-paginated-properties'
import { PropertiesCTA } from '@/app/_components/properties-cta'
import { authOptions } from '@/lib/auth'
import { trackServerEvent } from '@/lib/mixpanel'
import { ClientHero } from './_components/client-hero'
import { PropertiesSearchClient } from './_components/properties-search-client'

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

export default async function PropertiesPage(props: PageProps) {
  const searchParams = await props.searchParams
  const session = await getServerSession(authOptions)

  const category = (searchParams.cat as string) || 'Todos'
  const listingType = (searchParams.listingType as string) || 'Todos'
  const searchTerm = (searchParams.q as string) || ''

  trackServerEvent('page_view', {
    page: 'properties',
  })

  const latestPublicProperties = await getLatestPublicProperties()

  // Unified Hydration: If searchTerm is present, search text. Else, fetch paginated.
  let initialProperties: any

  if (searchTerm && searchTerm.trim().length >= 3) {
    const { searchProperties } = await import(
      '@/actions/properties/search-properties'
    )
    const searchResults = await searchProperties(searchTerm)

    // Local filter by category and listingType if needed
    let filteredResults = searchResults

    if (category !== 'Todos') {
      filteredResults = filteredResults.filter(p => p.type === category)
    }

    if (listingType !== 'Todos') {
      filteredResults = filteredResults.filter(
        p => p.listingType === listingType
      )
    }

    initialProperties = {
      properties: filteredResults,
      lastDocId: null,
      hasMore: false,
    }
  } else {
    initialProperties = await getPaginatedProperties(
      category === 'Todos' ? null : category,
      null,
      12
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero Section */}
      <ClientHero />

      {/* Latest Properties Grid (Only show if no filters) */}
      {latestPublicProperties &&
        latestPublicProperties.length > 0 &&
        category === 'Todos' &&
        listingType === 'Todos' &&
        !searchTerm && (
          <section className="container mx-auto px-4 py-16">
            <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
              <div className="text-center md:text-left">
                <h2 className="font-bold text-3xl tracking-tight lg:text-4xl">
                  Últimos imóveis adicionados
                </h2>
                <p className="mt-2 text-muted-foreground">
                  As melhores opções de casas, apartamentos e lotes para você.
                </p>
              </div>
              <div className="h-1 w-20 rounded-full bg-primary/20 md:hidden" />
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {latestPublicProperties.map(property => (
                <div key={property.id} className="flex justify-center">
                  <Link
                    href={`/imoveis/${property.slug}`}
                    className="group flex h-[360px] w-full max-w-[332px] flex-col overflow-hidden rounded-lg bg-zinc-50 font-medium text-zinc-700 shadow-md transition-all duration-300 ease-in-out hover:bg-blue-100"
                  >
                    <div className="relative h-48 w-full shrink-0">
                      {property?.thumbnail ? (
                        <Image
                          fill
                          className="object-cover"
                          src={property?.thumbnail || '/default-image.webp'}
                          alt={property.title}
                          priority
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-zinc-200">
                          <span className="text-zinc-400">Sem imagem</span>
                        </div>
                      )}
                      {property.isPublished && (
                        <div className="absolute top-4 left-4 rounded bg-emerald-500 px-2 py-1 font-bold text-white text-xs">
                          Disponível
                        </div>
                      )}
                      <div className="absolute top-4 right-4 rounded bg-white/90 px-2 py-1 font-bold text-xs text-zinc-900 shadow-sm">
                        {property.listingType}
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-4">
                      <div>
                        <h3 className="line-clamp-2 font-bold text-lg text-zinc-900 leading-tight">
                          {property.title}
                        </h3>
                        <p className="mt-1 line-clamp-1 text-sm text-zinc-500">
                          {property.neighborhood}, {property.city}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-black text-primary text-xl">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(property.price)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

      {/* Search and Explore Section */}
      <section className="container mx-auto px-4" id="explorar">
        <PropertiesSearchClient
          initialProperties={initialProperties}
          initialCategory={category}
          initialListingType={listingType}
          initialSearchTerm={searchTerm}
        />
      </section>

      {/* Call to Action Section */}
      <PropertiesCTA />
    </div>
  )
}
