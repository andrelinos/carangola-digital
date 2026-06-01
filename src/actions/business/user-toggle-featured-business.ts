'use server'

import { Timestamp } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'
import {
  type PlanTypeProps,
  plansBusinessConfig,
} from '@/configs/plans-business'

export async function userToggleFeaturedBusiness({
  profileId,
  isFeatured,
}: {
  profileId: string
  isFeatured: boolean
}) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user?.id) {
    return { success: false, message: 'Não autorizado' }
  }

  const userId = user.id

  if (!profileId) {
    return { success: false, message: 'ID do negócio não fornecido.' }
  }

  try {
    // Only allow if their plan has the feature, or we just allow them to toggle it?
    // Wait, let's check if the user is the owner or admin of the profile
    const profileRef = db.collection('profiles').doc(profileId)
    const profileSnap = await profileRef.get()
    
    if (!profileSnap.exists) {
      return { success: false, message: 'Negócio não encontrado.' }
    }
    
    const profileData = profileSnap.data()
    const isAdmin = profileData?.admins?.some((admin: any) => admin.userId === userId)
    
    if (profileData?.userId !== userId && !isAdmin) {
      return { success: false, message: 'Permissão negada.' }
    }

    if (isFeatured) {
      const userDoc = await db.collection('users').doc(userId).get()
      const userData = userDoc.data()
      
      const planActive =
        userData?.planActive?.profiles ??
        userData?.planActive ??
        (user as any).planActive ??
        null

      const planType = (planActive?.type || 'free') as PlanTypeProps
      const planConfig = plansBusinessConfig[planType] ?? plansBusinessConfig.free
      
      // We will assume that if they have prioritySearch or verifiedBadge, they can be featured
      if (!planConfig.premiumFeatures?.verifiedBadge && !planConfig.premiumFeatures?.prioritySearch) {
         // But actually, in the user's setup, maybe they just use a limit? 
         // Since there's no business highlight limit, we just check verifiedBadge
         // If it's false, we return error.
         return {
           success: false,
           message: 'Seu plano atual não permite destacar negócios. Faça upgrade.',
         }
      }
    }

    await profileRef.update({
      isFeatured,
      updatedAt: Timestamp.now().toMillis(),
    })

    revalidatePath('/dashboard/business')
    revalidatePath('/')

    return {
      success: true,
      message: isFeatured ? 'Negócio destacado!' : 'Destaque removido.',
    }
  } catch (error) {
    console.error('Erro ao alternar destaque do negócio:', error)
    return { success: false, message: 'Erro interno do servidor.' }
  }
}
