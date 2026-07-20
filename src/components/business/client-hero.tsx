'use client'

import { motion } from 'framer-motion'
import {
  HeartPulse,
  Rocket,
  ShoppingBag,
  Store,
  Utensils,
  Wrench,
} from 'lucide-react'
import SearchFormBusiness from '@/components/form-search'

const floatingIcons = [
  {
    icon: Utensils,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    delay: 0,
  },
  { icon: Store, color: 'text-blue-500', bg: 'bg-blue-500/10', delay: 0.2 },
  {
    icon: HeartPulse,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    delay: 0.4,
  },
  {
    icon: Wrench,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    delay: 0.1,
  },
  {
    icon: ShoppingBag,
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
    delay: 0.3,
  },
]

export function ClientHero() {
  return (
    <section className="relative overflow-hidden bg-background pt-32 pb-20 lg:pt-48 lg:pb-32">
      {/* Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] size-[500px] rounded-full bg-primary/20 opacity-50 blur-[120px]" />
      <div className="absolute top-[20%] right-[-5%] size-[400px] rounded-full bg-blue-500/20 opacity-50 blur-[100px]" />

      <div className="container relative mx-auto px-4">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left Content */}
          <div className="flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="mb-6 flex items-center rounded-full border border-primary/20 bg-primary/5 px-5 py-2 font-semibold text-primary text-sm shadow-sm backdrop-blur-md"
            >
              <Rocket className="mr-2 size-4" />O Guia Mais Completo da Cidade
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
              className="max-w-2xl font-extrabold text-5xl text-foreground leading-[1.1] tracking-tighter md:text-6xl lg:text-7xl"
            >
              Conecte-se com o <br />
              <span className="bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                melhor de Carangola
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
              className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed lg:text-xl"
            >
              Descubra lojas incríveis, serviços excepcionais e os melhores
              restaurantes locais. Encontre tudo que você precisa em uma
              experiência totalmente moderna.
            </motion.p>
          </div>

          {/* Right Floating Elements (Hidden on smaller screens to avoid clutter) */}
          <div className="relative hidden h-[500px] w-full lg:block">
            {/* Center Main Orb */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, type: 'spring' }}
              className="absolute inset-0 m-auto flex size-64 items-center justify-center rounded-full border border-white/20 bg-linear-to-br from-primary/20 to-blue-500/20 shadow-2xl backdrop-blur-3xl dark:border-white/5"
            >
              <div className="text-center">
                <span className="block font-black text-4xl text-primary">
                  +500
                </span>
                <span className="font-semibold text-foreground/80 text-sm uppercase tracking-widest">
                  Negócios Locais
                </span>
              </div>
            </motion.div>

            {/* Orbiting Icons */}
            {floatingIcons.map((item, i) => {
              const angle = (i * 360) / floatingIcons.length
              const radius = 180
              const x = Math.cos((angle * Math.PI) / 180) * radius
              const y = Math.sin((angle * Math.PI) / 180) * radius

              return (
                <motion.div
                  key={String(i)}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: [x, x + 15, x - 15, x],
                    y: [y, y - 15, y + 15, y],
                  }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.5 + item.delay },
                    scale: {
                      duration: 0.5,
                      delay: 0.5 + item.delay,
                      type: 'spring',
                    },
                    x: { duration: 6 + i, repeat: Infinity, ease: 'easeInOut' },
                    y: { duration: 5 + i, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  className={`absolute inset-0 m-auto flex size-16 items-center justify-center rounded-2xl border border-white/20 shadow-xl backdrop-blur-md dark:border-white/5 ${item.bg}`}
                >
                  <item.icon className={`size-8 ${item.color}`} />
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Full-width Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
          className="relative z-10 mt-16 w-full"
        >
          {/* Glassmorphic wrapper for the search */}
          <div className="absolute -inset-1 rounded-3xl bg-linear-to-r from-primary/30 to-blue-500/30 opacity-40 blur-xl transition duration-1000 hover:opacity-100 hover:duration-200"></div>
          <div className="relative rounded-3xl bg-white/80 p-2 shadow-2xl ring-1 ring-slate-900/5 backdrop-blur-xl dark:bg-slate-900/80 dark:ring-white/10">
            <SearchFormBusiness />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
