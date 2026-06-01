'use client'

import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  CreditCard,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Wallet,
  XCircle,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/utils/format-price'

interface CurrentPlanProps {
  planType: string
  planTitle: string
  status: boolean
  expiresIn: string
  price: number
  asaasSubscriptionStatus?: string | null
  planExpiresAt?: number | null
}

export function CurrentPlan({
  planType,
  planTitle,
  status,
  expiresIn,
  price,
  asaasSubscriptionStatus,
  planExpiresAt,
}: CurrentPlanProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showReactivateDialog, setShowReactivateDialog] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [isReactivating, setIsReactivating] = useState(false)
  const [isCancelled, setIsCancelled] = useState(
    asaasSubscriptionStatus === 'CANCELLED'
  )

  const isFree = planType === 'free'
  const isEffectivelyActive = status || isFree

  // Exibe o botão de cancelar apenas para: plano pago + ativo + ainda não cancelado
  const showCancelButton = !isFree && status && !isCancelled
  // Exibe reativar apenas quando cancelado e ainda dentro do período pago
  const showReactivateButton = !isFree && status && isCancelled

  const accessUntilDate = planExpiresAt
    ? new Date(planExpiresAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : null

  async function handleCancelRenewal() {
    setIsCancelling(true)
    try {
      const res = await fetch('/api/asaas/cancel-subscription', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao cancelar renovação')
      setIsCancelled(true)
      setShowCancelDialog(false)
      toast.success('Renovação cancelada. Você mantém o acesso até o fim do período.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao cancelar')
    } finally {
      setIsCancelling(false)
    }
  }

  async function handleReactivate() {
    setIsReactivating(true)
    try {
      const res = await fetch('/api/asaas/reactivate-subscription', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao reativar')
      setIsCancelled(false)
      setShowReactivateDialog(false)
      toast.success('Renovação reativada! Sua assinatura será renovada automaticamente.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao reativar')
    } finally {
      setIsReactivating(false)
    }
  }

  return (
    <>
      <Card className="mb-12 overflow-hidden rounded-[2rem] border-0 bg-white shadow-2xl shadow-slate-200/60 transition-all dark:bg-slate-900 dark:shadow-none">
        <CardHeader
          className={cn(
            'relative overflow-hidden px-8 py-7 text-white',
            isEffectivelyActive
              ? isCancelled
                ? 'bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600'
                : 'bg-gradient-to-br from-blue-600 via-primary to-indigo-600'
              : 'bg-gradient-to-br from-red-500 via-destructive to-red-700'
          )}
        >
          {/* Glow orbs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-12 -right-12 size-48 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 size-32 rounded-full bg-white/5 blur-2xl" />
          </div>
          {/* Shield watermark */}
          <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 opacity-[0.07]">
            <ShieldCheck className="size-56" />
          </div>

          <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md ring-1 ring-white/30">
                  <CreditCard className="size-5 text-white" />
                </div>
                <h2 className="font-black text-2xl uppercase italic tracking-tight drop-shadow-sm">
                  Detalhes da Assinatura
                </h2>
              </div>
              <p className="pl-[3.25rem] font-medium text-sm text-white/70 tracking-wide">
                Gerencie seu nível de visibilidade na plataforma
              </p>
            </div>

            <div
              className={cn(
                'flex items-center gap-2.5 self-start rounded-full px-4 py-1.5 backdrop-blur-md md:self-auto',
                'border bg-white/10 ring-1',
                isEffectivelyActive && !isCancelled
                  ? 'border-green-300/30 ring-green-300/20'
                  : isCancelled
                    ? 'border-amber-300/30 ring-amber-300/20'
                    : 'border-yellow-300/30 ring-yellow-300/20'
              )}
            >
              <span
                className={cn(
                  'relative flex size-2.5',
                )}
              >
                <span
                  className={cn(
                    'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                    isEffectivelyActive && !isCancelled ? 'bg-green-300' : 'bg-amber-300'
                  )}
                />
                <span
                  className={cn(
                    'relative inline-flex size-2.5 rounded-full',
                    isEffectivelyActive && !isCancelled ? 'bg-green-400' : isCancelled ? 'bg-amber-300' : 'bg-yellow-400'
                  )}
                />
              </span>
              <span className="font-semibold text-[11px] uppercase tracking-widest text-white">
                {isCancelled
                  ? 'Cancelado — Ativo até expirar'
                  : isEffectivelyActive
                    ? 'Assinatura Ativa'
                    : 'Requer Atenção'}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Stats grid */}
          <div className="grid grid-cols-1 divide-y divide-slate-100 md:grid-cols-3 md:divide-x md:divide-y-0 dark:divide-slate-800">
            {/* Plan Type */}
            <div className="flex flex-col gap-3 px-8 py-7">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-primary" />
                <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-[0.15em]">
                  Plano Atual
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="font-black text-3xl text-foreground uppercase leading-none tracking-tight">
                  {planTitle}
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      'rounded-full px-2.5 py-0.5 font-bold text-[10px] uppercase tracking-wider',
                      isFree
                        ? 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400'
                        : isCancelled
                          ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/40 dark:bg-amber-950/30 dark:text-amber-400'
                          : 'border-primary/25 bg-primary/8 text-primary dark:border-primary/30 dark:bg-primary/10'
                    )}
                  >
                    {isFree
                      ? 'Nível Básico'
                      : isCancelled
                        ? 'Renovação Cancelada'
                        : 'Destaque Premium'}
                  </Badge>
                  {asaasSubscriptionStatus && !isFree && (
                    <span
                      className={cn(
                        'font-bold text-[10px] uppercase tracking-widest',
                        asaasSubscriptionStatus === 'ACTIVE'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-amber-600 dark:text-amber-400'
                      )}
                    >
                      {asaasSubscriptionStatus}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Value / Investment */}
            <div className="flex flex-col gap-3 px-8 py-7">
              <div className="flex items-center gap-2">
                <Wallet className="size-3.5 text-primary" />
                <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-[0.15em]">
                  Investimento
                </span>
              </div>
              <div className="space-y-1.5">
                <p className="font-black text-3xl text-foreground leading-none tracking-tight">
                  {price > 0 ? formatPrice(price) : 'Grátis'}
                </p>
                <p className="font-semibold text-muted-foreground text-xs uppercase tracking-widest">
                  {isFree
                    ? 'Vitalício • Sem cobrança'
                    : isCancelled
                      ? 'Sem renovação automática'
                      : 'Renovação anual'}
                </p>
              </div>
            </div>

            {/* Expiration / Status */}
            <div className="flex flex-col gap-3 px-8 py-7">
              <div className="flex items-center gap-2">
                <Calendar className="size-3.5 text-primary" />
                <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-[0.15em]">
                  Status de Validade
                </span>
              </div>
              <div className="space-y-1.5">
                {isFree ? (
                  <p className="font-black text-3xl text-foreground uppercase leading-none tracking-tight">
                    Vitalício
                  </p>
                ) : status ? (
                  <p className="font-black text-3xl text-foreground leading-none tracking-tight">
                    {expiresIn}
                  </p>
                ) : (
                  <p className="font-black text-2xl text-destructive uppercase italic leading-none tracking-tight">
                    {expiresIn}
                  </p>
                )}
                <p
                  className={cn(
                    'font-semibold text-xs uppercase tracking-widest',
                    isCancelled
                      ? 'text-amber-600 dark:text-amber-400'
                      : isEffectivelyActive
                        ? 'text-green-600 dark:text-green-400'
                        : 'animate-pulse text-amber-600 dark:text-amber-400'
                  )}
                >
                  {isFree
                    ? 'Sem custo • Plano permanente'
                    : isCancelled
                      ? 'Não renovará automaticamente'
                      : status
                        ? 'Pagamento processado com sucesso'
                        : 'Realize o upgrade para continuar'}
                </p>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="mx-8 h-px bg-slate-100 dark:bg-slate-800" />

          <div className="px-8 py-6 space-y-4">
            {/* Aviso de cancelamento pendente */}
            {isCancelled && accessUntilDate && (
              <div className="flex items-start gap-4 rounded-2xl border border-amber-200/60 bg-amber-50/60 p-4 dark:border-amber-800/30 dark:bg-amber-950/20">
                <div className="shrink-0 flex size-9 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40">
                  <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-black text-amber-800 text-xs uppercase tracking-tight dark:text-amber-300">
                    Renovação cancelada
                  </p>
                  <p className="mt-0.5 font-medium text-amber-700 text-xs leading-relaxed dark:text-amber-400">
                    Você mantém todos os benefícios do plano{' '}
                    <strong>{planTitle}</strong> até{' '}
                    <strong>{accessUntilDate}</strong>. Após essa data, seu plano
                    voltará automaticamente para o gratuito.
                  </p>
                </div>
              </div>
            )}

            {/* Info Box / Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="group flex flex-1 items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 px-5 py-4 transition-all hover:border-primary/20 hover:bg-primary/[0.02] dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-primary/30">
                <div className="shrink-0 flex size-9 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100 transition-all group-hover:bg-primary/10 group-hover:ring-primary/20 dark:bg-slate-900 dark:ring-slate-800">
                  <ArrowRight className="size-4 text-primary" />
                </div>
                <div>
                  <p className="font-black text-foreground text-xs uppercase tracking-tight">
                    {isCancelled ? 'Mudou de ideia?' : 'Deseja mudar de plano?'}
                  </p>
                  <p className="font-medium text-muted-foreground text-xs leading-relaxed">
                    {isCancelled
                      ? 'Você pode reativar a renovação a qualquer momento antes do fim do período.'
                      : 'Explore as opções de upgrade abaixo para aumentar sua visibilidade.'}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                {showReactivateButton && (
                  <Button
                    variant="ghost"
                    onClick={() => setShowReactivateDialog(true)}
                    className="h-10 rounded-xl border border-green-200 bg-green-50 px-4 font-bold text-[11px] text-green-700 uppercase tracking-wider transition-all hover:bg-green-100 hover:text-green-800 dark:border-green-800/40 dark:bg-green-950/20 dark:text-green-400 dark:hover:bg-green-950/40"
                  >
                    <RefreshCw className="mr-1.5 size-3.5" />
                    Reativar Renovação
                  </Button>
                )}
                {showCancelButton && (
                  <Button
                    variant="ghost"
                    onClick={() => setShowCancelDialog(true)}
                    className="h-10 rounded-xl border border-red-200 bg-red-50 px-4 font-bold text-[11px] text-red-600 uppercase tracking-wider transition-all hover:bg-red-100 hover:text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
                  >
                    <XCircle className="mr-1.5 size-3.5" />
                    Cancelar Renovação
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Modal de confirmação de cancelamento ─────────────────────────── */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="overflow-hidden rounded-[3rem] border border-slate-100 bg-slate-50 p-4 sm:max-w-[420px] sm:rounded-[3rem] dark:border-slate-850 dark:bg-slate-950">
          <div className="space-y-6 rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <DialogHeader className="space-y-4">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40">
                <XCircle className="size-8 text-red-500" />
              </div>
              <div className="space-y-1 text-center">
                <DialogTitle className="font-black text-2xl text-foreground uppercase tracking-tighter">
                  Cancelar Renovação?
                </DialogTitle>
                <DialogDescription className="font-semibold text-muted-foreground">
                  Funciona como Netflix — você não perde o acesso agora.
                </DialogDescription>
              </div>
            </DialogHeader>

            {/* Detalhes do que acontece */}
            <div className="space-y-3 rounded-3xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-green-500">✓</span>
                <p className="font-semibold text-foreground text-sm">
                  Você mantém o plano{' '}
                  <strong>{planTitle}</strong> até{' '}
                  <strong>{accessUntilDate ?? expiresIn}</strong>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-green-500">✓</span>
                <p className="font-semibold text-foreground text-sm">
                  Nenhuma cobrança futura será realizada
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-amber-500">⚠</span>
                <p className="font-semibold text-foreground text-sm">
                  Após expirar, seu perfil voltará ao plano gratuito
                </p>
              </div>
            </div>

            <DialogFooter className="flex-col gap-3 sm:flex-col">
              <Button
                onClick={handleCancelRenewal}
                disabled={isCancelling}
                className="h-14 w-full rounded-2xl bg-red-500 font-black text-xs uppercase tracking-widest text-white shadow-red-500/20 shadow-xl hover:bg-red-600"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Cancelando...
                  </>
                ) : (
                  'Confirmar cancelamento'
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowCancelDialog(false)}
                disabled={isCancelling}
                className="h-12 w-full rounded-2xl font-bold text-[10px] text-muted-foreground uppercase tracking-widest hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800"
              >
                Manter minha assinatura
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Modal de reativação ──────────────────────────────────────────── */}
      <Dialog open={showReactivateDialog} onOpenChange={setShowReactivateDialog}>
        <DialogContent className="overflow-hidden rounded-[3rem] border border-slate-100 bg-slate-50 p-4 sm:max-w-[420px] sm:rounded-[3rem] dark:border-slate-850 dark:bg-slate-950">
          <div className="space-y-6 rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <DialogHeader className="space-y-4">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
                <RefreshCw className="size-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="space-y-1 text-center">
                <DialogTitle className="font-black text-2xl text-foreground uppercase tracking-tighter">
                  Reativar Renovação?
                </DialogTitle>
                <DialogDescription className="font-semibold text-muted-foreground">
                  Sua assinatura voltará a renovar automaticamente.
                </DialogDescription>
              </div>
            </DialogHeader>

            {/* Detalhes do que acontece */}
            <div className="space-y-3 rounded-3xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-green-500">✓</span>
                <p className="font-semibold text-foreground text-sm">
                  Nenhuma cobrança imediata — você continua no período atual
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-green-500">✓</span>
                <p className="font-semibold text-foreground text-sm">
                  A renovação automática voltará a funcionar em{' '}
                  <strong>{accessUntilDate ?? expiresIn}</strong>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-green-500">✓</span>
                <p className="font-semibold text-foreground text-sm">
                  Plano <strong>{planTitle}</strong> mantido sem interrupção
                </p>
              </div>
            </div>

            <DialogFooter className="flex-col gap-3 sm:flex-col">
              <Button
                onClick={handleReactivate}
                disabled={isReactivating}
                className="h-14 w-full rounded-2xl bg-green-600 font-black text-xs uppercase tracking-widest text-white shadow-green-600/20 shadow-xl hover:bg-green-700"
              >
                {isReactivating ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Reativando...
                  </>
                ) : (
                  'Confirmar reativação'
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowReactivateDialog(false)}
                disabled={isReactivating}
                className="h-12 w-full rounded-2xl font-bold text-[10px] text-muted-foreground uppercase tracking-widest hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800"
              >
                Voltar
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
