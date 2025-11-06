'use server'

import type { PropertyImage, PropertyProps } from '@/_types/property'
import { db, getDownloadURLFromPath } from '@/lib/firebase'

export async function getLatestPublicProperties(): Promise<
  PropertyProps[] | null
> {
  try {
    const snapshot = await db
      .collectionGroup('user_properties')
      .where('isPublished', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(12)
      .get()

    if (snapshot.empty) {
      return []
    }

    const properties = await Promise.all(
      snapshot.docs.map(async doc => {
        const data = doc.data()

        const firstImage = Array.isArray(data.images)
          ? data.images[0]
          : undefined

        const firstPath: string | undefined = firstImage
          ? typeof firstImage === 'string'
            ? firstImage
            : (firstImage as PropertyImage)?.path
          : undefined

        const firstImageObject = { path: firstPath }

        const imageUrl = await getDownloadURLFromPath(firstImageObject.path)

        return {
          ...data,
          id: doc.id,
          thumbnail: imageUrl,
        } as PropertyProps
      })
    )

    return properties
  } catch (error: any) {
    console.error('Erro ao carregar as últimas propriedades :: ', error)
    throw new Error('Erro ao carregar as últimas propriedades')
  }
}
