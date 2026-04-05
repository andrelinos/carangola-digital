'use client'

import { Sparkles, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function ProUpgradeBanner() {
  const benefits = [
    'Destaque no topo das buscas',
    'Customização de cores e temas',
    'Exibição no mapa interativo',
    'Estatísticas detalhadas de visitas'
  ]

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-xl shadow-slate-900/20 mb-8 border border-white/5">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 size-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 size-64 rounded-full bg-blue-500/10 blur-3xl" />
      
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4 border border-primary/20">
            <Sparkles className="size-3" />
            <span>Power up seu negócio</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-4">
            Seja um parceiro <span className="text-primary italic">Pro</span> do Carangola Digital
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-6">
            Aumente a visibilidade da sua empresa ou imobiliária com ferramentas exclusivas de destaque e análise de performance.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-sm text-slate-300">
                <div className="size-5 rounded-full bg-white/5 flex items-center justify-center">
                  <Check className="size-3 text-primary" />
                </div>
                {benefit}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 min-w-[240px]">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
             <div className="flex items-baseline gap-1 mb-1">
               <span className="text-xs font-bold text-slate-400 uppercase">A partir de</span>
               <span className="text-3xl font-black text-white">R$ 49,90</span>
               <span className="text-sm font-medium text-slate-400">/mês</span>
             </div>
             <p className="text-xs text-slate-400 mb-6 italic">* cancelamento fácil a qualquer momento</p>
             <Button asChild className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-bold h-12 shadow-lg shadow-primary/20">
                <Link href="/dashboard/assinatura" className="flex items-center gap-2">
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
