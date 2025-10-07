import type { Metadata } from 'next'

import { manageAuth } from '@/actions/manage-auth'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import { trackServerEvent } from '@/lib/mixpanel'
import { getSEOTags } from '@/lib/seo'

import { getLatestPublicProfiles } from '@/actions/get-latest-public-profiles'
import SearchFormBusiness from '@/components/form-search'
import { getOperatingStatus } from '@/utils/get-status-from-day'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = getSEOTags({
  appName: 'Carangola Digital',
  appDescription:
    'Carangola Digital é uma plataforma para divulgar negócios locais.',
  locale: 'pt-BR',
  keywords: [
    'Carangola',
    'Carangola Digital',
    'link na bio',
    'negócios',
    'redes sociais',
    'link',
  ],
  appDomain: 'https://carangoladigital.com.br/',
  canonicalUrlRelative: '/',
})

const latestPublicProfiles = await getLatestPublicProfiles()

export default async function Home() {
  const session = await auth()

  const hasProfileLink = session?.user?.hasProfileLink || false

  trackServerEvent('page_view', {
    page: 'home',
  })

  return (
    <>
      <div className="size-full px-4 py-36">
        <div className="flex size-full flex-1 flex-col items-center justify-center">
          <h1 className=" max-w-2xl text-center font-bold text-3xl lg:text-5xl">
            Encontre em compartilhe estabelecimentos e serviços
          </h1>
          <p className="my-4 max-w-2xl text-center">
            Estamos aqui para facilitar a sua vida em Carangola — conectando
            você com o que precisa e ajudando a compartilhar de forma simples e
            rápida.
          </p>

          <SearchFormBusiness />
          <h2 className="mt-6 w-full bg-accent-green py-2 text-center text-2xl text-white">
            Últimos adicionados
          </h2>
          <div className="mt-6 flex w-full max-w-5xl flex-wrap justify-around gap-6">
            {latestPublicProfiles?.map((profile, index) => (
              <Link
                key={profile?.id + String(index)}
                href={`/${profile.id}`}
                className="group h-[300px] w-[332px] overflow-hidden rounded-lg bg-zinc-50 py-4 font-medium text-zinc-700 transition-all duration-300 ease-in-out hover:bg-blue-100"
                target="_blank"
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
