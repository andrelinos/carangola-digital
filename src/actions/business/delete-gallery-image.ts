'use server'

import { FieldValue } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth/next'
import { getProfileData } from '@/app/server/get-profile-data'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'

export async function deleteGalleryImage(profileId: string, secureUrl: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: 'Usuário não autenticado.' }
    }

    const profile = await getProfileData(profileId, session.user.id)
    if (!profile) {
      return { success: false, error: 'Perfil não encontrado.' }
    }

    const isOwner = profile.userId === session.user.id
    const isAdmin = profile.admins?.some(
      admin => admin.userId === session.user.id
    )

    if (!isOwner && !isAdmin) {
      return {
        success: false,
        error: 'Você não tem permissão para editar este perfil.',
      }
    }

    await db
      .collection('profiles')
      .doc(profileId)
      .update({
        galleryImages: FieldValue.arrayRemove(secureUrl),
      })

    revalidatePath(`/business/${profile.slug}`)
    revalidatePath(`/dashboard/perfil`)

    return { success: true }
  } catch (error) {
    console.error('Error deleting gallery image:', error)
    return { success: false, error: 'Erro ao deletar imagem. Tente novamente.' }
  }
}
