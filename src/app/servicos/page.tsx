import type { Metadata } from 'next'
import { Briefcase, Search } from 'lucide-react'
import { getPaginatedServices } from '@/actions/services/get-paginated-services'
import { searchServices } from '@/actions/services/search-services'
import { ServicesSearchClient } from './_components/services-search-client'

export const metadata: Metadata = {
  title: 'Serviços em Carangola | Carangola Digital',
  description:
    'Encontre prestadores de serviços em Carangola/MG: diaristas, pedreiros, eletricistas, pintores, aulas particulares e muito mais. Contrate diretamente pelo WhatsApp.',
  alternates: {
    canonical: 'https://carangoladigital.com.br/servicos',
  },
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ServicosPage(props: PageProps) {
  const searchParams = await props.searchParams
  const category = (searchParams.cat as string) || 'Todos'
  const searchTerm = (searchParams.q as string) || ''

  let initialResult: {
    services: Awaited<ReturnType<typeof getPaginatedServices>>['services']
    lastDocId: string | null
    hasMore: boolean
  }

  if (searchTerm && searchTerm.trim().length >= 3) {
    const searchResults = await searchServices(searchTerm)
    const filtered =
      category !== 'Todos'
        ? searchResults.filter(s => s.category === category)
        : searchResults

    initialResult = { services: filtered, lastDocId: null, hasMore: false }
  } else {
    initialResult = await getPaginatedServices(
      category === 'Todos' ? null : category,
      null,
      12
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background py-14">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-primary text-sm font-semibold">
            <Briefcase className="size-4" />
            Marketplace de Serviços
          </div>
          <h1 className="font-bold text-4xl tracking-tight md:text-5xl">
            Encontre prestadores
            <br />
            <span className="text-primary">em Carangola</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground text-lg">
            Conecte-se diretamente com profissionais locais. Diaristas,
            eletricistas, pintores, professores e muito mais.
          </p>
        </div>
      </section>

      {/* Search + filters + grid */}
      <section className="container mx-auto flex-1 px-4 py-10" id="resultados">
        <ServicesSearchClient
          initialResult={initialResult}
          initialCategory={category}
          initialSearchTerm={searchTerm}
        />
      </section>
    </div>
  )
}
