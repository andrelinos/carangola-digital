'use server'

import { FieldValue, Timestamp } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth/next'

import { verifyAdmin } from '@/app/server/verify-admin.server'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'

/**
 * Apaga um perfil e limpa os dados do usuário dono.
 *
 * Autorização:
 *   - Usuário autenticado que seja dono do perfil, OU
 *   - Administrador geral da plataforma
 *
 * O ownerId é SEMPRE lido do Firestore — nunca confiamos no que vem do cliente.
 */
export async function deleteProfile(profileId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false, message: 'Não autorizado.' }
  }

  const sessionUserId = session.user.id
  const isAdmin = await verifyAdmin()

  try {
    // Busca o dono real do perfil no Firestore
    const profileSnap = await db.collection('profiles').doc(profileId).get()
    if (!profileSnap.exists) {
      return { success: false, message: 'Perfil não encontrado.' }
    }

    const ownerId = profileSnap.data()?.userId as string | undefined
    const isOwner = sessionUserId === ownerId

    if (!isAdmin && !isOwner) {
      return { success: false, message: 'Acesso negado.' }
    }

    if (!ownerId) {
      return { success: false, message: 'Perfil sem proprietário definido.' }
    }

    await db.runTransaction(async transaction => {
      const profileRef = db.collection('profiles').doc(profileId)
      const userRef = db.collection('users').doc(ownerId)

      transaction.delete(profileRef)

      transaction.update(userRef, {
        hasProfileLink: false,
        myProfileLink: FieldValue.delete(),
        updatedAt: Timestamp.now().toMillis(),
      })
    })

    revalidatePath('/admin/dashboard')
    return { success: true, message: 'Perfil apagado com sucesso.' }
  } catch {
    return {
      success: false,
      message: 'Falha ao apagar o perfil.',
    }
  }
}
