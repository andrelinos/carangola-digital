'use server'

import { db } from '@/lib/firebase'

export async function verifyLink(link: string) {
  const snapshot = await db.collection('profiles').doc(link).get()

  if (snapshot.exists) {
    return true
  }
  return false
}
