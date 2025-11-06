'use client'

/*
================================================================================
COMPONENTE 2: Categorias Populares
================================================================================
*/

import {
  Football,
  Healthcare,
  HomeAlt,
  Key,
  ShoppingBag,
  Wrench,
} from 'iconoir-react'
import Link from 'next/link'
const popularCategories = [
  {
    name: 'Restaurantes',
    href: '/business?q=restaurante',
    icon: Football,
    color: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
  },
  {
    name: 'Saúde',
    href: '/business?q=saude',
    icon: Healthcare,
    color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-400',
  },
  {
    name: 'Serviços',
    href: '/business?q=servicos',
    icon: Wrench,
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-400',
  },
  {
    name: 'Lojas',
    href: '/business?q=loja',
    icon: ShoppingBag,
    color:
      'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400',
  },
  {
    name: 'Alugar Imóvel',
    href: '/imoveis?listingType=alugar',
    icon: Key,
    color:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400',
  },
  {
    name: 'Comprar Imóvel',
    href: '/imoveis?listingType=comprar',
    icon: HomeAlt,
    color:
      'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400',
  },
]

export function PopularCategories() {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-center font-bold text-3xl text-slate-900 dark:text-slate-100">
          Aqui você encontra
        </h2>
        <div className="grid grid-cols-2 gap-4 px-6 sm:grid-cols-3 lg:grid-cols-6">
          {popularCategories.map(category => (
            <Link
              key={category.name}
              href={category.href}
              className="group hover:-translate-y-1 flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md transition-all hover:shadow-lg dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <div
                className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-all group-hover:scale-110 ${category.color}`}
              >
                <category.icon className="h-8 w-8" />
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
