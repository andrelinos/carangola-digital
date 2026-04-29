'use server'

import type { PropertyProps } from '@/_types/property'
import { db, getDownloadURLFromPath } from '@/lib/firebase'

export async function searchProperties(
  searchTerms: string
): Promise<PropertyProps[]> {
  try {
    if (!searchTerms || searchTerms.trim().length < 3) {
      return []
    }

    const normalizedQuery = searchTerms
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .toLowerCase()
      .trim()

    // Divide os termos de busca para usar no 'array-contains-any'
    const queryKeywords = normalizedQuery
      .split(' ')
      .filter(term => term.length > 0)

    // O 'array-contains-any' do Firestore é limitado a 10 itens no array
    const limitedKeywords = queryKeywords.slice(0, 10)

    if (limitedKeywords.length === 0) {
      return []
    }

    const propertiesSnapshot = await db
      .collectionGroup('user_properties')
      .where('isPublished', '==', true)
      .where('keywords', 'array-contains-any', limitedKeywords)
      .limit(20)
      .get()

    const properties = await Promise.all(
      propertiesSnapshot.docs.map(async doc => {
        const data = doc.data()

        const imagePath =
          Array.isArray(data.gallery) && data.gallery.length > 0
            ? data.gallery[0]
            : null

        const imageUrl = await getDownloadURLFromPath(imagePath)
        const addressString =
          data.address?.street || data.address?.neighborhood || null

        return {
          ...data,
          id: doc.id,
          title: data.title || 'Título não informado',
          mainImageUrl: imageUrl,
          price: data.price || null,
          type: data.type || null,
          address: addressString,
        } as any
      })
    )

    return properties
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error)
    throw new Error('Erro ao buscar imóveis')
  }
}
