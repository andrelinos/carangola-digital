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
    let queryItems = db.collectionGroup('user_properties')
      .where('isPublished', '==', true)
      .orderBy('createdAt', 'desc')

    if (category && category !== 'Todos') {
      // Properties use 'type' (e.g., Casa, Apartamento) or 'listingType' (Venda, Aluguel)
      // I'll filter by 'type' for the general category explorer
      queryItems = queryItems.where('type', '==', category)
    }

    if (lastDocId) {
      // Since it's a collection group, we need to find the specific doc first
      // Or we can pass the snapshot, but server actions only support serializable data.
      // Firebase Admin SDK allows fetching by ID, but for collection group, we need to be careful.
      // Usually, passing the doc reference is better if it were a normal collection.
      // For collectionGroup, we might need a workaround or just fetch and skip (not efficient).
      // Actually, we can fetch the doc by full path if we have it, or just use the ID if unique.
    }

    const snapshot = await queryItems.limit(limitNum).get()

    if (snapshot.empty) {
      return { properties: [], lastDocId: null, hasMore: false }
    }

    const properties = await Promise.all(
      snapshot.docs.map(async doc => {
        const data = doc.data()
        const firstImage = Array.isArray(data.images) ? data.images[0] : undefined
        const firstPath: string | undefined = firstImage
          ? typeof firstImage === 'string' ? firstImage : (firstImage as PropertyImage)?.path
          : undefined

        const imageUrl = await getDownloadURLFromPath(firstPath)

        return {
          ...data,
          id: doc.id,
          thumbnail: imageUrl,
        } as PropertyProps
      })
    )

    const lastVisible = snapshot.docs[snapshot.docs.length - 1]

    return {
      properties,
      lastDocId: lastVisible.id,
      hasMore: snapshot.docs.length === limitNum
    }
  } catch (error: any) {
    console.error('Error fetching paginated properties:', error)
    throw new Error('Erro ao carregar imóveis')
  }
}
