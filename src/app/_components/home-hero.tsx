'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  Building2,
  Map as LucideMap,
  Search,
  Store,
} from 'lucide-react'
import Link from 'next/link'

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-blue-700 via-blue-800 to-indigo-950 py-24 text-white lg:py-40 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 size-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-1/4 -right-20 size-80 rounded-full bg-indigo-500/10 blur-3xl" />
        {/* Subtle Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[20px_20px] opacity-[0.03]" />
      </div>

      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 shadow-lg backdrop-blur-md"
          >
            <LucideMap className="size-4 text-blue-300" />
            <span className="font-medium text-sm tracking-wide">
              Tudo o que você precisa em Carangola
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 max-w-4xl font-extrabold text-4xl text-white leading-tight tracking-tight md:text-6xl lg:text-7xl"
          >
            O Guia Completo de <span className="text-blue-300">Carangola</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mb-12 max-w-2xl text-blue-100/80 text-lg md:text-xl lg:leading-relaxed"
          >
            Explore os melhores comércios, serviços locais e encontre o imóvel
            dos seus sonhos com agilidade e segurança no portal mais moderno da
            região.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2"
          >
            {/* Quick Access Cards */}
            <Link
              href="/business"
              className="group relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 hover:shadow-2xl"
            >
              <div className="mb-4 flex size-20 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-xl transition-transform group-hover:scale-110">
                <Store className="size-10 stroke-[1.5]" />
              </div>
              <h3 className="mb-2 font-bold text-2xl text-white">
                Guia Comercial
              </h3>
              <p className="mb-4 text-center text-blue-100/70 text-sm">
                Encontre lojas, restaurantes e serviços locais.
              </p>
              <div className="flex items-center gap-2 font-semibold text-blue-300 transition-all group-hover:gap-3">
                Explorar empresas <ArrowRight className="size-4" />
              </div>
            </Link>

            <Link
              href="/imoveis"
              className="group relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 hover:shadow-2xl"
            >
              <div className="mb-4 flex size-20 items-center justify-center rounded-2xl bg-white text-indigo-700 shadow-xl transition-transform group-hover:scale-110">
                <Building2 className="size-10 stroke-[1.5]" />
              </div>
              <h3 className="mb-2 font-bold text-2xl text-white">
                Mercado Imobiliário
              </h3>
              <p className="mb-4 text-center text-blue-100/70 text-sm">
                Encontre o imóvel perfeito para morar ou investir.
              </p>
              <div className="flex items-center gap-2 font-semibold text-blue-300 transition-all group-hover:gap-3">
                Ver imóveis <ArrowRight className="size-4" />
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 flex flex-wrap justify-center gap-8 text-blue-100/40"
          >
            {/* Social Proof / Stats placeholder */}
            <div className="flex items-center gap-2">
              <Search className="size-5" />
              <span className="text-sm">Centenas de acessos diários</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
