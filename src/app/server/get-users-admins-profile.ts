import 'server-only'

import type { ProfileDataProps } from '@/_types/profile-data'

import { db, getDownloadURLFromPath } from '@/lib/firebase'

export async function getUsersAdminsProfile(profileId: string) {
  const snapshot = await db.collection('profiles').doc(profileId).get()

  if (!snapshot.exists) {
    return null
  }

  const data = snapshot.data() as ProfileDataProps

  const imageUrl = await getDownloadURLFromPath(data.imagePath)

  const formattedData = {
    ...data,
    imagePath: imageUrl,
  }

  return formattedData
}
