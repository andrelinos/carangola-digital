'server-only'

import { cache } from 'react'

import type { ProfileDataProps } from '@/_types/profile-data'
import type { UserProps } from '@/_types/user'
import { plansBusinessConfig } from '@/configs/plans-business'

import { filterUserDataByPlan } from '@/lib/filter-user-data-by-plan'
import { db, getDownloadURLFromPath } from '@/lib/firebase'

export const getProfileData = cache(
  async (slug: string): Promise<ProfileDataProps | null> => {
    if (!slug) {
      return null
    }

    const snapshot = await db
      .collection('profiles')
      .where('slug', '==', slug)
      .get()

    if (snapshot.empty) {
      return null
    }

    const profileDoc = snapshot.docs[0]
    const profileDocId = profileDoc.id

    const profileData = profileDoc.data() as ProfileDataProps

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
      planConfig:
        plansBusinessConfig[profileData?.planActive?.type] ||
        plansBusinessConfig.free,
      planActive,
    })

    const formattedData: ProfileDataProps = {
      ...profileData,
      id: profileDocId,
      coverImageUrl: coverImageUrl,
      logoImageUrl: logoImageUrl,

      imagePath: coverImageUrl,
      socialMedias: { ...allowedInformationByFilterDataPlan.socialMedias },
      businessPhones: allowedInformationByFilterDataPlan.businessPhones,
      businessAddresses: allowedInformationByFilterDataPlan.businessAddresses,
    }

    return formattedData
  }
)

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
      // .where('isPrimary', '==', true)
      .limit(1)
      .get()

    if (!snapshot.docs) {
      return null
    }

    return snapshot.docs.map(doc => doc.id)
  } catch (error) {
    return null
  }
}
