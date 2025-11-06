'use server'

import { Timestamp } from 'firebase-admin/firestore'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { generateKeywords } from '@/utils/generate-keywords'
import { normalizeText } from '@/utils/sanitize-text'

export interface PropertyAddressProps {
  address: string
  neighborhood: string
  cep: string
  latitude: number
  longitude: number
}

export async function createOrUpdatePropertyAddress(formData: FormData) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user || !user.id) {
    throw new Error('Não autorizado')
  }
  const userId = user.id

  try {
    const propertyId = formData.get('propertyId') as string
    const addressJSON = formData.get('address') as string | null

    const address = addressJSON ? JSON.parse(addressJSON) : ''
    const { title } = address

    if (!propertyId || !address) {
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
      ...address,
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
