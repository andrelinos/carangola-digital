'use server'

import { db, getDownloadURLFromPath } from '@/lib/firebase'
import type { ProfileDataProps } from '@/_types/profile-data'

export async function searchBusinesses(
  searchValue: string
): Promise<ProfileDataProps[]> {
  try {
    const value = searchValue?.trim().toLowerCase()

    if (!value) {
      return []
    }

    // Normaliza a string de busca e a divide em termos individuais
    const searchTerms = value
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .split(' ') // Divide a string em um array de palavras
      .filter(term => term.length > 0) // Remove termos vazios

    if (searchTerms.length === 0) {
      return []
    }

    const snapshot = await db
      .collection('profiles')
      .where('keywords', 'array-contains-any', searchTerms)
      .limit(20)
      .get()

    const dataResponse = await Promise.all(
      snapshot.docs.map(async doc => {
        const data = doc.data() as ProfileDataProps
        const imagePath =
          data.logoImagePath || data.coverImagePath || data.imagePath

        let imageUrl = null
        if (imagePath) {
          try {
            imageUrl = await getDownloadURLFromPath(imagePath)
          } catch (e) {
            console.warn(`Could not get image URL for ${doc.id}:`, imagePath)
          }
        }

        return {
          ...data,
          id: doc.id,
          profileId: doc.id,
          imagePath: imageUrl,
          logoImageUrl: imageUrl,
          category:
            Array.isArray(data.categories) && data.categories.length > 0
              ? data.categories[0]
              : data.category || 'Serviços',
        } as ProfileDataProps
      })
    )

    return dataResponse
  } catch (error) {
    console.error('Error searching businesses:', error)
    throw new Error('Internal Server Error')
  }
}
