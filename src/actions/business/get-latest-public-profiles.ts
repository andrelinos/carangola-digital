'use server'

import type { ProfileDataProps } from '@/_types/profile-data'
import { db, getDownloadURLFromPath } from '@/lib/firebase'

export type PublicProfileCardData = {
  id: string
  name: string
  slug: string
  logoImageUrl: string | null
  category: string | null
  openingHours: ProfileDataProps['openingHours']
}

export async function getLatestPublicProfiles(): Promise<
  PublicProfileCardData[]
> {
  try {
    const profilesSnapshot = await db
      .collection('profiles')
      .where('isPublished', '==', true)
      .orderBy('isTopCompanies', 'desc')
      .orderBy('createdAt', 'desc')
      .limit(12)
      .get()

    const profiles = await Promise.all(
      profilesSnapshot.docs.map(async doc => {
        const data = doc.data()

        const imagePath =
          data.logoImagePath || data.coverImagePath || data.imagePath
        const imageUrl = await getDownloadURLFromPath(imagePath)

        return {
          ...data,
          id: doc.id,
          name: data.name || 'Nome não informado',
          logoImageUrl: imageUrl,

          openingHours: doc.data().openingHours,
          category:
            Array.isArray(data.categories) && data.categories.length > 0
              ? data.categories[0]
              : data.category || null,
        } as PublicProfileCardData
      })
    )

    return profiles
  } catch (error: any) {
    console.error('Error :: ', error)
    throw new Error('Error:: ', error)
  }
}
