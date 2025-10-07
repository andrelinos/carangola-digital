'use server'

import { verifyAdmin } from '@/app/server/verify-admin.server'
import { db } from '@/lib/firebase'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'

export async function deleteProfile(profileId: string, ownerId: string) {
  await verifyAdmin()

  try {
    await db.runTransaction(async transaction => {
      const profileRef = db.collection('profiles').doc(profileId)
      const userRef = db.collection('users').doc(ownerId)

      // Apagar o perfil
      transaction.delete(profileRef)

      // Resetar os dados no documento do usuário
      transaction.update(userRef, {
        hasProfileLink: false,
        myProfileLink: FieldValue.delete(), // Remove o campo
        updatedAt: Timestamp.now().toMillis(),
      })
    })

    revalidatePath('/admin/dashboard')
    return { success: true, message: 'Perfil apagado com sucesso.' }
  } catch (error: any) {
    return {
      success: false,
      message: `Falha ao apagar o perfil: ${error.message}`,
    }
  }
}
