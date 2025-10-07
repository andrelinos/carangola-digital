'server-only'

import type { ProfileDataProps } from '@/_types/profile-data'
import type { UserProps } from '@/_types/user'

import { plansConfig } from '@/configs/plans'
import { filterUserDataByPlan } from '@/lib/filter-user-data-by-plan'
import { db, getDownloadURLFromPath } from '@/lib/firebase'

export async function getProfileData(
  profileId: string
): Promise<ProfileDataProps | null> {
  if (!profileId) {
    return null
  }

  const snapshot = await db.collection('profiles').doc(profileId).get()

  if (!snapshot.exists) {
    return null
  }

  const profileData = snapshot.data() as ProfileDataProps

  const coverPath = profileData.coverImagePath || profileData.imagePath
  const logoPath = profileData.logoImagePath

  const [coverImageUrl, logoImageUrl] = await Promise.all([
    getDownloadURLFromPath(coverPath),
    getDownloadURLFromPath(logoPath),
  ])

  const { socialMedias, businessPhones, businessAddresses, planActive } =
    profileData

  const allowedInformationByFilterDataPlan = filterUserDataByPlan({
    itemsToFilter: {
      socialMedias,
      businessPhones,
      businessAddresses,
    },
    planConfig: plansConfig[profileData?.planActive?.type] || plansConfig.free,
    planActive,
  })

  const formattedData: ProfileDataProps = {
    ...profileData,
    coverImageUrl: coverImageUrl,
    logoImageUrl: logoImageUrl,

    imagePath: coverImageUrl,
    socialMedias: { ...allowedInformationByFilterDataPlan.socialMedias },
    businessPhones: allowedInformationByFilterDataPlan.businessPhones,
    businessAddresses: allowedInformationByFilterDataPlan.businessAddresses,
  }

  return formattedData
}

export async function getUsersData(userId: string) {
  if (!userId) {
    return null
  }

  try {
    const snapshot = await db.collection('users').doc(userId).get()

    if (!snapshot) {
      return null
    }

    const docs = snapshot.data()

    return docs as UserProps
  } catch (error) {
    return null
  }
}

export async function getProfileId(userId?: string) {
  if (!userId) {
    return null
  }

  try {
    const snapshot = await db
      .collection('profiles')
      .where('userId', '==', userId)
      .where('isPrimary', '==', true)
      .limit(1)
      .get()

    if (!snapshot.docs) {
      return null
    }

    return snapshot.docs.map(doc => doc.id)
  } catch (error) {
    return
  }
}
