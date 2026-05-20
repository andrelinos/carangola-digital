'server-only'

import { cache } from 'react'

import type { ProfileDataProps } from '@/_types/profile-data'
import type { UserProps } from '@/_types/user'
import { plansBusinessConfig } from '@/configs/plans-business'

import { filterUserDataByPlan } from '@/lib/filter-user-data-by-plan'
import { db, getDownloadURLFromPath } from '@/lib/firebase'
import { getPlanConfig } from '@/utils/get-plan-config'

export const getProfileData = cache(
  async (slug: string, userId?: string): Promise<ProfileDataProps | null> => {
    if (!slug) {
      return null
    }

    // Suporta busca tanto por ID do documento do perfil quanto pelo slug amigável
    let profileDoc = await db.collection('profiles').doc(slug).get()
    let profileData: ProfileDataProps

    if (profileDoc.exists) {
      profileData = profileDoc.data() as ProfileDataProps
    } else {
      const snapshot = await db
        .collection('profiles')
        .where('slug', '==', slug)
        .limit(1)
        .get()

      if (snapshot.empty) {
        return null
      }
      profileDoc = snapshot.docs[0]
      profileData = profileDoc.data() as ProfileDataProps
    }
    const profileDocId = profileDoc.id

    let currentUserRating: number | null = null

    if (userId) {
      const ratingDoc = await db
        .collection('ratings')
        .doc(`${userId}_${profileDocId}`)
        .get()

      if (ratingDoc.exists) {
        currentUserRating = ratingDoc.data()?.score || null
      }
    }

    const coverPath = profileData.coverImagePath || profileData.imagePath
    const logoPath = profileData.logoImagePath

    const [coverImageUrl, logoImageUrl] = await Promise.all([
      getDownloadURLFromPath(coverPath),
      getDownloadURLFromPath(logoPath),
    ])

    const { socialMedias, businessPhones, businessAddresses } = profileData

    // Busca dados do proprietário do perfil na coleção 'users' para obter o plano ativo
    let userPlanActive = null
    if (profileData.userId) {
      try {
        const userDoc = await db.collection('users').doc(profileData.userId).get()
        if (userDoc.exists) {
          const userData = userDoc.data()
          userPlanActive =
            userData?.planActive?.profiles ??
            userData?.planActive ??
            null
        }
      } catch (err) {
        console.error('Erro ao buscar plano ativo do usuário:', err)
      }
    }

    // Define o planActive usando o plano do usuário (ou fallback para o perfil)
    const planActive = userPlanActive ?? profileData.planActive ?? null

    // Determina a config do plano usando o utilitário getPlanConfig, que valida status e expiração.
    const planConfig = getPlanConfig(planActive as any)

    const allowedInformationByFilterDataPlan = filterUserDataByPlan({
      itemsToFilter: {
        socialMedias,
        businessPhones,
        businessAddresses,
      },
      planConfig,
      planActive: planActive as any,
    })

    const resolvedPlanType = planActive?.type || planActive?.planType || 'free'
    const planActiveObj = planActive
      ? {
          ...planActive,
          planType: resolvedPlanType,
          type: resolvedPlanType,
        }
      : undefined

    const formattedData: ProfileDataProps = {
      ...profileData,
      id: profileDocId,
      coverImageUrl: coverImageUrl,
      logoImageUrl: logoImageUrl,
      currentUserRating,

      imagePath: coverImageUrl,
      socialMedias: { ...allowedInformationByFilterDataPlan.socialMedias },
      businessPhones: allowedInformationByFilterDataPlan.businessPhones,
      businessAddresses: allowedInformationByFilterDataPlan.businessAddresses,
      planActive: planActiveObj as any,
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
  } catch (_error) {
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
  } catch (_error) {
    return null
  }
}
