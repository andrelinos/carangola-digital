'use server'

import { Timestamp } from 'firebase-admin/firestore'
import type { PaymentDataProps } from '@/_types/payment-data'
import {
  type PlanTypeProps,
  plansBusinessConfig,
} from '@/configs/plans-business'
import { db } from '@/lib/firebase'

export async function handleMercadoPagoPayment(paymentData: PaymentDataProps) {
  let profileId = ''
  let planType = ''
  let userId = ''

  try {
    if (paymentData?.external_reference) {
      try {
        profileId = paymentData.external_reference
        planType = paymentData.metadata.plan.type
        userId = paymentData.metadata.user_id
      } catch {
        console.error(
          'Erro ao analisar external_reference, verifique o formato dos dados.'
        )
      }
    }

    if (profileId && planType && userId) {
      // Calcula a data de expiração com base em durationMonths do plansBusinessConfig
      const planConfig = plansBusinessConfig[planType as PlanTypeProps]
      const durationMonths = planConfig?.durationMonths ?? 12 // fallback: 12 meses
      const expirationDate = new Date()
      expirationDate.setMonth(expirationDate.getMonth() + durationMonths)

      const planActive = {
        id: paymentData.id,
        type: planType,
        expiresAt: expirationDate.getTime(),
        paymentDate: Timestamp.now().toMillis(),
        status: 'active',
        lastPaymentId: paymentData.id,
        transactionAmount: paymentData.transaction_amount,
        currency: paymentData.currency_id,
        dateApproved: new Date(paymentData.date_approved).getTime(),
        planDetails: {
          type: paymentData.metadata.plan.type,
          name: paymentData.metadata.plan.name,
          period: paymentData.metadata.plan.period,
          price: paymentData.metadata.plan.price,
        },
      }

      await db.collection('profiles').doc(profileId).update({
        planActive,
        updatedAt: Timestamp.now().toMillis(),
      })

      await db.collection('users').doc(userId).update({
        planActive,
        updatedAt: Timestamp.now().toMillis(),
      })
    } else {
      console.error(
        'profileId ou planType não foram identificados no external_reference.'
      )
      return false
    }
  } catch {
    console.error('Erro ao processar pagamento')
    return false
  }

  return true
}
