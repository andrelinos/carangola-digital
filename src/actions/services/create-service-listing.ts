'use server'

import { Timestamp } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { getPlanConfig } from '@/utils/get-plan-config'

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function nanoid(size = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length: size }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('')
}

interface CreateServiceListingInput {
  title: string
  description: string
  category: string
  tags?: string[]
  priceType: 'fixed' | 'from' | 'on-request'
  price?: number
  serviceArea: 'local' | 'citywide' | 'home-service'
  neighborhood?: string
  contactWhatsApp?: string
  contactPhone?: string
  contactEmail?: string
}

export async function createServiceListing(input: CreateServiceListingInput) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return { success: false, error: 'Usuário não autenticado.' }
  }

  const userId = session.user.id

  // 1. Require a complete business profile (Opção: cadastro completo)
  const profilesSnap = await db
    .collection('profiles')
    .where('userId', '==', userId)
    .where('isPublished', '==', true)
    .limit(1)
    .get()

  if (profilesSnap.empty) {
    return {
      success: false,
      error:
        'É necessário ter um perfil completo e publicado no Guia Comercial para anunciar serviços.',
    }
  }

  const businessProfile = profilesSnap.docs[0]
  const businessProfileId = businessProfile.id

  // 2. Check plan limit for serviceListings
  const profileData = businessProfile.data()
  const planConfig = getPlanConfig(profileData?.planActive as any)
  const serviceListingsLimit =
    (planConfig as any)?.serviceListings?.quantity ?? 0

  if (serviceListingsLimit === 0) {
    return {
      success: false,
      error: 'Seu plano atual não permite anunciar serviços. Faça um upgrade.',
    }
  }

  if (serviceListingsLimit !== -1) {
    const existingSnap = await db
      .collection('service-listings')
      .where('userId', '==', userId)
      .where('isActive', '==', true)
      .get()

    if (existingSnap.size >= serviceListingsLimit) {
      return {
        success: false,
        error: `Limite de ${serviceListingsLimit} serviço(s) atingido para o seu plano ${planConfig.title}.`,
      }
    }
  }

  // 3. Generate unique slug
  const baseSlug = slugify(input.title)
  const slug = `${baseSlug}-${nanoid(6)}`

  // 4. Build keywords for search
  const keywords = [
    ...input.title
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .toLowerCase()
      .split(' ')
      .filter(Boolean),
    input.category.toLowerCase(),
    ...(input.tags ?? []).map(t => t.toLowerCase()),
  ]

  // 5. Persist to Firestore
  const now = Timestamp.now().toMillis()
  const docRef = db.collection('service-listings').doc()

  await docRef.set({
    id: docRef.id,
    userId,
    businessProfileId,
    slug,
    title: input.title,
    description: input.description,
    category: input.category,
    tags: input.tags ?? [],
    keywords,
    priceType: input.priceType,
    price: input.price ?? null,
    images: [],
    thumbnailUrl: null,
    serviceArea: input.serviceArea,
    neighborhood: input.neighborhood ?? null,
    contactWhatsApp: input.contactWhatsApp ?? null,
    contactPhone: input.contactPhone ?? null,
    contactEmail: input.contactEmail ?? null,
    isActive: true,
    isHighlighted: false,
    rating: null,
    reviewCount: 0,
    totalVisits: 0,
    createdAt: now,
    updatedAt: now,
  })

  revalidatePath('/servicos')
  revalidatePath('/dashboard/servicos')

  return { success: true, data: { id: docRef.id, slug } }
}
