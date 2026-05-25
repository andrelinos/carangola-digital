'use client'

import { motion } from 'framer-motion'
import { ArrowRight, HelpCircle, PackageSearch, PhoneCall } from 'lucide-react'
import Link from 'next/link'

const communityFeatures = [
  {
    title: 'Telefones Úteis',
    description:
      'Acesse rapidamente telefones de emergência, saúde e serviços públicos essenciais.',
    href: '/telefones-uteis',
    icon: PhoneCall,
    color: 'text-blue-500 bg-blue-500/10',
  },
  {
    title: 'Achados e Perdidos',
    description:
      'Perdeu ou encontrou algo em Carangola? Ajude a nossa comunidade local.',
    href: '/achados-e-perdidos',
    icon: PackageSearch,
    color: 'text-emerald-500 bg-emerald-500/10',
  },
  {
    title: 'Como Funciona',
    description:
      'Veja como é fácil encontrar o que precisa ou anunciar sua empresa e imóveis.',
    href: '/como-funciona',
    icon: HelpCircle,
    color: 'text-amber-500 bg-amber-500/10',
  },
]

export function CommunityFeatures() {
  return (
    <section className="bg-white py-16 md:py-24 dark:bg-slate-900">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-16 text-center">
          <h2 className="font-bold text-3xl text-slate-900 tracking-tight lg:text-4xl dark:text-slate-100">
            Sua Central de Utilidade
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Serviços e informações úteis para facilitar o dia a dia de quem vive
            em Carangola.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {communityFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={feature.href}
                className="group flex h-full flex-col items-center rounded-3xl border border-transparent bg-slate-50 p-8 text-center transition-all hover:border-primary/20 hover:bg-white hover:shadow-xl dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <div
                  className={`mb-6 flex size-20 items-center justify-center rounded-2xl transition-transform group-hover:-rotate-3 group-hover:scale-110 ${feature.color}`}
                >
                  <feature.icon className="size-10" />
                </div>
                <h3 className="mb-3 font-bold text-slate-900 text-xl dark:text-slate-100">
                  {feature.title}
                </h3>
                <p className="mb-8 text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-auto flex items-center gap-2 font-semibold text-primary text-sm">
                  Acessar agora <ArrowRight className="size-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
