'use client'

import { ArrowRight, Check, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function ProUpgradeBanner() {
  const benefits = [
    'Destaque no topo das buscas',
    'Customização de cores e temas',
    'Exibição no mapa interativo',
    'Estatísticas detalhadas de visitas',
  ]

  return (
    <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/5 bg-slate-900 p-8 text-white shadow-slate-900/20 shadow-xl">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 size-96 translate-x-1/4 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 size-64 -translate-x-1/4 translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/20 px-3 py-1 font-bold text-primary text-xs uppercase tracking-wider">
            <Sparkles className="size-3" />
            <span>Power up seu negócio</span>
          </div>
          <h2 className="mb-4 font-extrabold text-3xl tracking-tight">
            Seja um parceiro <span className="text-primary italic">Pro</span> do
            Carangola Digital
          </h2>
          <p className="mb-6 text-lg text-slate-400 leading-relaxed">
            Aumente a visibilidade da sua empresa ou imobiliária com ferramentas
            exclusivas de destaque e análise de performance.
          </p>

          <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {benefits.map(benefit => (
              <div
                key={benefit}
                className="flex items-center gap-2 text-slate-300 text-sm"
              >
                <div className="flex size-5 items-center justify-center rounded-full bg-white/5">
                  <Check className="size-3 text-primary" />
                </div>
                {benefit}
              </div>
            ))}
          </div>
        </div>

        <div className="flex min-w-[240px] flex-col gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-1 flex items-baseline gap-1">
              <span className="font-bold text-slate-400 text-xs uppercase">
                A partir de
              </span>
              <span className="font-black text-3xl text-white">R$ 49,90</span>
              <span className="font-medium text-slate-400 text-sm">/mês</span>
            </div>
            <p className="mb-6 text-slate-400 text-xs italic">
              * cancelamento fácil a qualquer momento
            </p>
            <Button
              asChild
              className="h-12 w-full rounded-xl bg-primary font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90"
            >
              <Link
                href="/dashboard/assinatura"
                className="flex items-center gap-2"
              >
                <span>Assine Agora</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
