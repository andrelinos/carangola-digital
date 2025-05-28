'use server'

import { Timestamp } from 'firebase-admin/firestore'

import { auth } from '@/lib/auth'
import { db } from '@/lib/firebase'

interface OpeningHours {
  opening: string
  closing: string
  closed: boolean
}

export interface DataProps {
  openingHours: OpeningHours
  description: string
}

export async function createBusinessOpeningHours(formData: FormData) {
  const session = await auth()

  if (!session) return

  try {
    const profileId = formData.get('profileId') as string
    const openingHoursData = formData.get('openingHours') as string

    const openingHours = JSON.parse(openingHoursData) as OpeningHours[]
    await db.collection('profiles').doc(profileId).update({
      openingHours,
      updatedAt: Timestamp.now().toMillis(),
    })

    return true
  } catch (error) {
    return false
  }
}
