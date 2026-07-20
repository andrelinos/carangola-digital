import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import {
  type PlanItemProps,
  type PlanTypeProps,
  plansBusinessConfig,
} from '@/configs/plans-business'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { getPlanStatus } from '@/utils/get-plan-status'
import { CurrentPlan } from './components/current-plan'
import { ManagePlans } from './components/manage-plans'

const plansArray: PlanItemProps[] = Object.entries(plansBusinessConfig)
  .filter(([name]) => name !== 'master')
  .map(([name, config]) => ({
    name: name as Exclude<PlanTypeProps, 'master'>,
    activeSocialMedias: Object.values(config.socialMedias).filter(Boolean)
      .length,
    ...config,
  }))

/** Calcula o preço de upgrade com 80% do crédito de pro-rata */
function calcUpgradePrice(
  currentPlanPrice: number, // em centavos
  planExpiresAt: number | null,
  newPlanPrice: number // em centavos
): number {
  const MIN = 9.99
  const RETENTION = 0.8
  if (!planExpiresAt) return newPlanPrice / 100
  const msPerDay = 1000 * 60 * 60 * 24
  const remainingDays = Math.max(
    0,
    Math.ceil((planExpiresAt - Date.now()) / msPerDay)
  )
  const dailyRate = currentPlanPrice / 100 / 365
  const rawCredit = remainingDays * dailyRate
  const credit = Math.round(rawCredit * RETENTION * 100) / 100
  const price = Math.round((newPlanPrice / 100 - credit) * 100) / 100
  return Math.max(price, MIN)
}

export default async function Plans() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/')
  }

  const { user } = session

  // ── Busca dados frescos do Firestore ──────────────────────────────────────
  // NÃO usamos a sessão para dados de plano, pois o webhook do Asaas atualiza
  // o Firestore diretamente e a sessão só é renovada no próximo login.
  const userDoc = await db.collection('users').doc(user.id).get()
  const userData = userDoc.data()

  // Suporta tanto a estrutura nova (profiles nested) quanto dados legados
  const planActive =
    userData?.planActive?.profiles ?? userData?.planActive ?? null

  const planStatus = getPlanStatus({
    ...user,
    planActive,
    hasProfileLink: userData?.hasProfileLink ?? user.hasProfileLink ?? false,
    myProfileLink: userData?.myProfileLink ?? user.myProfileLink ?? '',
  } as any)

  const currentPlanConfig =
    plansBusinessConfig[planStatus.planType as keyof typeof plansBusinessConfig]
  const currentPrice = currentPlanConfig?.price ?? 0
  const currentPlanTitle =
    currentPlanConfig?.title ?? planStatus.planType.toUpperCase()

  const planExpiresAt: number | null = userData?.planExpiresAt ?? null

  // ── Regras de exibição de planos ──────────────────────────────────────────
  // Pro  → sem upgrades (teto do produto)
  // Basic ativo → apenas Pro com preço de upgrade
  // Free / Basic expirado → todos os planos pagos
  const currentPlanType = planStatus.planType
  const hasActivePaidPlan =
    currentPlanType !== 'free' && planStatus.status === true

  let visiblePlans: (PlanItemProps & { upgradePrice?: number })[] = []

  if (currentPlanType === 'pro') {
    // Pro: nenhum upgrade disponível
    visiblePlans = []
  } else if (currentPlanType === 'basic' && hasActivePaidPlan) {
    // Basic ativo: apenas o Pro com preço de upgrade calculado
    const proPlan = plansArray.find(p => p.name === 'pro')
    if (proPlan) {
      const upgradePrice = calcUpgradePrice(
        plansBusinessConfig.basic.price,
        planExpiresAt,
        plansBusinessConfig.pro.price
      )
      visiblePlans = [{ ...proPlan, upgradePrice }]
    }
  } else {
    // Free ou sem plano ativo: exibe basic e pro
    visiblePlans = plansArray.filter(p => p.name !== 'free')
  }

  return (
    <div className="flex flex-col gap-10">
      <CurrentPlan
        planType={planStatus.planType}
        planTitle={currentPlanTitle}
        status={planStatus.status}
        expiresIn={planStatus.expiresIn}
        price={currentPrice}
        asaasSubscriptionStatus={userData?.asaasSubscriptionStatus ?? null}
        planExpiresAt={planExpiresAt}
      />

      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-black text-2xl text-foreground uppercase italic tracking-tighter">
            {currentPlanType === 'pro'
              ? 'Você está no melhor plano'
              : currentPlanType === 'basic' && hasActivePaidPlan
                ? 'Faça Upgrade para o Pro'
                : 'Opções de Plano'}
          </h2>
          <p className="font-medium text-muted-foreground text-sm">
            {currentPlanType === 'pro'
              ? 'O plano Pro é o teto da plataforma. Aproveite ao máximo!'
              : currentPlanType === 'basic' && hasActivePaidPlan
                ? 'Migre para o Pro com desconto proporcional ao tempo restante do seu plano atual.'
                : 'Escolha um dos planos abaixo para destacar seu negócio.'}
          </p>
        </div>
        {visiblePlans.length > 0 && (
          <ManagePlans
            plans={visiblePlans}
            currentPlan={planStatus.planType}
            userId={user.id}
            userEmail={user.email ?? ''}
            userName={user.name ?? user.email ?? ''}
          />
        )}
        {currentPlanType === 'pro' && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 text-center dark:border-amber-800/30 dark:bg-amber-950/20">
            <p className="font-black text-amber-700 text-sm uppercase tracking-widest dark:text-amber-400">
              🏆 Você já está no plano mais completo da plataforma!
            </p>
            <p className="mt-1 font-medium text-muted-foreground text-xs">
              Aproveite todos os benefícios exclusivos do Plano Pro.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
