'use client'

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
import { formatPrice } from '@/utils/format-price'
import { Check, Crown, Sparkles, X, ArrowRight, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { setFreePlanAction } from '@/actions/user/set-free-plan'
import { toast } from 'sonner'

interface ManagePlansProps {
  plans: PlanItemProps[]
  currentPlan?: string
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
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
        <header className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase">
            Escolha seu <span className="text-primary italic">Nível de Destaque</span>
          </h2>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto italic">
            Não importa o tamanho da sua empresa, temos o plano ideal para você brilhar em Carangola.
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
                  'relative flex flex-col h-full border-2 transition-all duration-500 overflow-hidden group hover:scale-[1.02] hover:shadow-2xl',
                  plan?.popular
                    ? 'border-primary bg-slate-50'
                    : 'border-slate-100 hover:border-slate-200'
                )}
              >
                {plan?.popular && (
                  <div className="absolute top-0 right-0 p-0 overflow-hidden size-32 pointer-events-none">
                    <div className="absolute top-4 -right-8 w-32 rotate-45 bg-primary text-white text-[10px] font-black text-center py-1 uppercase tracking-widest shadow-lg">
                      Popular
                    </div>
                  </div>
                )}

                <CardHeader className="pt-10 pb-6 relative">
                  <div className="flex justify-between items-start mb-4">
                    <CardTitle className="font-black text-3xl tracking-tight text-slate-900 uppercase">
                      {plan.title}
                    </CardTitle>
                    {plan?.popular ? (
                      <Crown className="size-6 text-primary animate-pulse" />
                    ) : plan.name !== 'free' ? (
                      <Sparkles className="size-6 text-amber-500" />
                    ) : null}
                  </div>

                  <div className="flex items-baseline gap-1 pt-2">
                    <span className="font-black text-5xl tracking-tighter text-slate-950">
                      {formatPrice(plan.price)}
                    </span>
                    <span className="font-bold text-slate-400 text-sm uppercase tracking-wider">
                      {plan.frequency}
                    </span>
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
                  <p className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">O que está incluso:</p>

                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <div className="bg-green-50 p-1 rounded-full group-hover:scale-110 transition-transform">
                        <Check className="size-4 text-green-600" strokeWidth={3} />
                      </div>
                      <span className="text-slate-700 font-semibold text-sm">
                        {plan.addresses.quantity === -1 ? 'Endereços Ilimitados' : `${plan.addresses.quantity} Endereços`}
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="bg-green-50 p-1 rounded-full group-hover:scale-110 transition-transform">
                        <Check className="size-4 text-green-600" strokeWidth={3} />
                      </div>
                      <span className="text-slate-700 font-semibold text-sm">
                        {plan.businessPhones.quantity === -1 ? 'Telefones Ilimitados' : `${plan.businessPhones.quantity} Telefones`}
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      {plan.activeSocialMedias > 0 ? (
                        <>
                          <div className="bg-green-50 p-1 rounded-full group-hover:scale-110 transition-transform">
                            <Check className="size-4 text-green-600" strokeWidth={3} />
                          </div>
                          <span className="text-slate-700 font-semibold text-sm">
                            {plan.activeSocialMedias} Links de Redes Sociais
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="bg-slate-50 p-1 rounded-full opacity-40">
                            <X className="size-4 text-slate-400" strokeWidth={3} />
                          </div>
                          <span className="text-slate-400 font-medium text-sm line-through">
                            Redes Sociais
                          </span>
                        </>
                      )}
                    </li>

                    {plan?.name !== 'free' ? (
                      <li className="flex items-center gap-3">
                        <div className="bg-green-50 p-1 rounded-full group-hover:scale-110 transition-transform">
                          <Check className="size-4 text-green-600" strokeWidth={3} />
                        </div>
                        <span className="text-slate-700 font-semibold text-sm">Galeria de Fotos Completa</span>
                      </li>
                    ) : (
                      <li className="flex items-center gap-3 opacity-40">
                        <div className="bg-slate-50 p-1 rounded-full">
                          <X className="size-4 text-slate-400" strokeWidth={3} />
                        </div>
                        <span className="text-slate-400 font-medium text-sm line-through">Galeria de Fotos</span>
                      </li>
                    )}
                  </ul>
                </CardContent>

                <CardFooter className="pt-8 pb-10">
                  <Button
                    onClick={() => setSelectedPlan(plan)}
                    disabled={plan.name.toLowerCase() === currentPlan?.toLowerCase()}
                    className={cn(
                      "w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300",
                      plan.name.toLowerCase() === currentPlan?.toLowerCase()
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : plan.popular
                          ? "bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-[1.02]"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                    variant="ghost"
                  >
                    {plan.name.toLowerCase() === currentPlan?.toLowerCase() ? 'Plano Atual' : `Escolher ${plan.title}`}
                    {plan.name.toLowerCase() !== currentPlan?.toLowerCase() && (
                      <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
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
        <DialogContent className="sm:max-w-[425px] rounded-[3rem] p-4 bg-slate-50 border-none overflow-hidden sm:rounded-[3rem]">
          <div className="bg-white rounded-[2.5rem] p-8 space-y-6 shadow-sm border border-slate-100">
            <DialogHeader className="space-y-4">
              <div className="mx-auto bg-primary/10 size-16 rounded-full flex items-center justify-center">
                <ShieldCheck className="size-8 text-primary" />
              </div>
              <div className="text-center space-y-1">
                <DialogTitle className="text-2xl font-black text-slate-950 uppercase tracking-tighter">
                  Quase lá!
                </DialogTitle>
                <DialogDescription className="font-semibold text-slate-500">
                  Você está selecionando o plano <span className="text-primary">{selectedPlan?.title}</span>
                </DialogDescription>
              </div>
            </DialogHeader>

            {selectedPlan && (
              <div className="bg-slate-50 rounded-3xl p-6 text-center space-y-2 border border-dashed border-slate-200">
                {selectedPlan.price === 0 ? (
                  <>
                    <p className="font-black text-4xl text-primary tracking-tighter uppercase">
                      100% Grátis
                    </p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                      Sem custos de manutenção
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-black text-4xl text-slate-950 tracking-tighter">
                      {formatPrice(selectedPlan.price)}
                    </p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                      Pagamento anual
                    </p>
                    <p className="text-[10px] font-bold text-primary/50 uppercase tracking-widest mt-1">
                      Apenas {formatPrice(selectedPlan.price / 12)} / mês
                    </p>
                  </>
                )}
              </div>
            )}

            <DialogFooter className="flex-col sm:flex-col gap-3 mt-4">
              <Button
                onClick={handleConfirmPlan}
                disabled={isPending}
                className="w-full bg-primary h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:bg-primary/90"
              >
                {isPending ? 'Processando...' : (selectedPlan?.price === 0 ? 'Ativar Plano Grátis' : 'Confirmar Assinatura')}
              </Button>
              <Button
                variant="ghost"
                onClick={handleCloseModal}
                disabled={isPending}
                className="w-full h-12 rounded-2xl font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-100 uppercase text-[10px] tracking-widest"
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
