import {
  type PlanItemProps,
  type PlanTypeProps,
  plansBusinessConfig,
} from '@/configs/plans-business'
import { authOptions } from '@/lib/auth'
import { getPlanStatus } from '@/utils/get-plan-status'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { ManagePlans } from './components/manage-plans'
import { CurrentPlan } from './components/current-plan'

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

  if (!session) {
    redirect('/')
  }

  const user = session?.user
  
  // Buscar status do plano (focando em perfis/business)
  const planActive = (user as any).planActive?.profiles || (user as any).planActive
  const planStatus = getPlanStatus({
    ...user,
    planActive
  } as any)

  // Pegar preço do plano atual da config
  const currentPlanConfig = plansBusinessConfig[planStatus.planType as keyof typeof plansBusinessConfig]
  const currentPrice = currentPlanConfig?.price || 0

  return (
    <div className="flex flex-col gap-10">
      <CurrentPlan 
        planType={planStatus.planType}
        status={planStatus.status}
        expiresIn={planStatus.expiresIn}
        price={currentPrice}
      />
      
      <div className="space-y-4">
         <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Opções de Upgrade</h2>
            <p className="text-slate-500 font-medium text-sm">Escolha um dos planos abaixo para mudar sua categoria de destaque.</p>
         </div>
         <ManagePlans plans={plansArray} currentPlan={planStatus.planType} />
      </div>
    </div>
  )
}
