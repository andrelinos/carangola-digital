'use server'

import { Timestamp } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'

import { requireAdmin } from '@/app/server/verify-admin.server'
import { db } from '@/lib/firebase'

export async function transferProperty(
  propertyId: string,
  currentOwnerId: string,
  newOwnerId: string
) {
  try {
    await requireAdmin()
  } catch {
    return {
      success: false,
      message: 'Acesso negado. Apenas o administrador pode transferir imóveis.',
    }
  }

  if (!newOwnerId?.trim() || !currentOwnerId?.trim()) {
    return { success: false, message: 'ID de dono inválido.' }
  }

  try {
    const oldPropertyRef = db
      .collection('properties')
      .doc(currentOwnerId)
      .collection('user_properties')
      .doc(propertyId)

    const propertySnap = await oldPropertyRef.get()

    if (!propertySnap.exists) {
      return { success: false, message: 'Imóvel não encontrado.' }
    }

    if (newOwnerId === currentOwnerId) {
      return {
        success: false,
        message: 'O novo dono já é o proprietário atual.',
      }
    }

    const newPropertyRef = db
      .collection('properties')
      .doc(newOwnerId)
      .collection('user_properties')
      .doc(propertyId)

    const propertyData = propertySnap.data()

    await db.runTransaction(async transaction => {
      transaction.set(newPropertyRef, {
        ...propertyData,
        ownerId: newOwnerId,
        userId: newOwnerId, // Apenas para manter os dois caso sejam usados
        updatedAt: Timestamp.now().toMillis(),
      })
      transaction.delete(oldPropertyRef)
    })

    revalidatePath('/dashboard/todos-imoveis')
    return { success: true, message: 'Imóvel transferido com sucesso!' }
  } catch {
    return {
      success: false,
      message: 'Falha ao transferir o imóvel.',
    }
  }
}
