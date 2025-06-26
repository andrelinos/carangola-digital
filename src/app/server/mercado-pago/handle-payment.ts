import { auth } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { Timestamp } from 'firebase-admin/firestore'

export async function handleMercadoPagoPayment(paymentData: any) {
  const session = await auth()
  if (!session?.user?.id) {
    console.error('Usuário não autenticado ou ID de usuário ausente.')
    return false
  }

  let profileId = ''
  let planType = ''
  let userEmail = ''
  let userId = ''

  try {
    if (paymentData?.external_reference) {
      console.log('external_reference', paymentData.external_reference)
      try {
        ;[profileId, userEmail, planType, userId] = JSON.parse(
          paymentData.external_reference
        )

        // profileId = paymentData.metadata.teste_id || ''
        // planType = paymentData.metadata.plan.id || ''
        // userEmail = externalReference.userEmail || ''
        // plan = externalReference.plan || ''
        // userId = externalReference.userId || ''
      } catch (error) {
        console.error(
          'Erro ao analisar external_reference, verifique o formato dos dados.'
          // error
        )
      }
    }

    if (profileId && planType) {
      const currentDate = new Date()
      const expirationDate = new Date(currentDate)

      if (planType === 'basic') {
        expirationDate.setMonth(expirationDate.getMonth() + 1)
      } else if (planType === 'pro') {
        expirationDate.setFullYear(expirationDate.getFullYear() + 1)
      } else {
        expirationDate.setMonth(expirationDate.getMonth() + 1)
      }

      await db
        .collection('users')
        .doc(userId)
        .update({
          planActive: {
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
              name: paymentData.metadata.plan.name,
              period: paymentData.metadata.plan.period,
              price: paymentData.metadata.plan.price,
            },
          },
          updatedAt: Timestamp.now().toMillis(),
        })
    } else {
      console.error(
        'profileId ou planType não foram identificados no external_reference.'
      )
    }
  } catch (error) {}

  return true
}
