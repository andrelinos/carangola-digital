'use server'

import { Timestamp } from 'firebase-admin/firestore'

import { auth } from '@/lib/auth'
import { db } from '@/lib/firebase'

interface Address {
  opening: string
  closing: string
  closed: boolean
}

export interface DataProps {
  address: Address
  description: string
}

export async function createBusinessAddress(formData: FormData) {
  const session = await auth()

  if (!session) return

  try {
    const profileId = formData.get('profileId') as string
    const addressesData = formData.get('addresses') as string
    const businessAddresses = JSON.parse(addressesData) as Address[]

    await db.collection('profiles').doc(profileId).update({
      businessAddresses,
      updatedAt: Timestamp.now().toMillis(),
    })

    return true
  } catch (error) {
    return false
  }
}
