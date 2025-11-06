'use server'

import { Timestamp } from 'firebase-admin/firestore'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'

interface Props {
  status: string
  propertyId: string
}

export async function propertyUpdateStatus({ status, propertyId }: Props) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user?.id) {
    throw new Error('Não autorizado')
  }
  const userId = user.id

  try {
    if (!propertyId || !status) {
      throw new Error('Parâmetros ausentes')
    }

    const propertyRef = db
      .collection('properties')
      .doc(userId)
      .collection('user_properties')
      .doc(propertyId)

    await propertyRef.update({
      status,
      updatedAt: Timestamp.now().toMillis(),
    })

    return { success: true }
  } catch (error) {
    console.error('Erro ao atualizar descrição', error)

    return false
  }
}
