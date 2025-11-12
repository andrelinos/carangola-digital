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

  const planStatus = getPlanStatus(user as any)

  if (planStatus.status && planStatus.myProfileLink) {
    return (
      <div className="mb-auto flex size-full">
        teste
        <ManagePlans plans={plansArray} />
      </div>
    )
  }

  return (
    <div className="mb-auto flex size-full">
      <ManagePlans plans={plansArray} />
    </div>
  )
}
