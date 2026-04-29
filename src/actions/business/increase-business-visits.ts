'use server'

import { FieldValue } from 'firebase-admin/firestore'

import { db } from '@/lib/firebase'

export async function increaseBusinessVisits({
  profileId,
}: {
  profileId?: string
}) {
  if (!profileId) return null

  try {
    const profileRef = db.collection('profiles').doc(profileId)

    await profileRef.update({
      totalVisits: FieldValue.increment(1),
    })
    return { success: true }
  } catch (_error) {
    return null
  }
}
