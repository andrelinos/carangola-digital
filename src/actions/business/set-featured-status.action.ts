'use server'

import { Timestamp } from 'firebase-admin/firestore'
import { revalidatePath, revalidateTag } from 'next/cache'

import { requireAdmin } from '@/app/server/verify-admin.server'
import { db } from '@/lib/firebase'

export type SetFeaturedStatusInput = {
  profileId: string
  isFeatured: boolean
  featuredStartAt?: string | null // ISO date string "YYYY-MM-DD"
  featuredEndAt?: string | null // ISO date string "YYYY-MM-DD"
}

export async function setFeaturedStatus({
  profileId,
  isFeatured,
  featuredStartAt,
  featuredEndAt,
}: SetFeaturedStatusInput): Promise<{ success: boolean; message: string }> {
  try {
    await requireAdmin()
  } catch {
    return {
      success: false,
      message: 'Acesso negado. Apenas o administrador pode alterar destaques.',
    }
  }

  if (!profileId?.trim()) {
    return { success: false, message: 'ID do perfil é inválido.' }
  }

  try {
    const profileRef = db.collection('profiles').doc(profileId)
    const profileSnap = await profileRef.get()

    if (!profileSnap.exists) {
      return { success: false, message: 'Perfil não encontrado.' }
    }

    const updatePayload: Record<string, unknown> = {
      isFeatured,
      isTopCompanies: isFeatured, // mantém retrocompatibilidade
      updatedAt: Timestamp.now().toMillis(),
    }

    if (isFeatured) {
      updatePayload.featuredStartAt = featuredStartAt
        ? new Date(featuredStartAt).getTime()
        : Timestamp.now().toMillis()
      updatePayload.featuredEndAt = featuredEndAt
        ? new Date(featuredEndAt).getTime()
        : null
    } else {
      // Ao desativar, limpa as datas para não poluir o documento
      updatePayload.featuredStartAt = null
      updatePayload.featuredEndAt = null
    }

    await profileRef.update(updatePayload)

    // Invalida o cache da página de destaques
    revalidateTag('featured-profiles', 'max')
    revalidatePath('/business')
    revalidatePath('/dashboard/todos-negocios')

    return {
      success: true,
      message: isFeatured
        ? 'Empresa marcada como destaque com sucesso!'
        : 'Destaque removido com sucesso!',
    }
  } catch (error: any) {
    console.error('[setFeaturedStatus] Erro:', error.message)
    return {
      success: false,
      message: `Falha ao atualizar destaque: ${error.message}`,
    }
  }
}
