'use server'

import { db } from '@/lib/firebase'

export async function checkIfSlugExists(slug: string) {
  if (!slug) {
    return true
  }

  try {
    const profilesRef = db.collection('profiles')
    const q = profilesRef.where('slug', '==', slug).limit(1)

    const snapshot = (await q.get()).empty

    return !snapshot
  } catch (error) {
    return true
  }
}
