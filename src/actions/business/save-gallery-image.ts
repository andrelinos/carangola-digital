'use server'

import { FieldValue } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth/next'
import { getProfileData } from '@/app/server/get-profile-data'
import {
  type PlanTypeProps,
  plansBusinessConfig,
} from '@/configs/plans-business'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { getPlanConfig } from '@/utils/get-plan-config'

export async function saveGalleryImage(profileId: string, secureUrl: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: 'Usuário não autenticado.' }
    }

    // 1. Validar permissão de propriedade do negócio
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

    // 2. Validar plano ativo e regra de limite usando getPlanConfig (verifica expiração e status)
    const planConfig = getPlanConfig(profile.planActive as any)

    if (!planConfig.imageGallery?.enabled) {
      return {
        success: false,
        error:
          'O seu plano atual não suporta a funcionalidade de Galeria de Fotos.',
      }
    }

    const galleryConfig = planConfig.imageGallery

    const currentImagesCount = profile.galleryImages?.length || 0
    if (currentImagesCount >= galleryConfig.limit) {
      return {
        success: false,
        error: `Limite de ${galleryConfig.limit} fotos atingido para o pacote ${planConfig.title}.`,
      }
    }

    // 3. Adicionar URL ao Firestore de forma atômica
    await db
      .collection('profiles')
      .doc(profileId)
      .update({
        galleryImages: FieldValue.arrayUnion(secureUrl),
      })

    // 4. Revalidar rotas (públicas e privadas) para atualizar interface na mesma hora
    revalidatePath(`/business/${profile.slug}`)
    revalidatePath(`/dashboard/perfil`)

    return { success: true }
  } catch (error) {
    console.error('Error saving gallery image:', error)
    return {
      success: false,
      error: 'Erro interno ao salvar a imagem. Tente novamente mais tarde.',
    }
  }
}
