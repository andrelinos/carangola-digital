'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Crown,
  ExternalLink,
  Loader2,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { PlanItemProps, PlanTypeProps } from '@/configs/plans-business'
import { cn } from '@/lib/utils'
import { formatCep } from '@/utils/format-cep'
import { formatCpfCnpj } from '@/utils/format-cpf-cnpj'
import { formatPhoneNumber } from '@/utils/format-phone-number'
import { formatPrice } from '@/utils/format-price'

interface ManagePlansProps {
  plans: (PlanItemProps & { upgradePrice?: number })[]
  currentPlan?: string
  userId: string
  userEmail: string
  userName: string
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

export function ManagePlans({
  plans,
  currentPlan,
  userId,
  userEmail,
  userName,
}: ManagePlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<(PlanItemProps & { upgradePrice?: number }) | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [hasStartedCheckout, setHasStartedCheckout] = useState(false)
  const router = useRouter()

  // Atualiza os dados da página (server components) quando o usuário volta da aba de checkout
  useEffect(() => {
    if (!hasStartedCheckout) return

    const handleFocus = () => {
      router.refresh()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [hasStartedCheckout, router])

  // NOVO: Estado para armazenar o endereço de cobrança
  const [billingAddress, setBillingAddress] = useState({
    postalCode: '',
    address: '',
    addressNumber: '',
    province: '', // Bairro
    city: '',
    cpfCnpj: '',
    phone: '',
  })

  // NOVO: Função para atualizar o estado do endereço
  function handleAddressChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    const formatted =
      name === 'cpfCnpj'
        ? formatCpfCnpj(value)
        : name === 'postalCode'
          ? formatCep(value)
          : name === 'phone'
            ? formatPhoneNumber(value)
            : value
    setBillingAddress(prev => ({ ...prev, [name]: formatted }))
  }

  function handleCloseModal() {
    if (isPending) return
    setSelectedPlan(null)
    setCheckoutUrl(null)
  }

  async function handleConfirmPlan() {
    if (!selectedPlan) return

    // ── Plano Free: ativa diretamente via server action ──────────────────
    if (selectedPlan.name.toLowerCase() === 'free') {
      setIsPending(true)
      const result = await setFreePlanAction()
      setIsPending(false)

      if (result.success) {
        toast.success(`Plano ${selectedPlan.title} ativado com sucesso!`)
        handleCloseModal()
        router.refresh() // Atualiza a tela instantaneamente
      } else {
        toast.error(result.error || 'Erro ao ativar plano')
      }
      return
    }

    // ── Upgrade de plano pago → usa endpoint de upgrade com pro-rata ────
    const isUpgrade = !!selectedPlan.upgradePrice

    // Validação dos campos de endereço para planos pagos (somente no checkout novo)
    const { postalCode, address, addressNumber, province, city, cpfCnpj, phone } =
      billingAddress

    if (!isUpgrade && (!postalCode || !address || !addressNumber || !province || !city || !cpfCnpj || !phone)) {
      toast.error('Preencha todos os campos do endereço de cobrança.')
      return
    }

    setIsPending(true)

    try {
      if (isUpgrade) {
        // Upgrade: chama o endpoint de upgrade com pro-rata
        const res = await fetch('/api/asaas/upgrade-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            newPlanType: selectedPlan.name as Exclude<PlanTypeProps, 'free'>,
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Erro ao gerar cobrança de upgrade')
        }

        setCheckoutUrl(data.invoiceUrl)
      } else {
        // Nova assinatura: cria checkout Asaas normal
        const res = await fetch('/api/asaas/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planType: selectedPlan.name as Exclude<PlanTypeProps, 'free'>,
            userId,
            userEmail,
            userName,
            postalCode,
            address,
            addressNumber,
            province,
            city,
            cpfCnpj,
            phone,
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Erro ao criar checkout')
        }

        setCheckoutUrl(data.checkoutUrl)
      }
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'Erro ao iniciar pagamento'
      toast.error(msg)
    } finally {
      setIsPending(false)
    }
  }

  function handleGoToCheckout() {
    if (!checkoutUrl) return
    // Abre o checkout Asaas em nova aba para não perder a sessão
    window.open(checkoutUrl, '_blank', 'noopener,noreferrer')
    setHasStartedCheckout(true) // Marca que iniciou para dar refresh ao voltar
    handleCloseModal()
    toast.info('Finalize o pagamento na nova aba que foi aberta.')
  }

  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <header className="mb-16 space-y-4 text-center">
          <h2 className="font-black text-4xl text-foreground uppercase tracking-tighter md:text-5xl">
            Escolha seu{' '}
            <span className="text-primary italic">Nível de Destaque</span>
          </h2>
          <p className="mx-auto max-w-2xl font-medium text-lg text-muted-foreground italic">
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
          {plans?.map(planRaw => {
            const plan = planRaw as PlanItemProps & {
              tag?: string
              imageGallery?: { enabled: boolean; limit: number }
              premiumFeatures?: Record<string, boolean>
              upgradePrice?: number
            }
            return (
              <motion.div key={plan.name} variants={item}>
                <Card
                  className={cn(
                    'group relative flex h-full flex-col overflow-hidden border-2 bg-card text-card-foreground transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl',
                    plan?.popular
                      ? 'border-primary bg-slate-50/50 shadow-primary/5 hover:shadow-primary/10 dark:bg-primary/5'
                      : plan?.name === 'pro'
                        ? 'border-amber-500 bg-amber-50/30 hover:shadow-amber-500/20 dark:bg-amber-500/5'
                        : 'border-slate-100 hover:border-slate-200 dark:border-slate-800 dark:hover:border-slate-700'
                  )}
                >
                  {plan?.popular && (
                    <div className="pointer-events-none absolute top-0 right-0 size-32 overflow-hidden p-0">
                      <div className="absolute top-4 -right-8 w-32 rotate-45 bg-primary py-1 text-center font-black text-[10px] text-white uppercase tracking-widest shadow-lg">
                        Popular
                      </div>
                    </div>
                  )}

                  {plan?.tag && !plan.popular && (
                    <div className="pointer-events-none absolute top-0 right-0 size-32 overflow-hidden p-0">
                      <div className="absolute top-4 -right-8 w-32 rotate-45 bg-amber-500 py-1 text-center font-black text-[10px] text-white uppercase tracking-widest shadow-lg">
                        {plan.tag}
                      </div>
                    </div>
                  )}

                  {/* Badge de desconto de upgrade */}
                  {plan.upgradePrice !== undefined && (
                    <div className="pointer-events-none absolute top-0 left-0 size-32 overflow-hidden p-0">
                      <div className="absolute top-4 -left-8 w-32 -rotate-45 bg-green-600 py-1 text-center font-black text-[10px] text-white uppercase tracking-widest shadow-lg">
                        Upgrade
                      </div>
                    </div>
                  )}

                  <CardHeader className="relative pt-10 pb-6">
                    <div className="mb-4 flex items-start justify-between">
                      <CardTitle className="font-black text-3xl text-foreground uppercase tracking-tight">
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
                        <span className="font-black text-5xl text-foreground tracking-tighter">
                          {plan.price > 0
                            ? formatPrice(plan.price / 12)
                            : formatPrice(0)}
                        </span>
                        <span className="font-bold text-muted-foreground text-sm uppercase tracking-wider">
                          /mês
                        </span>
                      </div>
                      {plan.price > 0 && (
                        <span className="mt-1 font-bold text-muted-foreground/80 text-xs uppercase tracking-widest">
                          Faturado anualmente ({formatPrice(plan.price)})
                        </span>
                      )}
                      {/* Preço especial de upgrade */}
                      {plan.upgradePrice !== undefined && (
                        <div className="mt-3 space-y-1">
                          <span className="inline-block rounded-full border border-green-200 bg-green-50 px-3 py-1 font-black text-[11px] text-green-700 uppercase tracking-widest dark:border-green-800/40 dark:bg-green-950/30 dark:text-green-400">
                            Migre agora por {formatPrice(plan.upgradePrice * 100)}
                          </span>
                          <p className="font-medium text-[10px] text-muted-foreground">
                            Inclui desconto do tempo restante no plano atual
                          </p>
                        </div>
                      )}
                    </div>
                    <CardDescription className="pt-2 font-medium text-muted-foreground italic">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="grow space-y-6">
                    <div className="h-px w-full bg-slate-100 dark:bg-slate-800" />
                    <p className="font-black text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                      O que está incluso:
                    </p>

                    <ul className="space-y-4">
                      <li className="flex items-center gap-3">
                        <div className="rounded-full bg-green-500/10 p-1 transition-transform group-hover:scale-110">
                          <Check
                            className="size-4 text-green-600 dark:text-green-400"
                            strokeWidth={3}
                          />
                        </div>
                        <span className="font-semibold text-foreground text-sm">
                          {plan.addresses.quantity === -1
                            ? 'Endereços Ilimitados'
                            : `${plan.addresses.quantity} Endereços`}
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="rounded-full bg-green-500/10 p-1 transition-transform group-hover:scale-110">
                          <Check
                            className="size-4 text-green-600 dark:text-green-400"
                            strokeWidth={3}
                          />
                        </div>
                        <span className="font-semibold text-foreground text-sm">
                          {plan.businessPhones.quantity === -1
                            ? 'Telefones Ilimitados'
                            : `${plan.businessPhones.quantity} Telefones / WhatsApp`}
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        {plan.activeSocialMedias > 0 ? (
                          <>
                            <div className="rounded-full bg-green-500/10 p-1 transition-transform group-hover:scale-110">
                              <Check
                                className="size-4 text-green-600 dark:text-green-400"
                                strokeWidth={3}
                              />
                            </div>
                            <span className="font-semibold text-foreground text-sm">
                              {plan.activeSocialMedias} Links de Redes Sociais
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="rounded-full bg-slate-100 p-1 opacity-40 dark:bg-slate-800">
                              <X
                                className="size-4 text-muted-foreground"
                                strokeWidth={3}
                              />
                            </div>
                            <span className="font-medium text-muted-foreground text-sm line-through">
                              Redes Sociais
                            </span>
                          </>
                        )}
                      </li>

                      <li className="flex items-center gap-3">
                        {plan.imageGallery?.enabled ? (
                          <>
                            <div className="rounded-full bg-green-500/10 p-1 transition-transform group-hover:scale-110">
                              <Check
                                className="size-4 text-green-600 dark:text-green-400"
                                strokeWidth={3}
                              />
                            </div>
                            <span className="font-semibold text-foreground text-sm">
                              Até {plan.imageGallery.limit} Fotos na Galeria
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="rounded-full bg-slate-100 p-1 opacity-40 dark:bg-slate-800">
                              <X
                                className="size-4 text-muted-foreground"
                                strokeWidth={3}
                              />
                            </div>
                            <span className="font-medium text-muted-foreground text-sm line-through">
                              Galeria de Fotos
                            </span>
                          </>
                        )}
                      </li>

                      {[
                        {
                          key: 'prioritySearch',
                          label: 'Destaque no Topo das Buscas',
                        },
                        {
                          key: 'verifiedBadge',
                          label: 'Selo de Empresa Verificada',
                        },
                        {
                          key: 'hideCompetitors',
                          label: 'Página sem Concorrentes',
                        },
                        { key: 'stickyCta', label: 'Botão de Contato Fixo' },
                        { key: 'analytics', label: 'Painel de Métricas' },
                      ].map(feat => {
                        const hasFeature =
                          plan.premiumFeatures?.[
                            feat.key as keyof typeof plan.premiumFeatures
                          ]
                        return (
                          <li
                            key={feat.key}
                            className="flex items-center gap-3"
                          >
                            {hasFeature ? (
                              <>
                                <div className="rounded-full bg-green-500/10 p-1 transition-transform group-hover:scale-110">
                                  <Check
                                    className="size-4 text-green-600 dark:text-green-400"
                                    strokeWidth={3}
                                  />
                                </div>
                                <span className="font-semibold text-foreground text-sm">
                                  {feat.label}
                                </span>
                              </>
                            ) : (
                              <>
                                <div className="rounded-full bg-slate-100 p-1 opacity-40 dark:bg-slate-800">
                                  <X
                                    className="size-4 text-muted-foreground"
                                    strokeWidth={3}
                                  />
                                </div>
                                <span className="font-medium text-muted-foreground text-sm line-through">
                                  {feat.label}
                                </span>
                              </>
                            )}
                          </li>
                        )
                      })}
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
                          ? 'cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                          : plan.upgradePrice !== undefined
                            ? 'bg-green-600 text-white shadow-lg shadow-green-600/20 hover:scale-[1.02] hover:bg-green-700 dark:shadow-none'
                            : plan.popular
                              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] hover:bg-primary/90 dark:shadow-none'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                      )}
                      variant="ghost"
                    >
                      {plan.name.toLowerCase() === currentPlan?.toLowerCase()
                        ? 'Plano Atual'
                        : plan.upgradePrice !== undefined
                          ? `Fazer Upgrade por ${formatPrice(plan.upgradePrice * 100)}`
                          : `Escolher ${plan.title}`}
                      {plan.name.toLowerCase() !==
                        currentPlan?.toLowerCase() && (
                        <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* ── Modal de Confirmação / Checkout ─────────────────────────── */}
      <Dialog open={!!selectedPlan} onOpenChange={handleCloseModal}>
        <DialogContent className="overflow-hidden rounded-[3rem] border border-slate-100 bg-slate-50 p-4 sm:max-w-[425px] sm:rounded-[3rem] dark:border-slate-850 dark:bg-slate-950">
          <div className="space-y-6 rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <DialogHeader className="space-y-4">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="size-8 text-primary" />
              </div>
              <div className="space-y-1 text-center">
                <DialogTitle className="font-black text-2xl text-foreground uppercase tracking-tighter">
                  {checkoutUrl ? 'Link de Pagamento Pronto!' : 'Quase lá!'}
                </DialogTitle>
                <DialogDescription className="font-semibold text-muted-foreground">
                  {checkoutUrl ? (
                    'Clique abaixo para finalizar o pagamento de forma segura via Asaas.'
                  ) : (
                    <>
                      Você está selecionando o plano{' '}
                      <span className="text-primary">
                        {selectedPlan?.title}
                      </span>
                    </>
                  )}
                </DialogDescription>
              </div>
            </DialogHeader>

            {selectedPlan && !checkoutUrl && (
              <div className="space-y-4">
                <div className="space-y-2 rounded-3xl border border-slate-200 border-dashed bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-900/50">
                  {selectedPlan.price === 0 ? (
                    <>
                      <p className="font-black text-4xl text-primary uppercase tracking-tighter">
                        100% Grátis
                      </p>
                      <p className="font-bold text-muted-foreground text-xs uppercase tracking-[0.2em]">
                        Sem custos de manutenção
                      </p>
                    </>
                  ) : selectedPlan.upgradePrice !== undefined ? (
                    // ── Upgrade com desconto ──────────────────────────────
                    <>
                      <p className="font-bold text-[10px] text-green-700 uppercase tracking-widest dark:text-green-400">
                        ✦ Preço especial de migração
                      </p>
                      <div className="flex items-baseline justify-center gap-2 pt-1">
                        <p className="font-black text-muted-foreground text-xl line-through opacity-40">
                          {formatPrice(selectedPlan.price)}
                        </p>
                        <p className="font-black text-4xl text-green-700 tracking-tighter dark:text-green-400">
                          {formatPrice(selectedPlan.upgradePrice * 100)}
                        </p>
                      </div>
                      <p className="mt-1 font-bold text-[11px] text-muted-foreground uppercase tracking-[0.2em]">
                        + 1 ano no Plano {selectedPlan.title}
                      </p>
                      <p className="mt-2 font-semibold text-[11px] text-muted-foreground">
                        Desconto calculado com base nos dias restantes do seu plano atual
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-baseline justify-center gap-1">
                        <p className="font-black text-4xl text-foreground tracking-tighter">
                          {formatPrice(selectedPlan.price / 12)}
                        </p>
                        <p className="font-bold text-muted-foreground text-sm uppercase tracking-wider">
                          /mês
                        </p>
                      </div>
                      <p className="mt-1 font-bold text-[11px] text-muted-foreground uppercase tracking-[0.2em]">
                        Cobrado {formatPrice(selectedPlan.price)} por ano
                      </p>
                      <div className="mt-3">
                        <p className="inline-block rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-bold text-[10px] text-primary uppercase tracking-widest">
                          Apenas {formatPrice(selectedPlan.price / 365)} por
                          dia!
                        </p>
                      </div>
                      {/* Métodos de pagamento */}
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <span className="rounded-md bg-slate-100 px-2 py-1 font-bold text-[9px] text-slate-500 uppercase tracking-widest dark:bg-slate-800 dark:text-slate-400">
                          PIX
                        </span>
                        <span className="rounded-md bg-slate-100 px-2 py-1 font-bold text-[9px] text-slate-500 uppercase tracking-widest dark:bg-slate-800 dark:text-slate-400">
                          Boleto
                        </span>
                        <span className="rounded-md bg-slate-100 px-2 py-1 font-bold text-[9px] text-slate-500 uppercase tracking-widest dark:bg-slate-800 dark:text-slate-400">
                          Cartão
                        </span>
                      </div>
                    </>
                  )}
                </div>

                  {/* Formulário de endereço: apenas para novas assinaturas */}
                  {selectedPlan.price > 0 && !selectedPlan.upgradePrice && (
                  <div className="space-y-4 pt-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-foreground text-sm">
                        Endereço de Cobrança
                      </h4>
                      <p className="text-muted-foreground text-xs">
                        Exigido pelo sistema de pagamento
                      </p>
                    </div>

                    <div className="grid gap-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-1.5">
                          <Label htmlFor="cpfCnpj" className="text-xs">
                            CPF / CNPJ
                          </Label>
                          <Input
                            id="cpfCnpj"
                            name="cpfCnpj"
                            placeholder="000.000.000-00"
                            value={billingAddress.cpfCnpj}
                            onChange={handleAddressChange}
                            disabled={isPending}
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <Label htmlFor="phone" className="text-xs">
                            Telefone
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="(32) 99999-9999"
                            value={billingAddress.phone}
                            onChange={handleAddressChange}
                            disabled={isPending}
                          />
                        </div>
                      </div>

                      <div className="grid gap-1.5">
                        <Label htmlFor="postalCode" className="text-xs">
                          CEP
                        </Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          placeholder="00000-000"
                          value={billingAddress.postalCode}
                          onChange={handleAddressChange}
                          disabled={isPending}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2 grid gap-1.5">
                          <Label htmlFor="address" className="text-xs">
                            Endereço
                          </Label>
                          <Input
                            id="address"
                            name="address"
                            placeholder="Nome da rua"
                            value={billingAddress.address}
                            onChange={handleAddressChange}
                            disabled={isPending}
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <Label htmlFor="addressNumber" className="text-xs">
                            Número
                          </Label>
                          <Input
                            id="addressNumber"
                            name="addressNumber"
                            placeholder="123"
                            value={billingAddress.addressNumber}
                            onChange={handleAddressChange}
                            disabled={isPending}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-1.5">
                          <Label htmlFor="province" className="text-xs">
                            Bairro
                          </Label>
                          <Input
                            id="province"
                            name="province"
                            placeholder="Centro"
                            value={billingAddress.province}
                            onChange={handleAddressChange}
                            disabled={isPending}
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <Label htmlFor="city" className="text-xs">
                            Cidade
                          </Label>
                          <Input
                            id="city"
                            name="city"
                            placeholder="Sua cidade"
                            value={billingAddress.city}
                            onChange={handleAddressChange}
                            disabled={isPending}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Estado: Link gerado — mostra botão de ir para o checkout */}
            {checkoutUrl && (
              <div className="space-y-2 rounded-3xl border border-green-200 border-dashed bg-green-50 p-6 text-center dark:border-green-800/30 dark:bg-green-950/20">
                <p className="font-bold text-[10px] text-green-750 uppercase tracking-widest dark:text-green-400">
                  ✓ Checkout criado com sucesso
                </p>
                <p className="font-semibold text-muted-foreground text-xs">
                  Você será redirecionado para o ambiente seguro do Asaas para
                  escolher a forma de pagamento (PIX, Boleto ou Cartão).
                </p>
              </div>
            )}

            <DialogFooter className="mt-4 flex-col gap-3 sm:flex-col">
              {checkoutUrl ? (
                <>
                  <Button
                    onClick={handleGoToCheckout}
                    className="h-14 w-full rounded-2xl bg-primary font-black text-xs uppercase tracking-widest shadow-primary/20 shadow-xl hover:bg-primary/90"
                  >
                    <ExternalLink className="mr-2 size-4" />
                    Ir para o Pagamento
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleCloseModal}
                    className="h-12 w-full rounded-2xl font-bold text-[10px] text-muted-foreground uppercase tracking-widest hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800"
                  >
                    Fechar
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleConfirmPlan}
                    disabled={isPending}
                    className="h-14 w-full rounded-2xl bg-primary font-black text-xs uppercase tracking-widest shadow-primary/20 shadow-xl hover:bg-primary/90"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Gerando link de pagamento...
                      </>
                    ) : selectedPlan?.price === 0 ? (
                      'Ativar Plano Grátis'
                    ) : (
                      'Confirmar e Gerar Link'
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleCloseModal}
                    disabled={isPending}
                    className="h-12 w-full rounded-2xl font-bold text-[10px] text-muted-foreground uppercase tracking-widest hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800"
                  >
                    Voltar e revisar
                  </Button>
                </>
              )}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
