import { Building } from 'iconoir-react'
import { StoreIcon } from 'lucide-react'

import { Link } from '@/components/ui/link'

export function HomeHero() {
  return (
    <section className="bg-linear-to-br from-blue-700 to-blue-900 py-32 text-white dark:from-blue-800 dark:to-blue-950">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <h1 className="mb-4 font-bold text-4xl md:text-5xl">
          O que você procura em Carangola?
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-blue-100 text-lg">
          Encontre os melhores estabelecimentos, serviços e imóveis da região.
        </p>

        <div className="mx-auto flex max-w-3xl flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/business"
            className="flex h-44 flex-1 flex-col items-center bg-white p-6 font-semibold text-primary hover:cursor-pointer hover:bg-gray-100"
          >
            <StoreIcon className="size-16 stroke-1" />
            <span className="text-2xl">Estabelecimentos</span>
          </Link>
          <Link
            variant="outline"
            href="/imoveis"
            size="lg"
            className="flex h-44 flex-1 flex-col items-center border-2 border-white px-8 font-semibold text-white hover:bg-white hover:text-primary"
          >
            <Building className="size-16 stroke-1" />
            <span className="text-2xl">Imóveis</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
