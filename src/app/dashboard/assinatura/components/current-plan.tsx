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
      <Card className="mb-12 overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-xl transition-all dark:border-slate-850 dark:bg-slate-900/50 dark:shadow-none">
        <CardHeader
          className={cn(
            'relative overflow-hidden p-8 text-white',
            isEffectivelyActive
              ? isCancelled
                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                : 'bg-gradient-to-r from-primary to-indigo-650'
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
                  isEffectivelyActive
                    ? isCancelled
                      ? 'bg-amber-300'
                      : 'bg-green-400'
                    : 'bg-yellow-400'
                )}
              />
              <span className="font-bold text-sm uppercase tracking-widest">
                {isCancelled
                  ? 'Cancelado — Ativo até expirar'
                  : isEffectivelyActive
                    ? 'Assinatura Ativa'
                    : 'Requer Atenção'}
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
                      : isCancelled
                        ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/40 dark:bg-amber-950/30 dark:text-amber-400'
                        : 'border-primary/20 bg-primary/5 text-primary dark:border-primary/30 dark:bg-primary/10'
                  )}
                >
                  {isFree
                    ? 'Nível Básico'
                    : isCancelled
                      ? 'Renovação Cancelada'
                      : 'Destaque Premium'}
                </Badge>
                {asaasSubscriptionStatus && !isFree && (
                  <p className="mt-1 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                    Asaas:{' '}
                    <span
                      className={cn(
                        asaasSubscriptionStatus === 'ACTIVE'
                          ? 'text-green-600 dark:text-green-400'
                          : asaasSubscriptionStatus === 'CANCELLED'
                            ? 'text-amber-600 dark:text-amber-400'
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
                  {isFree
                    ? 'Vitalício • Sem cobrança'
                    : isCancelled
                      ? 'Sem renovação automática'
                      : 'Renovação anual'}
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

          {/* Aviso de cancelamento pendente */}
          {isCancelled && accessUntilDate && (
            <div className="mt-8 flex items-start gap-4 rounded-3xl border border-amber-200 bg-amber-50/70 p-5 dark:border-amber-800/30 dark:bg-amber-950/20">
              <div className="shrink-0 rounded-xl bg-amber-100 p-2 dark:bg-amber-900/40">
                <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="font-black text-amber-800 text-sm uppercase tracking-tight dark:text-amber-300">
                  Renovação cancelada
                </p>
                <p className="mt-0.5 font-medium text-amber-700 text-xs dark:text-amber-400">
                  Você mantém todos os benefícios do plano{' '}
                  <strong>{planTitle}</strong> até{' '}
                  <strong>{accessUntilDate}</strong>. Após essa data, seu plano
                  voltará automaticamente para o gratuito.
                </p>
              </div>
            </div>
          )}

          {/* Info Box / Action Buttons */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="group flex flex-1 items-start gap-4 rounded-3xl border border-slate-100 bg-slate-50/50 p-5 transition-colors hover:border-primary/20 dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-primary/30">
              <div className="shrink-0 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition-colors group-hover:bg-primary/10 dark:border-slate-800 dark:bg-slate-900">
                <ArrowRight className="size-5 text-primary" />
              </div>
              <div>
                <p className="font-black text-foreground text-sm uppercase tracking-tight">
                  {isCancelled ? 'Mudou de ideia?' : 'Deseja mudar de plano?'}
                </p>
                <p className="font-medium text-muted-foreground text-xs">
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
                  className="h-11 rounded-2xl border border-green-200 bg-green-50 px-5 font-bold text-[11px] text-green-700 uppercase tracking-widest transition-all hover:bg-green-100 hover:text-green-800 dark:border-green-800/40 dark:bg-green-950/20 dark:text-green-400 dark:hover:bg-green-950/40"
                >
                  <RefreshCw className="mr-2 size-4" />
                  Reativar Renovação
                </Button>
              )}
              {showCancelButton && (
                <Button
                  variant="ghost"
                  onClick={() => setShowCancelDialog(true)}
                  className="h-11 rounded-2xl border border-red-200 bg-red-50 px-5 font-bold text-[11px] text-red-600 uppercase tracking-widest transition-all hover:bg-red-100 hover:text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  <XCircle className="mr-2 size-4" />
                  Cancelar Renovação
                </Button>
              )}
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
