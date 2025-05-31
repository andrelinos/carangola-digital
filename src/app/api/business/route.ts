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

    if (!searchValue || !searchValue) {
      return NextResponse.json({
        message: 'Search terms are required',
      })
    }

    const snapshot = await db
      .collection('profiles')
      .where('nameLower', '>=', searchValue)
      .where('nameLower', '<', `${searchValue}\uf8ff`)
      .orderBy('nameLower')
      .limit(20)
      .get()

    const dataResponse = await Promise.all(
      snapshot.docs.map(async doc => {
        const profileId = doc.id
        const data = doc.data() as ProfileDataProps
        const imageUrl = await getDownloadURLFromPath(data.imagePath)

        return {
          profileId,
          userId: data.userId,
          name: data.name,
          imagePath: imageUrl, // URL da imagem já resolvida
          totalVisits: data.totalVisits,
          businessAddresses: data.businessAddresses,
          businessPhones: data.businessPhones,
          openingHours: data.openingHours,
          businessSocialMedias: data.socialMedias,
          socialMedias: data.socialMedias,
          favorites: data.favorites,
          businessDescription: data.businessDescription,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        } as ProfileDataProps
      })
    )

    console.log(dataResponse)

    return NextResponse.json({
      data: dataResponse,
    })
  } catch (error) {
    // console.error(error)
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 })
  }
}
