'server-only'

import type { PropertyImage, PropertyProps } from '@/_types/property'
import type { UserProps } from '@/_types/user'

import { db, getDownloadURLFromPath } from '@/lib/firebase'

import {
  type PlanConfigProps,
  type PlanTypeProps,
  plansRealEstateConfig,
} from '@/configs/plans-real-estate'

export type PropertyDataWithConfig = {
  property: PropertyProps
  config: PlanConfigProps
}

export async function getPropertyData(
  slug: string
): Promise<PropertyProps | null> {
  if (!slug) {
    return null
  }

  console.log('SLUG', slug)

  const snapshot = await db
    .collectionGroup('user_properties')
    .where('slug', '==', slug)
    .orderBy('createdAt', 'desc')
    .limit(1)
    .get()

  if (snapshot.empty) {
    return null
  }

  const propertyDoc = snapshot.docs[0]
  const propertyData = propertyDoc.data() as PropertyProps

  const userDocRef = propertyDoc.ref.parent.parent
  const docPath = propertyDoc.ref.path

  if (!userDocRef) {
    console.warn('Impossível encontrar o usuário pai para o imóvel:', slug)
    return null
  }

  const userSnapshot = await userDocRef.get()

  if (!userSnapshot?.exists) {
    console.error('O documento do usuário proprietário não existe.')
    return null
  }

  const userData = userSnapshot.data() as UserProps

  const userPlan = (userData?.plan || 'free') as PlanTypeProps

  const planConfig: PlanConfigProps =
    plansRealEstateConfig[userPlan] || plansRealEstateConfig.free

  const imagePaths: (string | undefined)[] = Array.isArray(propertyData.images)
    ? propertyData.images.map(img =>
        typeof img === 'string' ? img : (img as PropertyImage)?.path
      )
    : []

  const validPaths = imagePaths.filter((p): p is string => Boolean(p))

  const tempImages = await Promise.all(
    validPaths.map(async path => {
      const url = await getDownloadURLFromPath(path)
      return url ? { path, url } : null
    })
  )
  const images: PropertyImage[] = tempImages.filter(
    (img): img is PropertyImage => img !== null
  )

  const formattedData: PropertyProps = {
    ...propertyData,
    images,
    planConfig,
    docPath,
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

export async function getPropertyId(userId?: string) {
  if (!userId) {
    return null
  }

  try {
    const snapshot = await db
      .collection('properties')
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
