'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/firebase'

interface AdminInDB {
  email: string
  name: string
  userId: string
}

export async function addAdminToProfile(formData: FormData) {
  const session = await auth()

  if (!session)
    return {
      success: false,
      error: 'Não autorizado',
    }

  try {
    const profileId = formData.get('profileId') as string
    const userEmail = formData.get('userEmail') as string

    if (!profileId || !userEmail) {
      return {
        success: false,
        error:
          'Dados insuficientes para adicionar novo administrador ao seu perfil.',
      }
    }
    const usersRef = db.collection('users')
    const q = usersRef.where('email', '==', userEmail)
    const querySnapshot = await q.get()

    if (querySnapshot.empty) {
      return {
        success: false,
        error: `Nenhum usuário encontrado com o e-mail: ${userEmail}`,
      }
    }

    const userDoc = querySnapshot.docs[0]

    if (!userDoc.exists) {
      return {
        success: false,
        error: `Nenhum usuário encontrado com o e-mail: ${userEmail}`,
      }
    }
    const userData = userDoc.data()

    const newAdmin: AdminInDB = {
      userId: userDoc.id,
      email: userData.email,
      name: userData.name || '',
    }

    const profileRef = db.collection('profiles').doc(profileId)

    let transactionError: string | null = null

    await db.runTransaction(async transaction => {
      const profileDoc = await transaction.get(profileRef)

      if (!profileDoc.exists) {
        transactionError = 'Perfil não encontrado.'
        return
      }

      const currentAdmins = (profileDoc.data()?.admins as AdminInDB[]) || []

      const adminExists = currentAdmins.some(
        admin => admin.userId === newAdmin.userId
      )

      if (adminExists) {
        transactionError = 'Este usuário já é um administrador do perfil.'
        return
      }

      const newAdmins = [...currentAdmins, newAdmin]

      transaction.update(profileRef, { admins: newAdmins })
    })

    if (transactionError) {
      return { success: false, error: transactionError }
    }

    return {
      success: true,
      message: 'Usuário adicionado com sucesso!',
    }
  } catch {
    return {
      success: false,
      error: 'Ocorreu um erro interno',
    }
  }
}
