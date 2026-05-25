'use server'

import { requireAdmin } from '@/app/server/verify-admin.server'
import { db } from '@/lib/firebase'

export async function getAllProperties(): Promise<Record<string, unknown>[]> {
  try {
    await requireAdmin()

    let propertiesSnapshot

    try {
      propertiesSnapshot = await db
        .collectionGroup('user_properties')
        .orderBy('createdAt', 'desc')
        .get()
    } catch {
      // Fallback sem orderBy caso o índice do collectionGroup ainda não exista
      propertiesSnapshot = await db.collectionGroup('user_properties').get()
    }

    if (propertiesSnapshot.empty) {
      return []
    }

    const properties = propertiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))

    return properties
  } catch (error) {
    console.error('Erro ao buscar todos os imóveis:', error)
    return []
  }
}
