'use server'

import type { PropertyImage, PropertyProps } from '@/_types/property'
import { db, getDownloadURLFromPath } from '@/lib/firebase'

interface PaginatedResult {
  properties: PropertyProps[]
  lastDocId: string | null
  hasMore: boolean
}

export async function getPaginatedProperties(
  category: string | null = null,
  lastDocId: string | null = null,
  limitNum: number = 12
): Promise<PaginatedResult> {
  try {
    let queryItems = db
      .collectionGroup('user_properties')
      .where('isPublished', '==', true)
      .orderBy('createdAt', 'desc')

    if (category && category !== 'Todos') {
      // Properties use 'type' (e.g., Casa, Apartamento) or 'listingType' (Venda, Aluguel)
      // I'll filter by 'type' for the general category explorer
      queryItems = queryItems.where('type', '==', category)
    }

    if (lastDocId) {
      // For collectionGroup, we use the absolute path to fetch the document snapshot
      const lastDoc = await db.doc(lastDocId).get()
      if (lastDoc.exists) {
        queryItems = queryItems.startAfter(lastDoc)
      }
    }

    const snapshot = await queryItems.limit(limitNum).get()

    if (snapshot.empty) {
      return { properties: [], lastDocId: null, hasMore: false }
    }

    const properties = await Promise.all(
      snapshot.docs.map(async doc => {
        const data = doc.data()
        const firstImage =
          Array.isArray(data.images) && data.images.length > 0
            ? data.images[0]
            : undefined

        const firstPath: string | undefined = firstImage
          ? typeof firstImage === 'string'
            ? firstImage
            : (firstImage as PropertyImage)?.path
          : undefined

        let imageUrl = null
        if (firstPath) {
          try {
            imageUrl = await getDownloadURLFromPath(firstPath)
          } catch (_e) {
            console.warn(
              `Could not get image URL for property ${doc.id}:`,
              firstPath
            )
          }
        }

        return {
          ...data,
          id: doc.id,
          thumbnail: imageUrl,
          characteristics: data.characteristics || {
            area: 0,
            bedrooms: 0,
            bathrooms: 0,
            garageSpots: 0,
          },
          images: data.images || [],
          features: data.features || [],
          isPublished: !!data.isPublished,
          price: data.price || 0,
          type: data.type || 'Imóvel',
          listingType: data.listingType || 'Venda',
          slug: data.slug || doc.id,
        } as PropertyProps
      })
    )

    const lastVisible = snapshot.docs[snapshot.docs.length - 1]

    return {
      properties,
      lastDocId: lastVisible.ref.path, // Use path for easier fetching in the next call
      hasMore: snapshot.docs.length === limitNum,
    }
  } catch (error: any) {
    console.error('FIREBASE_QUERY_ERROR (Properties):', error.message || error)
    throw new Error(
      `Erro ao carregar imóveis: ${error.message || 'Erro desconhecido'}`
    )
  }
}
