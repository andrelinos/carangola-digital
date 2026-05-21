'use server'

import { FieldValue, Timestamp } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'

import { requireAdmin } from '@/app/server/verify-admin.server'
import { db } from '@/lib/firebase'

/**
 * Transfere a propriedade de um perfil para um novo usuário.
 *
 * Autorização: EXCLUSIVO ao administrador geral da plataforma.
 *
 * O currentOwnerId é SEMPRE lido do Firestore — nunca confiamos no que vem do cliente.
 */
export async function transferProfile(
  profileId: string,
  newOwnerId: string
) {
  // Apenas o admin da plataforma pode transferir perfis
  try {
    await requireAdmin()
  } catch {
    return {
      success: false,
      message: 'Acesso negado. Apenas o administrador da plataforma pode transferir perfis.',
    }
  }

  if (!newOwnerId?.trim()) {
    return { success: false, message: 'ID do novo dono é inválido.' }
  }

  try {
    // Busca o dono real do perfil no Firestore — nunca confiar no cliente
    const profileSnap = await db.collection('profiles').doc(profileId).get()
    if (!profileSnap.exists) {
      return { success: false, message: 'Perfil não encontrado.' }
    }

    const currentOwnerId = profileSnap.data()?.userId as string | undefined
    if (!currentOwnerId) {
      return { success: false, message: 'Perfil sem proprietário definido.' }
    }

    if (newOwnerId === currentOwnerId) {
      return { success: false, message: 'O novo dono já é o proprietário atual.' }
    }

    await db.runTransaction(async transaction => {
      const profileRef = db.collection('profiles').doc(profileId)
      const oldUserRef = db.collection('users').doc(currentOwnerId)
      const newUserRef = db.collection('users').doc(newOwnerId)

      transaction.update(profileRef, {
        userId: newOwnerId,
        updatedAt: Timestamp.now().toMillis(),
      })

      transaction.update(oldUserRef, {
        hasProfileLink: false,
        myProfileLink: FieldValue.delete(),
        updatedAt: Timestamp.now().toMillis(),
      })

      transaction.update(newUserRef, {
        hasProfileLink: true,
        myProfileLink: profileId,
        updatedAt: Timestamp.now().toMillis(),
      })
    })

    revalidatePath('/admin/dashboard')
    return { success: true, message: 'Perfil transferido com sucesso!' }
  } catch {
    return {
      success: false,
      message: 'Falha ao transferir o perfil.',
    }
  }
}
