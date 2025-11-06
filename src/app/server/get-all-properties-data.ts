'server-only'

import type { PropertyImage, PropertyProps } from '@/_types/property'
import { db, getDownloadURLFromPath } from '@/lib/firebase'

export async function getAllPropertiesData() {
  const snapshot = await db
    .collectionGroup('user_properties')
    .where('isPublished', '==', true)
    .orderBy('createdAt', 'desc')
    .get()

  if (!snapshot.docs) {
    return null
  }

  const data = snapshot.docs.map(doc => {
    const data = doc.data() as PropertyProps

    const firstImage = Array.isArray(data.images) ? data.images[0] : undefined

    const firstPath: string | undefined = firstImage
      ? typeof firstImage === 'string'
        ? firstImage
        : (firstImage as PropertyImage)?.path
      : undefined

    const firstImageObject = { path: firstPath }
    const imageUrl = getDownloadURLFromPath(firstImageObject.path)

    return {
      ...data,
      propertiesId: doc.id,
      imageUrl,
    }
  })

  return data
}
