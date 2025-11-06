import type { PropertyProps } from '@/_types/property'
import { db, getDownloadURLFromPath } from '@/lib/firebase'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const searchTerms = formData.get('searchTerms') as string

    if (!searchTerms || searchTerms.trim().length < 3) {
      return NextResponse.json({ data: [] })
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
      return NextResponse.json({ data: [] })
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
          id: doc.id,
          title: data.title || 'Título não informado',
          mainImageUrl: imageUrl,
          price: data.price || null,
          type: data.type || null,
          address: addressString,
        } as any
      })
    )

    return NextResponse.json({ data: properties })
  } catch (error) {
    console.error('Erro na busca de imóveis (API):', error)
    return NextResponse.json(
      { error: 'Erro ao buscar imóveis' },
      { status: 500 }
    )
  }
}
