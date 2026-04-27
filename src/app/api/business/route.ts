import { type NextRequest, NextResponse } from 'next/server'

import { db, getDownloadURLFromPath } from '@/lib/firebase'

import type { ProfileDataProps } from '@/_types/profile-data'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const searchValue = formData
      .get('searchTerms')
      ?.toString()
      .trim()
      .toLowerCase()

    if (!searchValue) {
      return NextResponse.json({
        message: 'Search terms are required',
      })
    }

    // Normaliza a string de busca e a divide em termos individuais
    const searchTerms = searchValue
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .split(' ') // Divide a string em um array de palavras
      .filter(term => term.length > 0) // Remove termos vazios

    if (searchTerms.length === 0) {
      return NextResponse.json({
        message: 'Search terms are required',
      })
    }

    const snapshot = await db
      .collection('profiles')
      .where('keywords', 'array-contains-any', searchTerms)
      .limit(20)
      .get()

    const dataResponse = await Promise.all(
      snapshot.docs.map(async doc => {
        const data = doc.data() as ProfileDataProps
        const imagePath = data.logoImagePath || data.coverImagePath || data.imagePath
        const imageUrl = await getDownloadURLFromPath(imagePath)

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
        }
      })
    )

    return NextResponse.json({
      data: dataResponse,
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal Server Error', error },
      { status: 500 }
    )
  }
}
