// app/api/mercadopago-webhook/route.js

import type { PaymentDataProps } from '@/_types/payment-data'
import { handleMercadoPagoPayment } from '@/app/server/mercado-pago/handle-payment'
import mpClient, { verifyMercadoPagoSignature } from '@/lib/mercado-pago'
import { Payment } from 'mercadopago'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    verifyMercadoPagoSignature(request)

    const body = await request.json()

    const { type, data } = body

    switch (type) {
      case 'payment': {
        const payment = new Payment(mpClient)
        const paymentData = (await payment.get({
          id: data.id,
        })) as any as PaymentDataProps

        if (
          paymentData.status === 'approved' ||
          paymentData.date_approved !== null
        ) {
          await handleMercadoPagoPayment(paymentData)
        }
        break
      }
      default:
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Error handling webhook:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
