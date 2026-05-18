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
    userData?.planActive?.profiles ??
    userData?.planActive ??
    null

  const planStatus = getPlanStatus({
    ...user,
    planActive,
    hasProfileLink: userData?.hasProfileLink ?? user.hasProfileLink ?? false,
    myProfileLink: userData?.myProfileLink ?? user.myProfileLink ?? '',
  } as any)

  const currentPlanConfig =
    plansBusinessConfig[planStatus.planType as keyof typeof plansBusinessConfig]
  const currentPrice = currentPlanConfig?.price ?? 0
  const currentPlanTitle = currentPlanConfig?.title ?? planStatus.planType.toUpperCase()

  // Assinatura paga ativa: planType != 'free' e status = true (não expirou)
  const hasActivePaidPlan = planStatus.planType !== 'free' && planStatus.status === true

  // Esconde o plano free da lista quando o usuário já possui uma assinatura paga e válida
  const visiblePlans = hasActivePaidPlan
    ? plansArray.filter(p => p.name !== 'free')
    : plansArray

  return (
    <div className="flex flex-col gap-10">
      <CurrentPlan
        planType={planStatus.planType}
        planTitle={currentPlanTitle}
        status={planStatus.status}
        expiresIn={planStatus.expiresIn}
        price={currentPrice}
        asaasSubscriptionStatus={userData?.asaasSubscriptionStatus ?? null}
      />

      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-black text-2xl text-slate-900 uppercase italic tracking-tighter">
            {hasActivePaidPlan ? 'Alterar Plano' : 'Opções de Upgrade'}
          </h2>
          <p className="font-medium text-slate-500 text-sm">
            {hasActivePaidPlan
              ? 'Faça upgrade ou downgrade para outro plano pago a qualquer momento.'
              : 'Escolha um dos planos abaixo para mudar sua categoria de destaque.'}
          </p>
        </div>
        <ManagePlans
          plans={visiblePlans}
          currentPlan={planStatus.planType}
          userId={user.id}
          userEmail={user.email ?? ''}
          userName={user.name ?? user.email ?? ''}
        />
      </div>
    </div>
  )
}
