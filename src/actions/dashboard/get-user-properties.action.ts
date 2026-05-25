'use server'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db, getDownloadURLFromPath } from '@/lib/firebase'

export interface UserPropertyTableData {
  id: string
  title: string
  category: string
  status: 'Ativo' | 'Pendente' | 'Expirado'
  statusColor: 'chart-2' | 'chart-1' | 'destructive'
  image: string | null
}

export async function getUserPropertiesForDashboard(): Promise<
  UserPropertyTableData[]
> {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    if (!userId) return []

    // Propriedades ficam em properties/{userId}/user_properties
    const snapshot = await db
      .collection('properties')
      .doc(userId)
      .collection('user_properties')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get()

    if (snapshot.empty) return []

    const properties = await Promise.all(
      snapshot.docs.map(async doc => {
        const data = doc.data()

        // Determinar Status (Simplificado para o exemplo)
        let status: 'Ativo' | 'Pendente' | 'Expirado' = 'Ativo'
        let statusColor: 'chart-2' | 'chart-1' | 'destructive' = 'chart-2'

        if (data.status === 'pending') {
          status = 'Pendente'
          statusColor = 'chart-1'
        } else if (data.status === 'expired') {
          status = 'Expirado'
          statusColor = 'destructive'
        }

        // Resolver Imagem (Geralmente a primeira da galeria ou uma capa)
        const imagePath = data.imagesPaths?.[0] || data.coverImagePath || null
        let imageUrl: string | null = null
        if (imagePath) {
          const url = await getDownloadURLFromPath(imagePath)
          imageUrl = url || null
        }

        return {
          id: doc.id,
          title: (data.title as string) || 'Sem título',
          category: (data.category as string) || 'Imóvel',
          status,
          statusColor,
          image: imageUrl,
        }
      })
    )

    return properties
  } catch (error) {
    console.error('[getUserPropertiesForDashboard] Erro:', error)
    return []
  }
}
