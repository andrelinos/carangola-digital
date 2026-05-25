'use server'

import { Timestamp } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'

import { requireAdmin } from '@/app/server/verify-admin.server'
import { db } from '@/lib/firebase'

export async function setFeaturedPropertyStatus({
  propertyId,
  ownerId,
  isFeatured,
  featuredStartAt,
  featuredEndAt,
}: {
  propertyId: string
  ownerId: string
  isFeatured: boolean
  featuredStartAt: string | null
  featuredEndAt: string | null
}) {
  try {
    await requireAdmin()
  } catch {
    return { success: false, message: 'Acesso negado.' }
  }

  if (!propertyId || !ownerId) {
    return { success: false, message: 'Parâmetros inválidos.' }
  }

  try {
    const propertyRef = db
      .collection('properties')
      .doc(ownerId)
      .collection('user_properties')
      .doc(propertyId)

    await propertyRef.update({
      isFeatured,
      featuredStartAt: featuredStartAt
        ? Timestamp.fromDate(new Date(featuredStartAt)).toMillis()
        : null,
      featuredEndAt: featuredEndAt
        ? Timestamp.fromDate(new Date(featuredEndAt)).toMillis()
        : null,
      updatedAt: Timestamp.now().toMillis(),
    })

    revalidatePath('/dashboard/todos-imoveis')
    revalidatePath('/')

    return {
      success: true,
      message: isFeatured
        ? 'Imóvel destacado com sucesso!'
        : 'Destaque removido com sucesso!',
    }
  } catch (error) {
    console.error('Erro ao destacar imóvel:', error)
    return { success: false, message: 'Erro interno ao processar destaque.' }
  }
}
