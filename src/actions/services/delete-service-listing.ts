'use server'

import { Timestamp } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'

export async function deleteServiceListing(id: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return { success: false, error: 'Usuário não autenticado.' }
  }

  const docRef = db.collection('service-listings').doc(id)
  const doc = await docRef.get()

  if (!doc.exists) {
    return { success: false, error: 'Serviço não encontrado.' }
  }

  if (doc.data()?.userId !== session.user.id) {
    return {
      success: false,
      error: 'Você não tem permissão para excluir este serviço.',
    }
  }

  // Soft-delete: set isActive to false
  await docRef.update({
    isActive: false,
    updatedAt: Timestamp.now().toMillis(),
  })

  revalidatePath('/servicos')
  revalidatePath('/dashboard/servicos')

  return { success: true }
}
