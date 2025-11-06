'use server'

import { Filter } from 'firebase-admin/firestore'

import { db } from '@/lib/firebase'
import { authorizeProfileUpdate } from '../_helpers/business.helper'

interface AdminInDB {
  email: string
  name: string
  userId: string
}

export async function addAdminOnProfile(formData: FormData) {
  try {
    const profileId = formData.get('profileId') as string

    const { profileRef, error } = await authorizeProfileUpdate(profileId)
    if (error) return error

    const identifier = formData.get('identifier') as string

    if (!profileId || !identifier) {
      return {
        success: false,
        error:
          'Dados insuficientes para adicionar novo administrador ao seu perfil.',
      }
    }

    const usersRef = db.collection('users')
    const q = usersRef.where(
      Filter.or(
        Filter.where('email', '==', identifier),
        Filter.where('userId', '==', identifier)
      )
    )
    const querySnapshot = await q.get()

    if (querySnapshot.empty) {
      return {
        success: false,
        error: `Nenhum usuário encontrado com o e-mail: ${identifier}`,
      }
    }

    const userDoc = querySnapshot.docs[0]

    if (!userDoc.exists) {
      return {
        success: false,
        error: `Nenhum usuário encontrado com o e-mail: ${identifier}`,
      }
    }

    const userData = userDoc.data()

    const newAdmin: AdminInDB = {
      userId: userDoc.id,
      email: userData.email,
      name: userData.name || '',
    }

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

export async function removeAdminFromProfile(formData: FormData) {
  try {
    const profileId = formData.get('profileId') as string

    const { profileRef, error } = await authorizeProfileUpdate(profileId)
    if (error) return error

    const adminUIDToRemove = formData.get('adminUID') as string

    if (!profileId || !adminUIDToRemove) {
      throw new Error('Dados insuficientes para remover o administrador.')
    }

    // const profileRef = db.collection('profiles').doc(profileId)

    await db.runTransaction(async transaction => {
      const profileDoc = await transaction.get(profileRef)

      if (!profileDoc.exists) {
        throw new Error('Perfil não encontrado.')
      }

      const currentAdmins = profileDoc.data()?.admins as AdminInDB[] | undefined

      if (!currentAdmins || currentAdmins.length === 0) {
        return
      }

      const newAdmins = currentAdmins.filter(
        admin => admin.userId !== adminUIDToRemove
      )

      transaction.update(profileRef, { admins: newAdmins })
    })

    return true
  } catch (error) {
    return false
  }
}
