import type { Metadata } from 'next'

import { manageAuth } from '@/actions/manage-auth'
import { Button } from '@/components/ui/button'

import { trackServerEvent } from '@/lib/mixpanel'
import { getSEOTags } from '@/lib/seo'

import { getLatestPublicProperties } from '@/actions/properties/get-latest-public-properties'

import { authOptions } from '@/lib/auth'
import { formatPrice } from '@/utils/format-price'
import { getServerSession } from 'next-auth/next'
import Image from 'next/image'
import Link from 'next/link'
import SearchFormProperties from './_components/form-search-properties'

// Metadados atualizados para Imóveis
export const metadata: Metadata = getSEOTags({
  appName: 'Carangola Digital - Imóveis',
  appDescription: 'Encontre imóveis para alugar ou vender em Carangola.',
  locale: 'pt-BR',
  keywords: [
    'Carangola',
    'Carangola Digital',
    'imóveis',
    'aluguel',
    'venda',
    'casa',
    'apartamento',
  ],
  appDomain: 'https://carangoladigital.com.br/',
  canonicalUrlRelative: '/properties',
})

const latestPublicProperties = await getLatestPublicProperties()

export default async function PropertiesPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  trackServerEvent('page_view', {
    page: 'properties',
  })

  return (
    <>
      <div className="size-full px-4 py-36">
        <div className="flex size-full flex-1 flex-col items-center justify-center">
          <h1 className=" max-w-2xl text-center font-bold text-3xl lg:text-5xl">
            Encontre imóveis para alugar ou vender
          </h1>
          <p className="my-4 max-w-2xl text-center">
            Explore nossa lista de casas, apartamentos e lotes disponíveis em
            Carangola e região.
          </p>

          <SearchFormProperties />

          <h2 className="mt-6 w-full py-2 text-center text-2xl">
            Últimos imóveis adicionados
          </h2>
          <div className="mt-6 flex w-full max-w-5xl flex-wrap justify-around gap-6">
            {latestPublicProperties?.map(property => (
              <Link
                key={property.id}
                href={`/imoveis/${property.slug}`} // Rota de detalhe do imóvel (precisa ser criada)
                className="group h-[320px] w-[332px] overflow-hidden rounded-lg bg-zinc-50 pb-4 font-medium text-zinc-700 shadow-md transition-all duration-300 ease-in-out hover:bg-blue-100"
              >
                <div className="flex h-full w-full flex-col gap-2">
                  <div className="relative h-48 w-full">
                    {property?.thumbnail ? (
                      <>
                        <Image
                          width={332}
                          height={192}
                          className="size-full object-cover"
                          src={property?.thumbnail || '/default-image.png'}
                          alt={property.title}
                          priority
                        />
                      </>
                    ) : (
                      <>
                        <Image
                          width={332}
                          height={192}
                          className="size-full object-cover"
                          src={'/default-image.png'}
                          alt={property.title}
                          priority
                        />
                      </>
                    )}
                  </div>
                  {/* Informações */}
                  <div className="flex flex-1 flex-col justify-between px-4">
                    <h2 className="text-center font-semibold text-xl">
                      {property.title}
                    </h2>

                    {property?.type && (
                      <p className="text-center text-gray-600 text-sm capitalize">
                        {property.type === 'rent' ? 'Para Alugar' : 'À Venda'}
                      </p>
                    )}

                    {property?.price && (
                      <p className="text-center font-bold text-blue-600 text-lg">
                        {formatPrice(Number(property.price))}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="w-full max-w-xs pt-16">
            {session ? (
              <Button asChild className="w-full bg-orange-500">
                <Link href="/dashboard/imoveis">Anunciar seu imóvel</Link>
              </Button>
            ) : (
              <form action={manageAuth} className="w-full">
                <Button className="w-full bg-orange-500">
                  Anunciar seu imóvel
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
