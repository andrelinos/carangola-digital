'use server'

import { getProfileData } from '@/app/server/get-profile-data'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function getProfileBySlugAction(slug: string) {
  try {
    const session = await getServerSession(authOptions)
    const profile = await getProfileData(slug, session?.user?.id)

    if (!profile) {
      return { success: false, message: 'Perfil não encontrado' }
    }

    return { success: true, data: profile }
  } catch (error) {
    console.error('[getProfileBySlugAction] Erro:', error)
    return { success: false, message: 'Erro ao buscar perfil' }
  }
}
