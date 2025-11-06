'use server'

import { db, getDownloadURLFromPath } from '@/lib/firebase'

export async function getUsersAdminsProfile(userId: string) {
  const profilesRef = db.collection('profiles')

  const q = profilesRef.where('userId', '==', userId)

  const snapshot = await q.get()

  if (snapshot.empty) {
    return null
  }

  const profilePromises = snapshot.docs.map(async doc => {
    const data = doc.data()

    const logoUrl = await getDownloadURLFromPath(data.logoImagePath)

    return {
      id: doc.id,
      ...data,
      logoUrl,
    }
  })

  const profiles = await Promise.all(profilePromises)

  return profiles
}
