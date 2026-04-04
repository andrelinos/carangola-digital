'use client'

import { motion } from 'framer-motion'
import { Rocket, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function BusinessCTA() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-blue-600 to-indigo-800 py-20 text-white dark:from-blue-900 dark:to-slate-950">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[40px_40px]" />
      
      <div className="container relative z-10 mx-auto max-w-5xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 flex justify-center"
        >
          <div className="flex size-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
            <Rocket className="size-8" />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-6 font-bold text-3xl md:text-5xl"
        >
          Seu Negócio Merece <br className="hidden md:block" /> ser <span className="text-blue-200">Destaque</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mx-auto mb-10 max-w-2xl text-blue-100/80 text-lg md:text-xl"
        >
          Aumente sua visibilidade e atraia mais clientes em Carangola. 
          Junte-se às centenas de empresas que já transformam sua presença digital conosco.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col justify-center gap-4 sm:flex-row"
        >
          <Button
            asChild
            size="lg"
            className="bg-white px-8 font-bold text-blue-700 shadow-xl hover:bg-blue-50 dark:bg-white dark:text-blue-900"
          >
            <Link href="/dashboard/business?action=anunciar">
              Começar agora grátis
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/30 bg-white/5 px-8 font-bold text-white backdrop-blur-sm hover:bg-white/10"
          >
            <Link href="/como-funciona" className="inline-flex items-center gap-2">
              Ver benefícios <ArrowRight className="size-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
