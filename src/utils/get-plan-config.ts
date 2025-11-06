import {
  type PlanConfigProps,
  type PlanTypeProps,
  plansBusinessConfig,
} from '@/configs/plans-business'

type PlanActive = {
  type?: string
  status: string
  expiresAt: number
  // … demais campos do seu objeto
}

export function getPlanConfig(planActive?: PlanActive): PlanConfigProps {
  const now = Date.now()

  const isValid =
    planActive &&
    planActive.status === 'active' &&
    typeof planActive.expiresAt === 'number' &&
    planActive.expiresAt > now

  const key: PlanTypeProps =
    isValid && (planActive?.type as PlanTypeProps) in plansBusinessConfig
      ? (planActive?.type as PlanTypeProps)
      : 'free'

  return plansBusinessConfig[key]
}
