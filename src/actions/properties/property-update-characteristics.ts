'use server'

import { Timestamp } from 'firebase-admin/firestore'
import { getServerSession } from 'next-auth/next'

import type { PropertyProps } from '@/_types/property'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'

interface Props {
  characteristics: PropertyProps['characteristics']
  propertyId: string
}

export async function propertyUpdateCharacteristics({
  characteristics,
  propertyId,
}: Props) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user?.id) {
    throw new Error('Não autorizado')
  }
  const userId = user.id

  try {
    if (!propertyId || !characteristics) {
      throw new Error('Parâmetros ausentes')
    }

    const propertyRef = db
      .collection('properties')
      .doc(userId)
      .collection('user_properties')
      .doc(propertyId)

    await propertyRef.update({
      characteristics,
      updatedAt: Timestamp.now().toMillis(),
    })

    return { success: true }
  } catch (error) {
    console.error('Erro ao atualizar descrição', error)

    return false
  }
}
