'use server'

import type { AdminsProfileProps } from '@/_types/profile-data'
import { auth } from '@/lib/auth'
import { db } from '@/lib/firebase'

/**
 * Adiciona um novo admin a um perfil, caso o userUID ainda não esteja presente.
 *
 * @param formData - FormData contendo 'profileId' e 'userUID'.
 * @returns Boolean indicando sucesso (true) ou falha (false) na operação.
 */

export async function manageAdminToProfile(
  formData: FormData
): Promise<boolean> {
  const session = await auth()
  if (!session) {
    console.error('Acesso não autorizado: sessão não encontrada.')
    return false
  }

  const profileId = formData.get('profileId') as string | null
  const userUID = formData.get('userUID') as string | null

  if (!profileId || !userUID) {
    console.error('Parâmetros faltando:', { profileId, userUID })
    return false
  }

  try {
    const profileRef = db.collection('profiles').doc(profileId)
    const userRef = db.collection('users').doc(userUID)
    const profileSnapshot = await profileRef.get()
    const userSnapshot = await userRef.get()

    if (!profileSnapshot.exists) {
      console.error(`Perfil com ID "${profileId}" não existe.`)
      return false
    }

    const profileData = profileSnapshot.data()
    const userData = userSnapshot.data()
    const currentAdmins: AdminsProfileProps[] = profileData?.admins || []

    if (currentAdmins.some(admin => admin.userId === userUID)) {
      return true
    }

    const newAdmins = [
      ...currentAdmins,
      {
        userId: userSnapshot?.id,
        name: userData?.name,
        email: userData?.email,
      },
    ]

    await profileRef.update({
      admins: newAdmins,
    })

    return true
  } catch (error) {
    console.error('Erro ao atualizar o perfil com o novo admin:', error)
    return false
  }
}
