/*
================================================================================
COMPONENTE 1: HomeHero (com busca por abas)
================================================================================
*/
// Este precisa ser um Client Component para gerenciar o estado das abas
'use client'

import { Link } from '@/components/ui/link'
import { useState } from 'react'

export function HomeHero() {
  const [activeTab, setActiveTab] = useState<'businesses' | 'properties'>(
    'businesses'
  )

  return (
    <section className="bg-linear-to-br from-blue-700 to-blue-900 py-16 text-white dark:from-blue-800 dark:to-blue-950">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <h1 className="mb-4 font-bold text-4xl md:text-5xl">
          O que você procura em Carangola?
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-blue-100 text-lg">
          Encontre os melhores estabelecimentos, serviços e imóveis da região.
        </p>

        {/* --- Container do Buscador com Abas --- */}
        <div className="mx-auto flex max-w-3xl flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/business"
            className="flex-1 bg-white font-semibold text-primary hover:cursor-pointer hover:bg-gray-100"
          >
            Estabelecimentos
          </Link>
          <Link
            variant="outline"
            href="/imoveis"
            size="lg"
            className="h-11 flex-1 border-2 border-white px-8 font-semibold text-white hover:bg-white hover:text-primary"
          >
            Imoveis
          </Link>
        </div>
      </div>
    </section>
  )
}
