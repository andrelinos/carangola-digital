import { db } from '@/lib/firebase'
import { Timestamp } from 'firebase-admin/firestore'

export async function handleMercadoPagoPayment(paymentData: any) {
  let profileId = ''
  let planType = ''

  try {
    if (paymentData?.external_reference) {
      try {
        profileId = paymentData.metadata.teste_id || ''
        planType = paymentData.metadata.plan.id || ''
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
        .collection('profiles')
        .doc(profileId)
        .update({
          planActive: {
            plan: planType,
            period: Timestamp.fromMillis(expirationDate.getTime()),
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
