'server-only'

import { db } from '@/lib/firebase'

export async function getPlans() {
  const snapshot = await db.collection('plans').get()

  if (!snapshot.docs) {
    return null
  }

  const data = snapshot.docs.map(doc => {
    const data = doc.data() as any

    return {
      ...data,
      planId: doc.id,
    }
  })

  return data
}
