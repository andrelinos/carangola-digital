'use server'

import { Timestamp } from 'firebase-admin/firestore'

import { checkIfSlugExists } from '@/app/server/check-if-slug-exists'
import { generateJsonFile } from '@/app/server/generate-json-file'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { generateKeywords } from '@/utils/generate-keywords'
import { kebabToPhrase } from '@/utils/kebab-to-phrase'
import { normalizeText } from '@/utils/sanitize-text'
import { getServerSession } from 'next-auth/next'

type Props = {
  link: string
  name?: string
  userId?: string
}

export async function createBusinessLink({ link, name, userId }: Props) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  const isAdmin = session?.user.role === 'admin'

  if (!session) return

  const isSlugTaken = await checkIfSlugExists(link)

  if (isSlugTaken) {
    return { success: false, error: 'Este perfil já está em uso.' }
  }

  const linkText = kebabToPhrase(link)
  let keywords = [] as string[]

  try {
    const userName = name || session?.user?.name || ''
    const normalizedName = normalizeText(userName)

    if (userName) {
      keywords = generateKeywords(userName)
      if (keywords.length > 1) {
        keywords.push(linkText)
      }
    }

    const profileCreated = await db
      .collection('profiles')
      .doc()
      .set({
        userId: userId ?? session?.user?.id,
        name: name ?? userName,
        nameLower: normalizedName,
        isPublished: true,
        keywords: keywords,
        totalVisits: 0,
        createdAt: Timestamp.now().toMillis(),
        updatedAt: Timestamp.now().toMillis(),
        slug: link,
      })

    if (profileCreated.writeTime && session?.user?.id) {
      await db
        .collection('users')
        .doc(session?.user?.id)
        .update({
          hasProfileLink: isAdmin ? undefined : true,
          isPrimary: isAdmin ? undefined : true,
          myProfileLink: isAdmin ? undefined : link,
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

    return { success: true }
  } catch (error: any) {
    console.error('Erro inesperado ao criar perfil:', error)
    return {
      success: false,
      error: 'Ocorreu um erro no servidor. Tente novamente.',
    }
  }
}
