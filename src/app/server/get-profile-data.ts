import 'server-only'

import type { ProfileDataProps } from '@/_types/profile-data'
import type { UserProps } from '@/_types/user'

import { db, getDownloadURLFromPath } from '@/lib/firebase'

export async function getProfileData(profileId: string) {
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

export async function getUsersData(userId: string) {
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
      .get()

    if (!snapshot.docs) {
      return null
    }

    return snapshot.docs.map(doc => doc.id)
  } catch (error) {
    return
  }
}
