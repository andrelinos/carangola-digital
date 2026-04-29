'use server'

import type { ProfileDataProps } from '@/_types/profile-data'
import { db, getDownloadURLFromPath } from '@/lib/firebase'

export type PublicProfileCardData = {
  id: string
  name: string
  slug: string
  logoImageUrl: string | null
  category: string | null
  openingHours: ProfileDataProps['openingHours']
  holidayExceptions: ProfileDataProps['holidayExceptions']
  isPremium?: boolean
  isVerified?: boolean
  businessAddresses?: ProfileDataProps['businessAddresses']
  reviewCount: number
  rating?: number
}

interface PaginatedResult {
  profiles: PublicProfileCardData[]
  lastDocId: string | null
  hasMore: boolean
}

export async function getPaginatedProfiles(
  category: string | null = null,
  lastDocId: string | null = null,
  limitNum: number = 12
): Promise<PaginatedResult> {
  try {
    let queryItems = db
      .collection('profiles')
      .where('isPublished', '==', true)
      .orderBy('isTopCompanies', 'desc')
      .orderBy('createdAt', 'desc')

    if (category && category !== 'Todos') {
      // Assuming categories is an array in Firestore as per ProfileDataProps
      queryItems = queryItems.where('categories', 'array-contains', category)
    }

    if (lastDocId) {
      const lastDoc = await db.collection('profiles').doc(lastDocId).get()
      if (lastDoc.exists) {
        queryItems = queryItems.startAfter(lastDoc)
      }
    }

    const snapshot = await queryItems.limit(limitNum).get()

    if (snapshot.empty) {
      return { profiles: [], lastDocId: null, hasMore: false }
    }

    const profiles = await Promise.all(
      snapshot.docs.map(async doc => {
        const data = doc.data()

        // Proteção contra caminhos de imagem indefinidos
        const imagePath =
          data.logoImagePath || data.coverImagePath || data.imagePath || null

        let imageUrl = null
        if (imagePath) {
          try {
            imageUrl = await getDownloadURLFromPath(imagePath)
          } catch (_e) {
            console.warn(`Could not get image URL for ${doc.id}:`, imagePath)
          }
        }

        return {
          id: doc.id,
          name: data.name || 'Nome não informado',
          slug: data.slug || doc.id,
          logoImageUrl: imageUrl,
          openingHours: data.openingHours || {},
          holidayExceptions: data.holidayExceptions || [],
          isPremium: !!data.isPremium,
          isVerified: !!data.isVerified,
          businessAddresses: data.businessAddresses || [],
          reviewCount: data.reviewCount || 0,
          rating: data.rating || 0,
          category:
            Array.isArray(data.categories) && data.categories.length > 0
              ? data.categories[0]
              : data.category || 'Outros',
        } as PublicProfileCardData
      })
    )

    const lastVisible = snapshot.docs[snapshot.docs.length - 1]

    return {
      profiles,
      lastDocId: lastVisible.id,
      hasMore: snapshot.docs.length === limitNum,
    }
  } catch (error: any) {
    // Retornamos o erro real para que você possa ver no log do terminal (ou console do Next.js)
    // Se for falta de índice, o Firebase retornará um link para criar o índice composto.
    console.error('FIREBASE_QUERY_ERROR:', error.message || error)
    throw new Error(
      `Erro ao carregar empresas: ${error.message || 'Erro desconhecido'}`
    )
  }
}
