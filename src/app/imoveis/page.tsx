import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getServerSession } from 'next-auth/next'

import { getLatestPublicProperties } from '@/actions/properties/get-latest-public-properties'
import { authOptions } from '@/lib/auth'
import { trackServerEvent } from '@/lib/mixpanel'
import { formatPrice } from '@/utils/format-price'

import { ClientHero } from './_components/client-hero'
import { RegistrationCTA } from './_components/registration-cta'

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

const latestPublicProperties = await getLatestPublicProperties()

export default async function PropertiesPage() {
  const session = await getServerSession(authOptions)

  trackServerEvent('page_view', {
    page: 'properties',
  })

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero Section */}
      <ClientHero />

      {/* Latest Properties Grid */}
      {latestPublicProperties && latestPublicProperties.length > 0 && (
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
                      <Image
                        fill
                        className="object-cover"
                        src={'/default-image.webp'}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        alt={property.title}
                        priority
                      />
                    )}
                  </div>
                  {/* Informações */}
                  <div className="flex flex-1 flex-col justify-between px-4 py-4">
                    <h2 className="line-clamp-2 text-center font-semibold text-xl">
                      {property.title}
                    </h2>

                    {property?.type && (
                      <p className="text-center text-gray-600 text-sm capitalize">
                        {property.type === 'rent' ? 'Para Alugar' : 'À Venda'}
                      </p>
                    )}

                    {property?.price && (
                      <p className="mt-auto text-center font-bold text-blue-600 text-lg">
                        {formatPrice(Number(property.price))}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Call to Action Section */}
      <RegistrationCTA hasSession={!!session} />
    </div>
  )
}
