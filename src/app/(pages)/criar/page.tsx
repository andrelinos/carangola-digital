import { Rocket } from 'lucide-react'
import type { Metadata } from 'next'

// import { Header } from '@/components/commons/headers'
import { trackServerEvent } from '@/lib/mixpanel'

import { CreateLinkForm } from './create-link-form'

export const metadata: Metadata = {
  title: 'Carangola Digital - Anunciar',
  description: 'Anuncie seu negócio no Carangola Digital',
}

export default function CreatePage() {
  trackServerEvent('create_page', {
    page: 'create',
  })

  return (
    <div>
      {/* <Header /> */}
      <div className="mx-auto flex h-screen max-w-xl flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-4xl ">Escolha seu link</h1>
          <Rocket className="size-10" />
        </div>
        <CreateLinkForm />
        <div>
          O criado, será o endereço de sua página de perfil no Carangola
          Digital. Ou seja, se você criar um link para o seu perfil, o link será
          algo como: https://carangoladigital.com.br/seu-nome.
        </div>
      </div>
    </div>
  )
}
