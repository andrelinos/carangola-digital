'use server'

import { requireAdmin } from '@/app/server/verify-admin.server'
import { db } from '@/lib/firebase'

export async function getAllProfiles() {
  try {
    await requireAdmin()

    const profilesSnapshot = await db
      .collection('profiles')
      .orderBy('createdAt', 'desc')
      .get()

    if (profilesSnapshot.empty) {
      return []
    }

    // Coleta todos os userIds únicos
    const userIds = [
      ...new Set(
        profilesSnapshot.docs
          .map(doc => doc.data().userId)
          .filter(Boolean) as string[]
      ),
    ]

    // Busca os usuários correspondentes em lotes de no máximo 30 (limite do operador 'in' do Firestore)
    const userPlansMap: Record<string, any> = {}
    const chunks = []
    for (let i = 0; i < userIds.length; i += 30) {
      chunks.push(userIds.slice(i, i + 30))
    }

    for (const chunk of chunks) {
      const usersSnapshot = await db
        .collection('users')
        .where('__name__', 'in', chunk)
        .get()

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data()
        const rawPlanActive =
          userData?.planActive?.profiles ?? userData?.planActive ?? null
        const resolvedPlanType =
          rawPlanActive?.type || rawPlanActive?.planType || 'free'
        userPlansMap[userDoc.id] = rawPlanActive
          ? {
              ...rawPlanActive,
              planType: resolvedPlanType,
              type: resolvedPlanType,
            }
          : {
              planType: 'free',
              type: 'free',
              expiresAt: null,
            }
      }
    }

    const profiles = profilesSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        planActive: userPlansMap[data.userId] || {
          planType: 'free',
          type: 'free',
          expiresAt: null,
        },
      }
    })

    return profiles
  } catch (_error) {
    return {
      success: false,
      message: 'Erro ocorrido ao buscar todos os perfis',
    }
  }
}
