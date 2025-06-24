import mpClient from '@/lib/mercado-pago'
import { Payment } from 'mercadopago'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const paymentId = searchParams.get('payment_id')

  const profileId = searchParams.get('external_reference')

  if (!paymentId || !profileId) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const payment = new Payment(mpClient)
  const paymentData = await payment.get({ id: paymentId })

  if (paymentData.status === 'approved' || paymentData.date_approved !== null) {
    return NextResponse.redirect(new URL('/compra?status=sucesso', request.url))
  }
  // return NextResponse.redirect(new URL('/compra?status=erro', request.url))
  return NextResponse.redirect(new URL('/', request.url))
}
