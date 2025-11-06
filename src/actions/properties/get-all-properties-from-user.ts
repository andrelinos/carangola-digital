'use server'

import { getServerSession } from 'next-auth/next'

import type { PropertyProps } from '@/_types/property'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'

export async function getUserProperties(
  profileId: string,
  lastDoc?: string
): Promise<PropertyProps[]> {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user || user.id !== profileId) {
    console.warn('Tentativa de acesso não autorizada')
    return []
  }

  const pageSize = 50

  try {
    let q = db
      .collectionGroup('user_properties')
      .orderBy('createdAt')
      .limit(pageSize)
    if (lastDoc) q = q.startAfter(lastDoc)

    const propertiesRef = db
      .collection('properties')
      .doc(profileId)
      .collection('user_properties')

    const query = propertiesRef.orderBy('createdAt', 'desc')

    const snapshot = await query.get()

    if (snapshot.empty) {
      return []
    }

    const properties = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data(),
      } as PropertyProps
    })

    return properties
  } catch (error) {
    console.error('Erro ao listar propriedades:', error)
    return []
  }
}
