'use server'

import { Timestamp } from 'firebase-admin/firestore'

import { generateJsonFile } from '@/app/server/generate-json-file'
import { auth } from '@/lib/auth'
import { db } from '@/lib/firebase'

export async function createBusinessLink(link: string) {
  const session = await auth()

  if (!session) return

  try {
    const profileCreated = await db.collection('profiles').doc(link).set({
      userId: session?.user?.id,
      name: session?.user?.name,
      totalVisits: 0,
      createdAt: Timestamp.now().toMillis(),
      updatedAt: Timestamp.now().toMillis(),
    })

    if (profileCreated.writeTime && session?.user?.id) {
      await db.collection('users').doc(session?.user?.id).update({
        hasProfileLink: true,
        myProfileLink: link,
        accountVerified: false,
        updatedAt: Timestamp.now().toMillis(),
      })
    }

    if (profileCreated.writeTime) {
      generateJsonFile({
        userId: session?.user?.id,
        name: session?.user?.name,
        link,
      })
    }

    return true
  } catch (error) {
    return false
  }
}
