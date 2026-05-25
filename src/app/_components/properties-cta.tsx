'use client'

import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function PropertiesCTA() {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-20 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[30px_30px] opacity-5" />

      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <h2 className="mb-6 font-bold text-3xl md:text-5xl lg:leading-tight">
              Anuncie seu Imóvel no <br />
              <span className="font-extrabold text-blue-400 italic">
                Maior Portal de Carangola
              </span>
            </h2>
            <p className="mb-8 text-lg text-slate-400 md:text-xl">
              Seja você proprietário ou corretor, nosso portal é o lugar certo
              para dar visibilidade ao seu imóvel e fechar negócio rápido.
            </p>

            <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-blue-600 px-8 font-bold text-white shadow-xl hover:bg-blue-700"
              >
                <Link href="/dashboard/imoveis#anunciar">Anunciar grátis</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-slate-700 bg-slate-800/50 px-8 font-bold text-white hover:bg-slate-800"
              >
                <Link href="/como-funciona">Saber mais</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl border border-slate-800 bg-slate-800/30 p-8 backdrop-blur-sm lg:p-12"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[
                'Exposição Regional',
                'Gestão Simplificada',
                'Fotos Ilimitadas',
                'Contato Direto',
                'SEO Otimizado',
                'Suporte Local',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex size-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <span className="font-medium text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
