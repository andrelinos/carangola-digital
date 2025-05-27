'use server'

import { Timestamp } from 'firebase-admin/firestore'

import { auth } from '@/lib/auth'
import { db } from '@/lib/firebase'

export async function createBusinessSocialMedia(formData: FormData) {
  const session = await auth()

  if (!session) return

  const profileId = formData.get('profileId') as string
  const socialMedias = formData.get('socialMedias') as string
  const data = JSON.parse(socialMedias) as {
    name: string
    url: string
  }

  try {
    await db.collection('profiles').doc(profileId).update({
      socialMedias: data,
      updatedAt: Timestamp.now().toMillis(),
    })

    return true
  } catch (error) {
    return false
  }
}
