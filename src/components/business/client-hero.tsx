'use client'

import { motion } from 'framer-motion'
import { Rocket } from 'lucide-react'
import SearchFormBusiness from '@/components/form-search'

export function ClientHero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-primary/5 via-background to-background pb-20 pt-32 lg:pb-32 lg:pt-48">
      {/* Decorative Circles */}
      <div className="absolute -top-24 -left-20 size-96 rounded-full bg-primary/5 blur-3xl opacity-60" />
      <div className="absolute top-1/4 -right-20 size-80 rounded-full bg-secondary/10 blur-3xl opacity-40" />

      <div className="container relative mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-primary text-sm font-medium"
          >
            <Rocket className="mr-2 size-4" />
            O guia mais completo da cidade
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl font-extrabold text-4xl tracking-tight text-foreground lg:text-7xl"
          >
            Conecte-se com o melhor de <span className="text-primary">Carangola</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg text-muted-foreground lg:text-xl"
          >
            Facilitamos o encontro entre você e os melhores serviços e lojas locais. 
            Encontre o que precisa de forma rápida, simples e moderna.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 w-full"
          >
            <SearchFormBusiness />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
