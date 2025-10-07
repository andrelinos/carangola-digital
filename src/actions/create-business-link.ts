'use server'

import { Timestamp } from 'firebase-admin/firestore'

import { generateJsonFile } from '@/app/server/generate-json-file'
import { auth } from '@/lib/auth'
import { db } from '@/lib/firebase'

type Props = {
  link: string
  name?: string
}

export async function createBusinessLink({ link, name }: Props) {
  const session = await auth()

  if (!session) return

  try {
    const userName = session?.user?.name || name
    let normalizedName = ''
    let keywords = [] as string[]

    if (userName) {
      normalizedName = userName
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .toLowerCase()
        .trim()

      keywords = [
        ...normalizedName.split(' ').filter(term => term.length > 0),
        link,
      ]
    }

    keywords.push(link)

    const profileCreated = await db.collection('profiles').doc(link).set({
      userId: session?.user?.id,
      name: userName,
      nameLower: normalizedName,
      keywords: keywords,
      totalVisits: 0,
      createdAt: Timestamp.now().toMillis(),
      updatedAt: Timestamp.now().toMillis(),
    })

    if (profileCreated.writeTime && session?.user?.id) {
      await db.collection('users').doc(session?.user?.id).update({
        hasProfileLink: true,
        isPrimary: true,
        myProfileLink: link,
        accountVerified: false,
        updatedAt: Timestamp.now().toMillis(),
      })
    }

    if (profileCreated.writeTime) {
      generateJsonFile({
        userId: session?.user?.id,
        name: userName,
        link,
      })
    }

    return true
  } catch (error) {
    return false
  }
}
