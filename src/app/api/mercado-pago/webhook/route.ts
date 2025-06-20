// app/api/mercadopago-webhook/route.js

import { handleMercadoPagoPayment } from '@/app/server/mercado-pago/handle-payment'
import mpClient, { verifyMercadoPagoSignature } from '@/lib/mercado-pago'
import { Payment } from 'mercadopago'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    console.log('Início do webhook')
    verifyMercadoPagoSignature(request)
    console.log('Assinatura verificada')

    const body = await request.json()
    console.log('Corpo do webhook:', body)

    const { type, data } = body

    switch (type) {
      case 'payment': {
        console.log('Evento de pagamento recebido')
        const payment = new Payment(mpClient)
        const paymentData = await payment.get({ id: data.id })
        console.log('Dados do pagamento obtidos:', paymentData)

        if (
          paymentData.status === 'approved' ||
          paymentData.date_approved !== null
        ) {
          console.log('Pagamento aprovado, processando...')
          await handleMercadoPagoPayment(paymentData)
          console.log('Processamento do pagamento concluído')
        }
        break
      }
      default:
        console.log('Evento não tratado:', type)
    }

    console.log('Enviando resposta ao Mercado Pago')
    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Error handling webhook:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
