'use server'

import { db } from '@/lib/firebase'
import type { ServiceListingCardData } from '@/_types/service-listing'

export async function searchServices(
  searchValue: string
): Promise<ServiceListingCardData[]> {
  try {
    const value = searchValue?.trim()
    if (!value) return []

    const searchTerms = value
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .toLowerCase()
      .split(' ')
      .filter(term => term.length > 0)

    if (searchTerms.length === 0) return []

    const snapshot = await db
      .collection('service-listings')
      .where('isActive', '==', true)
      .where('keywords', 'array-contains-any', searchTerms)
      .limit(20)
      .get()

    return snapshot.docs.map(doc => {
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
      } as ServiceListingCardData
    })
  } catch (error) {
    console.error('[searchServices]', error)
    throw new Error('Internal Server Error')
  }
}
