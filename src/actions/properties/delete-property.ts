'use server'

import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'

interface DeleteProps {
  propertyId: string
}

/**
 * Remove uma propriedade do usuário autenticado.
 */
export async function deleteProperty({ propertyId }: DeleteProps) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user?.id) {
    throw new Error('Não autorizado')
  }
  const userId = user.id

  try {
    if (!propertyId) {
      throw new Error('ID da propriedade ausente')
    }

    const propertyRef = db
      .collection('properties')
      .doc(userId)
      .collection('user_properties')
      .doc(propertyId)

    await propertyRef.delete()

    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir propriedade', error)
    return { success: false, error: 'Falha ao excluir a propriedade.' }
  }
}
