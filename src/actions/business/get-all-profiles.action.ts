'use server'

import { verifyAdmin } from '@/app/server/verify-admin.server'
import { db } from '@/lib/firebase'

export async function getAllProfiles() {
  try {
    await verifyAdmin()

    const profilesSnapshot = await db
      .collection('profiles')
      .orderBy('createdAt', 'desc')
      .get()
    const profiles = profilesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))

    return profiles
  } catch (error) {
    return {
      success: false,
      message: 'Erro ocorrido ao buscar todos os perfis',
    }
  }
}
