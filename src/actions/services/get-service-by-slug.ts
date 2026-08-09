'use server'

import { FieldValue } from 'firebase-admin/firestore'
import { db } from '@/lib/firebase'
import type { ServiceListing } from '@/_types/service-listing'

export async function getServiceBySlug(
  slug: string,
  incrementVisit = true
): Promise<ServiceListing | null> {
  try {
    const snap = await db
      .collection('service-listings')
      .where('slug', '==', slug)
      .where('isActive', '==', true)
      .limit(1)
      .get()

    if (snap.empty) return null

    const doc = snap.docs[0]

    if (incrementVisit) {
      await doc.ref.update({ totalVisits: FieldValue.increment(1) })
    }

    return { ...doc.data(), id: doc.id } as ServiceListing
  } catch (error) {
    console.error('[getServiceBySlug]', error)
    return null
  }
}
