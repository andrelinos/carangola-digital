import {
  type PlanConfigProps,
  type PlanTypeProps,
  plansBusinessConfig,
} from '@/configs/plans-business'

type PlanActive = {
  type?: string
  status: string
  expiresAt: number | null // null = plano free permanente
  // … demais campos do seu objeto
}

export function getPlanConfig(planActive?: PlanActive): PlanConfigProps {
  const now = Date.now()

  // expiresAt null = plano free (sem data de expiração definida)
  const isValid =
    planActive &&
    planActive.status === 'active' &&
    typeof planActive.expiresAt === 'number' &&
    planActive.expiresAt > now

  const rawType = planActive?.type || (planActive as any)?.planType
  const key: PlanTypeProps =
    isValid && rawType in plansBusinessConfig
      ? (rawType as PlanTypeProps)
      : 'free'

  return plansBusinessConfig[key]
}

