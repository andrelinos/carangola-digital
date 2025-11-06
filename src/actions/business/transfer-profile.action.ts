'use server'

import { FieldValue, Timestamp } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'

import { db } from '@/lib/firebase'

export async function transferProfile(
  profileId: string,
  currentOwnerId: string,
  newOwnerId: string
) {
  if (!newOwnerId || newOwnerId === currentOwnerId) {
    return { success: false, message: 'ID do novo dono é inválido.' }
  }

  try {
    await db.runTransaction(async transaction => {
      const profileRef = db.collection('profiles').doc(profileId)
      const oldUserRef = db.collection('users').doc(currentOwnerId)
      const newUserRef = db.collection('users').doc(newOwnerId)

      // Verificar se o novo dono já tem um perfil
      const newUserDoc = await transaction.get(newUserRef)
      // if (newUserDoc.data()?.hasProfileLink) {
      //   throw new Error(
      //     'O novo dono já possui um perfil. A transferência não é permitida.'
      //   )
      // }

      // 1. Atualizar o perfil com o ID do novo dono
      transaction.update(profileRef, {
        userId: newOwnerId,
        updatedAt: Timestamp.now().toMillis(),
      })

      // 2. Limpar os dados do dono antigo
      transaction.update(oldUserRef, {
        hasProfileLink: false,
        myProfileLink: FieldValue.delete(),
        updatedAt: Timestamp.now().toMillis(),
      })

      // 3. Atribuir os dados ao novo dono
      transaction.update(newUserRef, {
        hasProfileLink: true,
        myProfileLink: profileId,
        updatedAt: Timestamp.now().toMillis(),
      })
    })

    revalidatePath('/admin/dashboard')
    return { success: true, message: 'Perfil transferido com sucesso!' }
  } catch (error: any) {
    return {
      success: false,
      message: 'Falha ao transferir o perfil',
    }
  }
}
