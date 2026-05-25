'use server'

import { getServerSession } from 'next-auth/next'
import type { ProfileDataProps } from '@/_types/profile-data'
import { authOptions } from '@/lib/auth'
import { db, getDownloadURLFromPath } from '@/lib/firebase'

export interface UserProfileTableData {
  id: string
  name: string
  slug: string
  category: string
  status: 'Ativo' | 'Pendente' | 'Expirado'
  statusColor: 'chart-2' | 'chart-1' | 'destructive'
  image: string | null
}

export async function getUserProfilesForDashboard(): Promise<
  UserProfileTableData[]
> {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    if (!userId) return []

    const userDoc = await db.collection('users').doc(userId).get()
    const userData = userDoc.exists ? userDoc.data() : null
    const planActive =
      userData?.planActive?.profiles ?? userData?.planActive ?? null

    const snapshot = await db
      .collection('profiles')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get()

    if (snapshot.empty) return []

    const profiles = await Promise.all(
      snapshot.docs.map(async doc => {
        const data = doc.data() as ProfileDataProps

        // Determinar Status
        let status: 'Ativo' | 'Pendente' | 'Expirado' = 'Ativo'
        let statusColor: 'chart-2' | 'chart-1' | 'destructive' = 'chart-2'

        if (!data.isActive) {
          status = 'Pendente'
          statusColor = 'chart-1'
        }

        const now = Date.now()
        const resolvedExpiresAt =
          planActive?.expiresAt ?? data.planActive?.expiresAt
        if (
          resolvedExpiresAt !== null &&
          resolvedExpiresAt !== undefined &&
          resolvedExpiresAt < now
        ) {
          status = 'Expirado'
          statusColor = 'destructive'
        }

        // Resolver Imagem
        const imagePath =
          data.logoImagePath || data.coverImagePath || data.imagePath || null
        let imageUrl = null
        if (imagePath) {
          imageUrl = await getDownloadURLFromPath(imagePath)
        }

        return {
          id: doc.id,
          name: data.name || 'Sem nome',
          slug: data.slug || doc.id,
          category:
            Array.isArray(data.categories) && data.categories.length > 0
              ? data.categories[0]
              : data.category || 'Outros',
          status,
          statusColor,
          image: imageUrl || null,
        }
      })
    )

    return profiles
  } catch (error) {
    console.error('[getUserProfilesForDashboard] Erro:', error)
    return []
  }
}
