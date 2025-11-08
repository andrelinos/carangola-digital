import type { Metadata } from 'next'
import { getServerSession } from 'next-auth/next'
import Image from 'next/image'
import Link from 'next/link'

import { manageAuth } from '@/actions/manage-auth'
import { Button } from '@/components/ui/button'

import { getLatestPublicProfiles } from '@/actions/business/get-latest-public-profiles'
import SearchFormBusiness from '@/components/form-search'
import { authOptions } from '@/lib/auth'
import { trackServerEvent } from '@/lib/mixpanel'
import { getOperatingStatus } from '@/utils/get-status-from-day'

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

const latestPublicProfiles = await getLatestPublicProfiles()

export default async function Home() {
  const session = await getServerSession(authOptions)

  const hasProfileLink = session?.user?.hasProfileLink || false

  trackServerEvent('page_view', {
    page: 'home',
  })

  return (
    <>
      <div className="size-full px-4 py-36">
        <div className="flex size-full flex-1 flex-col items-center justify-center">
          <h1 className=" max-w-2xl text-center font-bold text-3xl lg:text-5xl">
            Encontre e compartilhe estabelecimentos e serviços
          </h1>
          <p className="my-4 max-w-2xl text-center">
            Estamos aqui para facilitar a sua vida em Carangola — conectando
            você com o que precisa e ajudando a compartilhar de forma simples e
            rápida.
          </p>

          <SearchFormBusiness />
          <h2 className="mt-6 w-full py-2 text-center text-2xl">
            Últimos adicionados
          </h2>
          <div className="mt-6 flex w-full max-w-5xl flex-wrap justify-around gap-6">
            {latestPublicProfiles?.map((profile, index) => (
              <Link
                key={profile?.id + String(index)}
                href={`/business/${profile.slug}`}
                className="group h-[300px] w-[332px] overflow-hidden rounded-lg bg-zinc-50 py-4 font-medium text-zinc-700 transition-all duration-300 ease-in-out hover:bg-blue-100"
                // target="_blank"
              >
                <div className="flex w-full flex-col gap-2">
                  <div className="flex h-14 w-full items-center justify-center">
                    {getOperatingStatus({
                      schedule: profile.openingHours as any,
                      currentTime: new Date(),
                      openingHours: profile.openingHours,
                    })}
                  </div>
                  <div className="relative flex h-24 w-full items-center justify-center overflow-hidden ">
                    <div className="z-10 h-full max-h-24 w-auto max-w-24 shadow-md lg:max-h-24">
                      <Image
                        width={100}
                        height={100}
                        className="size-full object-cover"
                        src={profile.logoImageUrl || '/default-image.png'}
                        alt={profile.name}
                        priority
                      />
                    </div>

                    <Image
                      id="background-image"
                      loading="eager"
                      src={profile?.logoImageUrl || '/default-image.png'}
                      className="absolute z-0 size-full object-cover object-center opacity-90 blur-md"
                      alt={profile?.name || ''}
                      quality={10}
                      fill
                      unoptimized
                      priority
                    />
                  </div>
                  <div className="flex-1 px-4">
                    <h2 className="text-center font-semibold text-xl">
                      {profile.name}
                    </h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {!hasProfileLink && (
            <form action={manageAuth} className="w-full max-w-xs pt-16">
              <Button className="w-full bg-orange-500">
                Anunciar seu negócio
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
