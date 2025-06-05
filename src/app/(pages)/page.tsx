import type { Metadata } from 'next'

import { manageAuth } from '@/actions/manage-auth'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import { trackServerEvent } from '@/lib/mixpanel'
import { getSEOTags } from '@/lib/seo'

import SearchFormBusiness from '@/components/form-search'

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
