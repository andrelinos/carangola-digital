'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Crown,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { setFreePlanAction } from '@/actions/user/set-free-plan'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { PlanItemProps } from '@/configs/plans-business'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/utils/format-price'

interface ManagePlansProps {
  plans: PlanItemProps[]
  currentPlan?: string
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
}

export function ManagePlans({ plans, currentPlan }: ManagePlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanItemProps | null>(null)
  const [isPending, setIsPending] = useState(false)

  function handleCloseModal() {
    if (isPending) return
    setSelectedPlan(null)
  }

  async function handleConfirmPlan() {
    if (!selectedPlan) return

    if (selectedPlan.name.toLowerCase() === 'free') {
      setIsPending(true)
      const result = await setFreePlanAction()
      setIsPending(false)

      if (result.success) {
        toast.success(`Plano ${selectedPlan.title} ativado com sucesso!`)
        handleCloseModal()
      } else {
        toast.error(result.error || 'Erro ao ativar plano')
      }
      return
    }

    // Lógica para planos pagos (Mercado Pago, Stripe, etc.)
    alert(`Redirecionando para pagamento do plano: ${selectedPlan.title}...`)
    handleCloseModal()
  }

  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <header className="mb-16 space-y-4 text-center">
          <h2 className="font-black text-4xl text-slate-900 uppercase tracking-tighter md:text-5xl">
            Escolha seu{' '}
            <span className="text-primary italic">Nível de Destaque</span>
          </h2>
          <p className="mx-auto max-w-2xl font-medium text-lg text-slate-500 italic">
            Não importa o tamanho da sua empresa, temos o plano ideal para você
            brilhar em Carangola.
          </p>
        </header>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {plans?.map(plan => (
            <motion.div key={plan.name} variants={item}>
              <Card
                className={cn(
                  'group relative flex h-full flex-col overflow-hidden border-2 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl',
                  plan?.popular
                    ? 'border-primary bg-slate-50'
                    : plan?.name === 'pro'
                      ? 'border-amber-500 bg-amber-50/30 hover:shadow-amber-500/20'
                      : 'border-slate-100 hover:border-slate-200'
                )}
              >
                {plan?.popular && (
                  <div className="pointer-events-none absolute top-0 right-0 size-32 overflow-hidden p-0">
                    <div className="absolute top-4 -right-8 w-32 rotate-45 bg-primary py-1 text-center font-black text-[10px] text-white uppercase tracking-widest shadow-lg">
                      Popular
                    </div>
                  </div>
                )}

                {plan?.name === 'pro' && (
                  <div className="pointer-events-none absolute top-0 right-0 size-32 overflow-hidden p-0">
                    <div className="absolute top-4 -right-8 w-32 rotate-45 bg-amber-500 py-1 text-center font-black text-[10px] text-white uppercase tracking-widest shadow-lg">
                      Mais Vantajoso
                    </div>
                  </div>
                )}

                <CardHeader className="relative pt-10 pb-6">
                  <div className="mb-4 flex items-start justify-between">
                    <CardTitle className="font-black text-3xl text-slate-900 uppercase tracking-tight">
                      {plan.title}
                    </CardTitle>
                    {plan?.popular ? (
                      <Crown className="size-6 animate-pulse text-primary" />
                    ) : plan.name !== 'free' ? (
                      <Sparkles className="size-6 text-amber-500" />
                    ) : null}
                  </div>

                  <div className="flex flex-col pt-2">
                    <div className="flex items-baseline gap-1">
                      <span className="font-black text-5xl text-slate-950 tracking-tighter">
                        {plan.price > 0
                          ? formatPrice(plan.price / 12)
                          : formatPrice(0)}
                      </span>
                      <span className="font-bold text-slate-400 text-sm uppercase tracking-wider">
                        /mês
                      </span>
                    </div>
                    {plan.price > 0 && (
                      <span className="mt-1 font-bold text-slate-400/80 text-xs uppercase tracking-widest">
                        Faturado anualmente ({formatPrice(plan.price)})
                      </span>
                    )}
                  </div>
                  <CardDescription className="pt-2 font-medium text-slate-500 italic">
                    {plan.name === 'free'
                      ? 'O começo de tudo. Seja visto na cidade.'
                      : plan.name === 'basic'
                        ? 'Para quem quer crescer e se destacar.'
                        : 'O topo da vitrine. Máxima visibilidade.'}
                  </CardDescription>
                </CardHeader>

                <CardContent className="grow space-y-6">
                  <div className="h-px w-full bg-slate-100" />
                  <p className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">
                    O que está incluso:
                  </p>

                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <div className="rounded-full bg-green-50 p-1 transition-transform group-hover:scale-110">
                        <Check
                          className="size-4 text-green-600"
                          strokeWidth={3}
                        />
                      </div>
                      <span className="font-semibold text-slate-700 text-sm">
                        {plan.addresses.quantity === -1
                          ? 'Endereços Ilimitados'
                          : `${plan.addresses.quantity} Endereços`}
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="rounded-full bg-green-50 p-1 transition-transform group-hover:scale-110">
                        <Check
                          className="size-4 text-green-600"
                          strokeWidth={3}
                        />
                      </div>
                      <span className="font-semibold text-slate-700 text-sm">
                        {plan.businessPhones.quantity === -1
                          ? 'Telefones Ilimitados'
                          : `${plan.businessPhones.quantity} Telefones`}
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      {plan.activeSocialMedias > 0 ? (
                        <>
                          <div className="rounded-full bg-green-50 p-1 transition-transform group-hover:scale-110">
                            <Check
                              className="size-4 text-green-600"
                              strokeWidth={3}
                            />
                          </div>
                          <span className="font-semibold text-slate-700 text-sm">
                            {plan.activeSocialMedias} Links de Redes Sociais
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="rounded-full bg-slate-50 p-1 opacity-40">
                            <X
                              className="size-4 text-slate-400"
                              strokeWidth={3}
                            />
                          </div>
                          <span className="font-medium text-slate-400 text-sm line-through">
                            Redes Sociais
                          </span>
                        </>
                      )}
                    </li>

                    {plan?.name !== 'free' ? (
                      <li className="flex items-center gap-3">
                        <div className="rounded-full bg-green-50 p-1 transition-transform group-hover:scale-110">
                          <Check
                            className="size-4 text-green-600"
                            strokeWidth={3}
                          />
                        </div>
                        <span className="font-semibold text-slate-700 text-sm">
                          Galeria de Fotos Completa
                        </span>
                      </li>
                    ) : (
                      <li className="flex items-center gap-3 opacity-40">
                        <div className="rounded-full bg-slate-50 p-1">
                          <X
                            className="size-4 text-slate-400"
                            strokeWidth={3}
                          />
                        </div>
                        <span className="font-medium text-slate-400 text-sm line-through">
                          Galeria de Fotos
                        </span>
                      </li>
                    )}
                  </ul>
                </CardContent>

                <CardFooter className="pt-8 pb-10">
                  <Button
                    onClick={() => setSelectedPlan(plan)}
                    disabled={
                      plan.name.toLowerCase() === currentPlan?.toLowerCase()
                    }
                    className={cn(
                      'h-14 w-full rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300',
                      plan.name.toLowerCase() === currentPlan?.toLowerCase()
                        ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                        : plan.popular
                          ? 'bg-primary text-white shadow-lg shadow-primary/30 hover:scale-[1.02] hover:bg-primary/90'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    )}
                    variant="ghost"
                  >
                    {plan.name.toLowerCase() === currentPlan?.toLowerCase()
                      ? 'Plano Atual'
                      : `Escolher ${plan.title}`}
                    {plan.name.toLowerCase() !== currentPlan?.toLowerCase() && (
                      <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
      {console.log(currentPlan)}
      {console.log(plans)}

      <Dialog open={!!selectedPlan} onOpenChange={handleCloseModal}>
        <DialogContent className="overflow-hidden rounded-[3rem] border-none bg-slate-50 p-4 sm:max-w-[425px] sm:rounded-[3rem]">
          <div className="space-y-6 rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
            <DialogHeader className="space-y-4">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="size-8 text-primary" />
              </div>
              <div className="space-y-1 text-center">
                <DialogTitle className="font-black text-2xl text-slate-950 uppercase tracking-tighter">
                  Quase lá!
                </DialogTitle>
                <DialogDescription className="font-semibold text-slate-500">
                  Você está selecionando o plano{' '}
                  <span className="text-primary">{selectedPlan?.title}</span>
                </DialogDescription>
              </div>
            </DialogHeader>

            {selectedPlan && (
              <div className="space-y-2 rounded-3xl border border-slate-200 border-dashed bg-slate-50 p-6 text-center">
                {selectedPlan.price === 0 ? (
                  <>
                    <p className="font-black text-4xl text-primary uppercase tracking-tighter">
                      100% Grátis
                    </p>
                    <p className="font-bold text-slate-400 text-xs uppercase tracking-[0.2em]">
                      Sem custos de manutenção
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-baseline justify-center gap-1">
                      <p className="font-black text-4xl text-slate-950 tracking-tighter">
                        {formatPrice(selectedPlan.price / 12)}
                      </p>
                      <p className="font-bold text-slate-400 text-sm uppercase tracking-wider">
                        /mês
                      </p>
                    </div>
                    <p className="mt-1 font-bold text-[11px] text-slate-400 uppercase tracking-[0.2em]">
                      Cobrado {formatPrice(selectedPlan.price)} por ano
                    </p>
                    <div className="mt-3">
                      <p className="inline-block rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-bold text-[10px] text-primary uppercase tracking-widest">
                        Apenas {formatPrice(selectedPlan.price / 365)} por dia!
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            <DialogFooter className="mt-4 flex-col gap-3 sm:flex-col">
              <Button
                onClick={handleConfirmPlan}
                disabled={isPending}
                className="h-14 w-full rounded-2xl bg-primary font-black text-xs uppercase tracking-widest shadow-primary/20 shadow-xl hover:bg-primary/90"
              >
                {isPending
                  ? 'Processando...'
                  : selectedPlan?.price === 0
                    ? 'Ativar Plano Grátis'
                    : 'Confirmar Assinatura'}
              </Button>
              <Button
                variant="ghost"
                onClick={handleCloseModal}
                disabled={isPending}
                className="h-12 w-full rounded-2xl font-bold text-[10px] text-slate-400 uppercase tracking-widest hover:bg-slate-100 hover:text-slate-600"
              >
                Voltar e revisar
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
