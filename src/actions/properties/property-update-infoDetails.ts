'use server'

import { Timestamp } from 'firebase-admin/firestore'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { getServerSession } from 'next-auth/next'

interface Props {
  infoDetails: Record<string, string>
  propertyId: string
}

export async function propertyUpdateInfoDetails({
  infoDetails,
  propertyId,
}: Props) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user?.id) {
    throw new Error('Não autorizado')
  }
  const userId = user.id

  try {
    if (!propertyId || !infoDetails) {
      throw new Error('Parâmetros ausentes')
    }

    const propertyRef = db
      .collection('properties')
      .doc(userId)
      .collection('user_properties')
      .doc(propertyId)

    await propertyRef.update({
      ...infoDetails,
      updatedAt: Timestamp.now().toMillis(),
    })

    return { success: true }
  } catch (error) {
    console.error('Erro ao atualizar descrição', error)

    return false
  }
}
