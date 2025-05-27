'use server'

import { Timestamp } from 'firebase-admin/firestore'

import { auth } from '@/lib/auth'
import { db } from '@/lib/firebase'

export async function createBusinessPhones(formData: FormData) {
  const session = await auth()

  if (!session) return

  const profileId = formData.get('profileId') as string
  const phones = formData.get('phones') as string
  const businessPhones = JSON.parse(phones)

  try {
    await db.collection('profiles').doc(profileId).update({
      businessPhones,
      updatedAt: Timestamp.now().toMillis(),
    })

    return true
  } catch (error) {
    return false
  }
}
