'use server'

import { Timestamp } from 'firebase-admin/firestore'
import { getServerSession } from 'next-auth/next'

import { checkIfSlugExists } from '@/app/server/check-if-slug-exists'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { generateKeywords } from '@/utils/generate-keywords'
import { normalizeText } from '@/utils/sanitize-text'

export async function duplicateProfile({
  originalProfileId,
}: {
  originalProfileId: string
}) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user?.id || !user?.role) {
    console.warn('Parou em check user role')
    return {
      success: false,
      error: 'Acesso negado. Você não tem permissão para esta ação.',
    }
  }

  const isAdmin = user.role === 'admin'

  if (!isAdmin) {
    console.warn('Parou em check isAdmin')
    return {
      success: false,
      error: 'Acesso negado. Você não tem permissão para esta ação.',
    }
  }

  try {
    const profileCollection = db.collection('profiles')

    const originalDocRef = profileCollection.doc(originalProfileId)
    const originalDocSnap = await originalDocRef.get()

    if (!originalDocSnap.exists) {
      return { success: false, error: 'Perfil original não encontrado.' }
    }

    const originalData = originalDocSnap.data()

    if (!originalData) {
      return {
        success: false,
        error: 'Não foi possível ler os dados do perfil.',
      }
    }

    const newName = `${originalData.name}`

    const newSlug = originalProfileId

    const isSlugTaken = await checkIfSlugExists(newSlug)
    if (isSlugTaken) {
      return {
        success: false,
        error: 'Falha ao gerar um slug único para a cópia. Tente novamente.',
      }
    }

    const newKeywords = generateKeywords(newName)
    const newNormalizedName = normalizeText(newName)
    const now = Timestamp.now().toMillis()

    const newProfileData = {
      ...originalData,
      name: newName,
      nameLower: newNormalizedName,
      slug: newSlug,
      keywords: newKeywords,
      isPublished: false,
      totalVisits: 0,
      createdAt: now,
      updatedAt: now,
    }

    await profileCollection.doc().set(newProfileData)

    return { success: true, newProfile: newProfileData }
  } catch (error: any) {
    console.error('Erro inesperado ao duplicar perfil:', error)
    return {
      success: false,
      error: 'Ocorreu um erro no servidor. Tente novamente.',
    }
  }
}
