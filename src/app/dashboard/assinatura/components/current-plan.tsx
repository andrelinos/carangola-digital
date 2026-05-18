'use client'

import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Wallet,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/utils/format-price'

interface CurrentPlanProps {
  planType: string
  planTitle: string
  status: boolean
  expiresIn: string
  price: number
  asaasSubscriptionStatus?: string | null
}

export function CurrentPlan({
  planType,
  planTitle,
  status,
  expiresIn,
  price,
  asaasSubscriptionStatus,
}: CurrentPlanProps) {
  const isFree = planType === 'free'
  // Plano free é sempre considerado "ativo" na UI (sem expiração)
  const isEffectivelyActive = status || isFree

  return (
    <Card className="mb-12 overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-xl transition-all dark:border-slate-850 dark:bg-slate-900/50 dark:shadow-none">
      <CardHeader
        className={cn(
          'relative overflow-hidden p-8 text-white',
          isEffectivelyActive
            ? 'bg-gradient-to-r from-primary to-indigo-650'
            : 'bg-gradient-to-r from-destructive to-red-600'
        )}
      >
        {/* Abstract shapes for premium feel */}
        <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 transform p-8 opacity-10">
          <ShieldCheck className="size-64" />
        </div>

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/20 p-2 backdrop-blur-md">
                <CreditCard className="size-6 text-white" />
              </div>
              <h2 className="font-black text-3xl uppercase italic tracking-tighter">
                Detalhes da Assinatura
              </h2>
            </div>
            <p className="font-medium text-white/80 tracking-tight">
              Gerencie seu nível de visibilidade na plataforma
            </p>
          </div>

          <div className="flex items-center gap-3 self-start rounded-2xl border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md md:self-auto">
            <div
              className={cn(
                'size-3 animate-pulse rounded-full',
                isEffectivelyActive ? 'bg-green-400' : 'bg-yellow-400'
              )}
            />
            <span className="font-bold text-sm uppercase tracking-widest">
              {isEffectivelyActive ? 'Assinatura Ativa' : 'Requer Atenção'}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8 md:p-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Plan Type */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="size-4 text-primary" />
              <span className="font-black text-[10px] uppercase tracking-widest">
                Plano Atual
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-4xl text-foreground uppercase tracking-tighter">
                {planTitle}
              </h3>
              <Badge
                variant="outline"
                className={cn(
                  'px-3 py-1 font-bold text-[10px] uppercase tracking-wider',
                  isFree
                    ? 'border-slate-200 text-muted-foreground dark:border-slate-800'
                    : 'border-primary/20 bg-primary/5 text-primary dark:border-primary/30 dark:bg-primary/10'
                )}
              >
                {isFree ? 'Nível Básico' : 'Destaque Premium'}
              </Badge>
              {asaasSubscriptionStatus && !isFree && (
                <p className="mt-1 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                  Asaas:{' '}
                  <span
                    className={cn(
                      asaasSubscriptionStatus === 'ACTIVE'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-amber-600 dark:text-amber-400'
                    )}
                  >
                    {asaasSubscriptionStatus}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Value / Investment */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wallet className="size-4 text-primary" />
              <span className="font-black text-[10px] uppercase tracking-widest">
                Investimento
              </span>
            </div>
            <div className="space-y-1">
              <p className="font-black text-4xl text-foreground tracking-tighter">
                {price > 0 ? formatPrice(price) : 'Grátis'}
              </p>
              <p className="font-bold text-muted-foreground text-xs uppercase tracking-widest">
                {isFree ? 'Vitalício • Sem cobrança' : 'Renovação anual'}
              </p>
            </div>
          </div>

          {/* Expiration / Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="size-4 text-primary" />
              <span className="font-black text-[10px] uppercase tracking-widest">
                Status de Validade
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {isFree ? (
                  <p className="font-black text-2xl text-foreground uppercase tracking-tight">
                    Vitálicio
                  </p>
                ) : status ? (
                  <p className="font-black text-2xl text-foreground tracking-tight">
                    Expira em {expiresIn}
                  </p>
                ) : (
                  <p className="font-black text-2xl text-destructive uppercase italic tracking-tight">
                    {expiresIn}
                  </p>
                )}
              </div>
              <p
                className={cn(
                  'font-bold text-xs uppercase tracking-widest',
                  isEffectivelyActive
                    ? 'text-green-600 dark:text-green-400'
                    : 'animate-pulse text-amber-600 dark:text-amber-400'
                )}
              >
                {isFree
                  ? 'Sem custo • Plano permanente'
                  : status
                    ? 'Pagamento processado com sucesso'
                    : 'Realize o upgrade para continuar'}
              </p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="group mt-12 flex flex-col items-start gap-6 rounded-3xl border border-slate-100 bg-slate-50/50 p-6 transition-colors hover:border-primary/20 md:flex-row md:items-center dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-primary/30">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-colors group-hover:bg-primary/10 dark:border-slate-800 dark:bg-slate-900">
            <ArrowRight className="size-6 text-primary" />
          </div>
          <div>
            <p className="font-black text-foreground text-sm uppercase tracking-tight">
              Deseja mudar de plano?
            </p>
            <p className="font-medium text-muted-foreground text-xs">
              Explore as opções de upgrade abaixo para aumentar sua visibilidade
              e alcançar mais clientes em Carangola.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
