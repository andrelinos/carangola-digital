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
          'Erro ao analisar external_reference, verifique o formato dos dados.',
          error
        )
      }
    }

    if (profileId && planType) {
      // Obtém a data e hora atual
      const currentDate = new Date()
      const expirationDate = new Date(currentDate)

      // Define a data de expiração com base no planType
      if (planType === 'pro') {
        // Para o plano Pro, adiciona 1 mês
        expirationDate.setMonth(expirationDate.getMonth() + 1)
      } else if (planType === 'basic') {
        // Para o plano Basic, adiciona 1 ano
        expirationDate.setFullYear(expirationDate.getFullYear() + 1)
      } else {
        // Se houver outros tipos, defina um padrão ou trate conforme necessário
        expirationDate.setMonth(expirationDate.getMonth() + 1)
      }
      // Grava em profiles/{profileId}/plan/{planType}
      await db.collection('profiles').doc(profileId).update({
        plan: planType,
        period: expirationDate.getTime(), // ou use Timestamp.fromMillis(expirationDate.getTime()) se preferir gravar como Timestamp
        updatedAt: Timestamp.now().toMillis(),
      })
      // .doc(planType)
      // .set(
      //   {
      //     period: Timestamp.now().toMillis(),
      //     updatedAt: Timestamp.now().toMillis(),
      //   },
      //   { merge: true }
      // )
    } else {
      console.error(
        'profileId ou planType não foram identificados no external_reference.'
      )
    }
  } catch (error) {}

  return true
}

// Retorno do Mercado Pago sucesso
// compra?
// status=sucesso
// collection_id=115158347167
// collection_status=approved
// payment_id=115158347167
// status=approved
// external_reference=123
// payment_type=account_money
// merchant_order_id=31842477622
// preference_id=2501694910-7c231f7a-8985-4716-9706-4932d746babe
// site_id=MLB
// processing_mode=aggregator
// merchant_account_id=null
