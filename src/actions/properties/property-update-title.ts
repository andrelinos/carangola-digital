'use server'

import { Timestamp } from 'firebase-admin/firestore'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { generateKeywords } from '@/utils/generate-keywords'
import { normalizeText } from '@/utils/sanitize-text'

interface Props {
  title: string
  propertyId: string
}

export async function propertyUpdateTitle({ title, propertyId }: Props) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user?.id) {
    throw new Error('Não autorizado')
  }
  const userId = user.id

  try {
    if (!propertyId || !title) {
      throw new Error('Parâmetros ausentes')
    }

    const propertyRef = db
      .collection('properties')
      .doc(userId)
      .collection('user_properties')
      .doc(propertyId)

    const normalizedTitle = normalizeText(title)

    const keywords = generateKeywords(title)

    await propertyRef.update({
      title,
      nameLower: normalizedTitle,
      keywords: keywords,
      updatedAt: Timestamp.now().toMillis(),
    })

    return { success: true }
  } catch (error) {
    console.error('Erro ao atualizar título', error)

    return false
  }
}
