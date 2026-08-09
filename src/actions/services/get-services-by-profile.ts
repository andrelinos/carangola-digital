'use server'

import { db } from '@/lib/firebase'
import type { ServiceListingCardData } from '@/_types/service-listing'

export async function getServicesByProfile(
  businessProfileId: string
): Promise<ServiceListingCardData[]> {
  try {
    const snapshot = await db
      .collection('service-listings')
      .where('businessProfileId', '==', businessProfileId)
      .where('isActive', '==', true)
      .orderBy('createdAt', 'desc')
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
    console.error('[getServicesByProfile]', error)
    return []
  }
}
