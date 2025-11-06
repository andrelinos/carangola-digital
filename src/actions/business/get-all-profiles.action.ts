'use server'

import { verifyAdmin } from '@/app/server/verify-admin.server'
import { db } from '@/lib/firebase'

export async function getAllProfiles() {
  await verifyAdmin()

  const profilesSnapshot = await db
    .collection('profiles')
    .orderBy('createdAt', 'desc')
    .get()
  const profiles = profilesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))

  return profiles
}
