/**
 * POST /api/asaas/checkout
 *
 * Cria um Checkout Asaas com assinatura recorrente (chargeType: RECURRENT).
 * Retorna a URL do checkout para redirecionar o cliente.
 *
 * Body esperado:
 * {
 *   planType: 'basic' | 'pro' | 'master'
 *   userId: string
 *   userEmail: string
 *   userName: string
 * }
 *
 * Referência: https://docs.asaas.com/docs/checkout-com-assinatura-recorrente
 */

import { Timestamp } from 'firebase-admin/firestore'
import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import type { AsaasSubscriptionCycle } from '@/_types/asaas'
import {
  type PlanTypeProps,
  plansBusinessConfig,
} from '@/configs/plans-business'
import {
  asaasFetch,
  createAsaasCheckout,
  createOrFetchAsaasCustomer,
  updateAsaasCustomer,
} from '@/lib/asaas'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'

interface CheckoutRequestBody {
  planType: Exclude<PlanTypeProps, 'free'>
  userId: string
  userEmail: string
  userName: string
  postalCode: string
  address: string
  addressNumber: string
  province: string // Bairro
  city: string // Nome da cidade ou código IBGE
  cpfCnpj: string
  phone: string
}

/** Mapeia durationMonths → cycle Asaas */
function toAsaasCycle(months: number): AsaasSubscriptionCycle {
  switch (months) {
    case 1:
      return 'MONTHLY'
    case 3:
      return 'QUARTERLY'
    case 6:
      return 'SEMIANNUALLY'
    case 12:
      return 'YEARLY'
    default:
      return 'YEARLY'
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  let body: CheckoutRequestBody

  try {
    body = (await req.json()) as CheckoutRequestBody
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const {
    planType,
    userId,
    userEmail,
    userName,
    postalCode,
    address,
    addressNumber,
    province,
    city,
    cpfCnpj,
    phone,
  } = body

  console.log(JSON.stringify(body, null, 2))

  if (
    !planType ||
    !userId ||
    !userEmail ||
    !postalCode ||
    !address ||
    !addressNumber ||
    !province ||
    !city ||
    !cpfCnpj ||
    !phone
  ) {
    return NextResponse.json(
      { error: 'Dados do usuário e endereço completo são obrigatórios' },
      { status: 400 }
    )
  }

  const planConfig = plansBusinessConfig[planType]

  if (!planConfig) {
    return NextResponse.json({ error: 'Plano inválido' }, { status: 400 })
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.BASE_URL ||
    'http://localhost:3000'

  try {
    // 1. Cria ou busca o customer Asaas (evita duplicatas)
    const customer = await createOrFetchAsaasCustomer({
      name: userName || userEmail,
      email: userEmail,
      externalReference: userId,
      postalCode,
      address,
      addressNumber,
      province,
      city,
      cpfCnpj,
      phone,
    })

    await updateAsaasCustomer(customer.id, {
      postalCode,
      address,
      addressNumber,
      province,
      city,
      cpfCnpj,
      phone,
    })

    // ========================================================
    // 1.5 ATUALIZAR O CLIENTE FORÇADAMENTE (O SEGREDO TÁ AQUI)
    // Isso garante que clientes antigos dos seus testes
    // recebam o endereço novo que veio do frontend.
    // ========================================================
    await asaasFetch(`/customers/${customer.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        postalCode,
        address,
        addressNumber,
        province,
        city,
        cpfCnpj,
        phone,
      }),
    })

    // 2. Salva asaasCustomerId no Firestore (se for novo)
    await db.collection('users').doc(userId).set(
      {
        asaasCustomerId: customer.id,
        asaasSubscriptionStatus: 'PENDING',
        updatedAt: Timestamp.now().toMillis(),
      },
      { merge: true }
    )

    const priceInReais = planConfig.price / 100 // centavos → reais
    const cycle = toAsaasCycle(planConfig.durationMonths)

    // NOVO: Gerar a data de hoje no formato YYYY-MM-DD exigido pelo Asaas
    // Pegando a data "hoje" de forma segura no fuso local (Brasil)
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0') // Meses vão de 0 a 11
    const day = String(today.getDate()).padStart(2, '0')

    const nextDueDate = `${year}-${month}-${day}` // Ficará exatamente "2026-05-17"

    // 3. Cria o checkout Asaas com recorrência
    const checkout = await createAsaasCheckout({
      billingTypes: ['CREDIT_CARD'], // Apenas cartão de crédito é suportado pelo Asaas para recorrência via checkout
      chargeTypes: ['RECURRENT'],
      minutesToExpire: 1440, // 24h para o link expirar
      externalReference: userId, // usado no webhook para identificar o usuário
      callback: {
        successUrl: `${siteUrl}/compra?status=sucesso&gateway=asaas`,
        cancelUrl: `${siteUrl}/compra?status=cancelado&gateway=asaas`,
        autoRedirect: true,
      },
      items: [
        {
          name: `Plano ${planConfig.title}`.substring(0, 30), // Max 30 chars
          description: planConfig.description,
          quantity: 1,
          value: priceInReais,
        },
      ],
      customer: customer.id,
      subscription: {
        cycle,
        nextDueDate,
      },
    })

    // 4. Salva o checkoutId no Firestore para rastreamento
    await db.collection('users').doc(userId).update({
      asaasLastCheckoutId: checkout.id,
      updatedAt: Timestamp.now().toMillis(),
    })

    // A API do Asaas NÃO retorna uma URL pronta no response do POST /checkouts.
    // A URL deve ser montada manualmente com o ID retornado.
    const asaasBaseCheckoutUrl =
      process.env.NEXT_PUBLIC_ASAAS_ENV === 'production'
        ? 'https://asaas.com'
        : 'https://sandbox.asaas.com'
    const checkoutUrl = `${asaasBaseCheckoutUrl}/checkoutSession/show?id=${checkout.id}`

    return NextResponse.json({
      checkoutUrl,
      checkoutId: checkout.id,
      customerId: customer.id,
    })
  } catch (error) {
    console.error('[Asaas Checkout] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao criar checkout Asaas' },
      { status: 500 }
    )
  }
}
