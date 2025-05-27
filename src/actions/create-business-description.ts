'use server'

import { Timestamp } from 'firebase-admin/firestore'

import { auth } from '@/lib/auth'
import { db } from '@/lib/firebase'

export async function createBusinessDescription(formData: FormData) {
  const session = await auth()

  if (!session) return

  try {
    const profileId = formData.get('profileId') as string
    const businessDescription = formData.get('businessDescription') as string

    await db.collection('profiles').doc(profileId).update({
      businessDescription,
      updatedAt: Timestamp.now().toMillis(),
    })

    return true
  } catch (error) {
    return false
  }
}
