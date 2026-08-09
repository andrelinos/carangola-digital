'use server'

import { db } from '@/lib/firebase'
import type { ServiceListingCardData } from '@/_types/service-listing'

interface PaginatedServicesResult {
  services: ServiceListingCardData[]
  lastDocId: string | null
  hasMore: boolean
}

export async function getPaginatedServices(
  category: string | null = null,
  lastDocId: string | null = null,
  limitNum = 12
): Promise<PaginatedServicesResult> {
  try {
    let query = db
      .collection('service-listings')
      .where('isActive', '==', true)
      .orderBy('isHighlighted', 'desc')
      .orderBy('createdAt', 'desc')

    if (category && category !== 'Todos') {
      query = query.where('category', '==', category)
    }

    if (lastDocId) {
      const lastDoc = await db.collection('service-listings').doc(lastDocId).get()
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc)
      }
    }

    const snapshot = await query.limit(limitNum).get()

    if (snapshot.empty) {
      return { services: [], lastDocId: null, hasMore: false }
    }

    const services: ServiceListingCardData[] = snapshot.docs.map(doc => {
      const d = doc.data()
      return {
        id: doc.id,
        slug: d.slug,
        title: d.title,
        category: d.category,
        priceType: d.priceType,
        price: d.price ?? undefined,
        thumbnailUrl: d.thumbnailUrl ?? undefined,
        serviceArea: d.serviceArea,
        contactWhatsApp: d.contactWhatsApp ?? undefined,
        isHighlighted: !!d.isHighlighted,
        rating: d.rating ?? undefined,
        reviewCount: d.reviewCount ?? 0,
      }
    })

    const lastVisible = snapshot.docs[snapshot.docs.length - 1]

    return {
      services,
      lastDocId: lastVisible.id,
      hasMore: snapshot.docs.length === limitNum,
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido'
    console.error('FIREBASE_QUERY_ERROR:', message)
    throw new Error(`Erro ao carregar serviços: ${message}`)
  }
}
