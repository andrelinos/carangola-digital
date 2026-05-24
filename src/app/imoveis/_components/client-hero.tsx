'use client'

import { motion } from 'framer-motion'
import { Home } from 'lucide-react'
import SearchFormProperties from './form-search-properties'

export function ClientHero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-primary/5 via-background to-background pt-32 pb-20 lg:pt-48 lg:pb-32">
      {/* Decorative Circles */}
      <div className="absolute -top-24 -left-20 size-96 rounded-full bg-primary/5 opacity-60 blur-3xl" />
      <div className="absolute top-1/4 -right-20 size-80 rounded-full bg-secondary/10 opacity-40 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 font-medium text-primary text-sm"
          >
            <Home className="mr-2 size-4" />O melhor lugar para morar ou investir
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl font-extrabold text-4xl text-foreground tracking-tight lg:text-7xl"
          >
            Encontre o imóvel ideal em{' '}
            <span className="text-primary">Carangola</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg text-muted-foreground lg:text-xl"
          >
            Explore nossa lista de casas, apartamentos e lotes disponíveis em
            Carangola e região para alugar ou vender.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 w-full"
          >
            <SearchFormProperties />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
