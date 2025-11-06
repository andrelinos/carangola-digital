import type { typeProps } from '@/_types/user'
import {
  type PlanConfigProps,
  plansBusinessConfig,
} from '@/configs/plans-business'

type Profile = {
  socialMedias?: Record<string, any> | Array<{ platform: string; value: any }>
  businessPhones?: Array<any>
  businessAddresses?: Array<any>
}

interface FilterUserDataByPlanProps {
  itemsToFilter: Profile
  planConfig: PlanConfigProps
  planActive?: {
    type: typeProps
    expiresAt: number
  }
}

export function filterUserDataByPlan({
  itemsToFilter,
  planConfig = plansBusinessConfig.free,
  planActive,
}: FilterUserDataByPlanProps) {
  const isPlanActive = planActive ? planActive.expiresAt > Date.now() : false

  const planConfigToUse = isPlanActive ? planConfig : plansBusinessConfig.free

  const allowedInfosInPlanList = Object.entries(planConfigToUse.socialMedias)
    .filter(([, allowed]) => allowed)
    .map(([platform]) => platform)

  const infosArray = Array.isArray(itemsToFilter.socialMedias)
    ? itemsToFilter.socialMedias
    : Object.entries(itemsToFilter.socialMedias || {}).map(
        ([platform, value]) => ({
          platform,
          value,
        })
      )

  const socialMedias = infosArray
    .filter(({ platform }) => allowedInfosInPlanList.includes(platform))
    .reduce<Record<string, any>>((acc, { platform, value }) => {
      acc[platform] = value
      return acc
    }, {})

  const businessPhones = (itemsToFilter.businessPhones || []).slice(
    0,
    planConfig.businessPhones.quantity
  )

  const businessAddresses = (itemsToFilter.businessAddresses || []).slice(
    0,
    planConfig.addresses.quantity
  )

  return { socialMedias, businessPhones, businessAddresses }
}
