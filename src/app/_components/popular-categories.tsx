'use client'

import { motion } from 'framer-motion'
import { 
  Utensils, 
  HeartPulse, 
  Wrench, 
  ShoppingBag, 
  Key, 
  Home, 
  ArrowRight 
} from 'lucide-react'
import Link from 'next/link'

const popularCategories = [
  {
    name: 'Restaurantes',
    href: '/business?q=restaurante',
    icon: Utensils,
    color: 'text-red-500 bg-red-500/10',
    description: 'Bares e lanchonetes'
  },
  {
    name: 'Saúde',
    href: '/business?q=saude',
    icon: HeartPulse,
    color: 'text-emerald-500 bg-emerald-500/10',
    description: 'Clínicas e farmácias'
  },
  {
    name: 'Serviços',
    href: '/business?q=servicos',
    icon: Wrench,
    color: 'text-blue-500 bg-blue-500/10',
    description: 'Profissionais locais'
  },
  {
    name: 'Lojas',
    href: '/business?q=loja',
    icon: ShoppingBag,
    color: 'text-orange-500 bg-orange-500/10',
    description: 'Comércio em geral'
  },
  {
    name: 'Alugar Imóvel',
    href: '/imoveis?listingType=Aluguel',
    icon: Key,
    color: 'text-purple-500 bg-purple-500/10',
    description: 'Casas e apartamentos'
  },
  {
    name: 'Comprar Imóvel',
    href: '/imoveis?listingType=Venda',
    icon: Home,
    color: 'text-indigo-500 bg-indigo-500/10',
    description: 'Invista no seu futuro'
  },
]

export function PopularCategories() {
  return (
    <section className="bg-slate-50 py-16 dark:bg-slate-900/50 md:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
          <div className="text-center md:text-left">
            <h2 className="font-bold text-3xl tracking-tight text-slate-900 lg:text-4xl dark:text-slate-100">
              O que você procura?
            </h2>
            <p className="mt-2 text-muted-foreground">Explore as categorias mais acessadas em Carangola.</p>
          </div>
          <Link 
            href="/explorar" 
            className="flex items-center gap-2 font-semibold text-primary text-sm hover:underline"
          >
            Ver todas as categorias <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {popularCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <Link
                href={category.href}
                className="group flex h-full flex-col items-center rounded-3xl border bg-white p-6 text-center shadow-sm transition-all hover:border-primary/50 hover:shadow-xl dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <div
                  className={`mb-4 flex size-16 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 group-hover:rotate-3 ${category.color}`}
                >
                  <category.icon className="size-8" />
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <h3 className="mb-1 line-clamp-2 font-bold text-slate-900 leading-tight dark:text-slate-100">
                    {category.name}
                  </h3>
                  <p className="hidden text-[10px] text-muted-foreground sm:line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
