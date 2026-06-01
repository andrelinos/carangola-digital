'use server'

import { Timestamp } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth/next'
import {
  type PlanTypeProps,
  plansBusinessConfig,
} from '@/configs/plans-business'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'

export async function userTogglePropertyBeacon({
  propertyId,
  isBeaconActive,
}: {
  propertyId: string
  isBeaconActive: boolean
}) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user?.id) {
    return { success: false, message: 'Não autorizado' }
  }

  const userId = user.id

  if (!propertyId) {
    return { success: false, message: 'ID do imóvel não fornecido.' }
  }

  try {
    if (isBeaconActive) {
      // Fetch user to check plan
      const userDoc = await db.collection('users').doc(userId).get()
      const userData = userDoc.data()

      const planActive =
        userData?.planActive?.profiles ??
        userData?.planActive ??
        (user as any).planActive ??
        null

      const planType = (planActive?.type || 'free') as PlanTypeProps
      const planConfig =
        plansBusinessConfig[planType] ?? plansBusinessConfig.free
      const limit = Number(planConfig.mapHighlights?.limit) ?? 0

      if (limit === 0) {
        return {
          success: false,
          message:
            'Seu plano atual não permite destacar no mapa. Faça upgrade.',
        }
      }

      if (limit !== -1) {
        // Count currently beacon-active properties
        const beaconSnapshot = await db
          .collection('properties')
          .doc(userId)
          .collection('user_properties')
          .where('isBeaconActive', '==', true)
          .get()

        const beaconCount = beaconSnapshot.size

        if (beaconCount >= limit) {
          return {
            success: false,
            message: `Limite atingido. Seu plano permite destacar até ${limit} endereço(s) no mapa simultaneamente.`,
          }
        }
      }
    }

    const propertyRef = db
      .collection('properties')
      .doc(userId)
      .collection('user_properties')
      .doc(propertyId)

    await propertyRef.update({
      isBeaconActive,
      updatedAt: Timestamp.now().toMillis(),
    })

    revalidatePath('/dashboard/imoveis')
    revalidatePath('/dashboard/todos-imoveis')
    revalidatePath('/')

    return {
      success: true,
      message: isBeaconActive
        ? 'Endereço visível no mapa!'
        : 'Endereço removido do mapa.',
    }
  } catch (error) {
    console.error('Erro ao alternar beacon do imóvel:', error)
    return { success: false, message: 'Erro interno do servidor.' }
  }
}
