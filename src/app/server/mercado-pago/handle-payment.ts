import type { PaymentDataProps } from '@/_types/payment-data'
import { db } from '@/lib/firebase'
import { Timestamp } from 'firebase-admin/firestore'

export async function handleMercadoPagoPayment(paymentData: PaymentDataProps) {
  let profileId = ''
  let planType = ''
  let userId = ''

  console.log('Dados recebidos do MercadoPago:', paymentData)

  try {
    if (paymentData?.external_reference) {
      try {
        profileId = paymentData.external_reference
        planType = paymentData.metadata.plan.plan_type
        userId = paymentData.metadata.user_id

        console.log('Dados extraídos de external_reference:', paymentData)
      } catch (error) {
        console.error(
          'Erro ao analisar external_reference, verifique o formato dos dados.'
          // error
        )
      }
    }

    if (profileId && planType && userId) {
      const currentDate = new Date()
      const expirationDate = new Date(currentDate)

      if (planType === 'basic') {
        expirationDate.setMonth(expirationDate.getMonth() + 1)
      } else if (planType === 'pro') {
        expirationDate.setFullYear(expirationDate.getFullYear() + 1)
      } else {
        expirationDate.setMonth(expirationDate.getMonth() + 1)
      }

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
          id: paymentData.metadata.plan.id,
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
  } catch (error) {
    console.error('Erro ao processar pagamento:', error)
    return false
  }

  return true
}
