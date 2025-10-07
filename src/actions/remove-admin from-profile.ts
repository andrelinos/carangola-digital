'use server'

import { Timestamp } from 'firebase-admin/firestore'

import { auth } from '@/lib/auth'
import { db } from '@/lib/firebase'

interface AdminInDB {
  email: string
  name: string
  userId: string
}

export async function removeAdminFromProfile(formData: FormData) {
  const session = await auth()

  if (!session) return

  try {
    const profileId = formData.get('profileId') as string
    const adminUIDToRemove = formData.get('adminUID') as string

    if (!profileId || !adminUIDToRemove) {
      throw new Error('Dados insuficientes para remover o administrador.')
    }

    const profileRef = db.collection('profiles').doc(profileId)

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
