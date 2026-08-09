'use server'

import { db } from '@/lib/firebase'
import type { ServiceListing } from '@/_types/service-listing'

export async function getUserServices(userId: string): Promise<ServiceListing[]> {
  try {
    const snapshot = await db
      .collection('service-listings')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get()

    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    })) as ServiceListing[]
  } catch (error) {
    console.error('[getUserServices]', error)
    return []
  }
}
