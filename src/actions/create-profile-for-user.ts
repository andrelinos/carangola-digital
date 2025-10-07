'use server'

import { Timestamp } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'

import { verifyAdmin } from '@/app/server/verify-admin.server'
import { db } from '@/lib/firebase'
import { sanitizeLink } from '@/lib/utils'

export async function createProfileForUser(formData: FormData) {
  await verifyAdmin()

  const linkFromFrom = String(formData.get('link') ?? '').trim()
  const name = String(formData.get('name') ?? '').trim()
  const targetUserId = String(formData.get('targetUserId') ?? '').trim()

  const link = sanitizeLink(linkFromFrom)

  if (!link || !name || !targetUserId) {
    return { success: false, message: 'Todos os campos são obrigatórios.' }
  }

  const normalizedName = name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
  const keywords = [
    ...normalizedName.split(' ').filter(term => term.length > 0),
    link,
  ]

  try {
    await db.runTransaction(async transaction => {
      const profileRef = db.collection('profiles').doc(link)

      const userRef = db.collection('users').doc(targetUserId)

      const profileDoc = await transaction.get(profileRef)
      if (profileDoc.exists) {
        throw new Error('Este link de perfil já está em uso.')
      }

      const userDoc = await transaction.get(userRef)
      if (!userDoc.exists) {
        throw new Error('Usuário alvo não encontrado.')
      }

      transaction.set(profileRef, {
        userId: targetUserId,
        name: name,
        nameLower: normalizedName,
        keywords: keywords,
        isPrimary: false,
        totalVisits: 0,
        createdAt: Timestamp.now().toMillis(),
        updatedAt: Timestamp.now().toMillis(),
      })

      transaction.set(
        userRef,
        {
          hasProfileLink: true,
          myProfileLink: link,
          updatedAt: Timestamp.now().toMillis(),
        },
        { merge: true }
      )
    })

    revalidatePath('/admin/dashboard')
    return { success: true, message: 'Perfil criado com sucesso!' }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}
