'server-only'

import type { ProfileDataProps } from '@/_types/profile-data'

import { db, getDownloadURLFromPath } from '@/lib/firebase'

export async function getAllProfileData() {
  const snapshot = await db
    .collection('profiles')
    // .where('isPublished', '==', true)
    .orderBy('createdAt', 'desc')
    .get()

  if (!snapshot.docs) {
    return null
  }

  const data = snapshot.docs.map(doc => {
    const data = doc.data() as ProfileDataProps

    return {
      ...data,
      profileId: doc.id,
      imagePath: getDownloadURLFromPath(data.imagePath),
    }
  })

  return data
}
