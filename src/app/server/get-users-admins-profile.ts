'use server'

import { db, getDownloadURLFromPath } from '@/lib/firebase'

export async function getUsersAdminsProfile(userId: string) {
  const profilesRef = db.collection('profiles')

  const userDoc = await db.collection('users').doc(userId).get()
  const userData = userDoc.exists ? userDoc.data() : null
  const rawPlanActive = userData?.planActive?.profiles ?? userData?.planActive ?? null

  const resolvedPlanType = rawPlanActive?.type || rawPlanActive?.planType || 'free'
  const planActiveObj = rawPlanActive
    ? {
        ...rawPlanActive,
        planType: resolvedPlanType,
        type: resolvedPlanType,
      }
    : {
        planType: 'free',
        type: 'free',
        expiresAt: null,
      }

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
      planActive: planActiveObj,
    }
  })

  const profiles = await Promise.all(profilePromises)

  return profiles
}
