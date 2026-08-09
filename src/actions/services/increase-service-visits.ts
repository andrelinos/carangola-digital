'use server'

import { FieldValue } from 'firebase-admin/firestore'
import { db } from '@/lib/firebase'

export async function increaseServiceVisits(id: string): Promise<void> {
  try {
    await db
      .collection('service-listings')
      .doc(id)
      .update({ totalVisits: FieldValue.increment(1) })
  } catch (error) {
    console.error('[increaseServiceVisits]', error)
  }
}
