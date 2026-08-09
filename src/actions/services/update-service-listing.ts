'use server'

import { Timestamp } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'

interface UpdateServiceListingInput {
  id: string
  title?: string
  description?: string
  category?: string
  tags?: string[]
  priceType?: 'fixed' | 'from' | 'on-request'
  price?: number | null
  serviceArea?: 'local' | 'citywide' | 'home-service'
  neighborhood?: string | null
  contactWhatsApp?: string | null
  contactPhone?: string | null
  contactEmail?: string | null
  isActive?: boolean
}

export async function updateServiceListing(input: UpdateServiceListingInput) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return { success: false, error: 'Usuário não autenticado.' }
  }

  const { id, ...fields } = input

  const docRef = db.collection('service-listings').doc(id)
  const doc = await docRef.get()

  if (!doc.exists) {
    return { success: false, error: 'Serviço não encontrado.' }
  }

  if (doc.data()?.userId !== session.user.id) {
    return {
      success: false,
      error: 'Você não tem permissão para editar este serviço.',
    }
  }

  const updateData: Record<string, unknown> = {
    ...fields,
    updatedAt: Timestamp.now().toMillis(),
  }

  // Rebuild keywords if title or category changed
  if (fields.title || fields.category || fields.tags) {
    const title = fields.title ?? doc.data()?.title ?? ''
    const category = fields.category ?? doc.data()?.category ?? ''
    const tags = fields.tags ?? doc.data()?.tags ?? []

    updateData.keywords = [
      ...title
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .toLowerCase()
        .split(' ')
        .filter(Boolean),
      category.toLowerCase(),
      ...(tags as string[]).map((t: string) => t.toLowerCase()),
    ]
  }

  await docRef.update(updateData)

  const slug = doc.data()?.slug as string | undefined
  revalidatePath('/servicos')
  if (slug) revalidatePath(`/servicos/${slug}`)
  revalidatePath('/dashboard/servicos')

  return { success: true }
}
