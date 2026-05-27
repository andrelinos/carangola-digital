/**
 * POST /api/asaas/upgrade-plan
 *
 * Endpoint de Upgrade de Plano com Pró-Rata (Proration).
 *
 * Fluxo:
 *  1. Valida a sessão e o body
 *  2. Busca o usuário no Firestore para obter planExpiresAt e asaasCustomerId
 *  3. Calcula o crédito dos dias não utilizados do plano atual
 *  4. Subtrai o crédito do valor anual do novo plano → upgradePrice (min R$5,00)
 *  5. Salva planType pendente no Firestore (para o webhook ler)
 *  6. Cria uma cobrança avulsa (DETACHED) no Asaas com externalReference = UPGRADE_{newPlanType}_{userId}
 *  7. Retorna a invoiceUrl para redirecionar o cliente
 *
 * Quando o webhook confirmar o PAYMENT_CONFIRMED com externalReference UPGRADE_*:
 *  - Cancela a assinatura antiga
 *  - Cria nova assinatura anual do novo plano
 *  - Atualiza o Firestore
 *
 * Ref: https://docs.asaas.com/reference/criar-nova-cobranca
 */

import { Timestamp } from 'firebase-admin/firestore'
import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import {
  type PlanTypeProps,
  plansBusinessConfig,
} from '@/configs/plans-business'
import { createAsaasPayment } from '@/lib/asaas'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'

/** Valor mínimo de cobrança para upgrade (R$ 9,99) */
const ASAAS_MIN_CHARGE = 9.99

/**
 * Taxa de retenção do crédito de pro-rata no upgrade.
 * O cliente recebe 80% do valor restante como desconto — a plataforma retém 20% como fee de migração.
 */
const UPGRADE_CREDIT_RETENTION = 0.8

/** Formata data para YYYY-MM-DD no fuso horário local */
function toLocalDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

interface UpgradePlanBody {
  newPlanType: Exclude<PlanTypeProps, 'free'>
}

export async function POST(req: NextRequest) {
  // ── 1. Autenticação ───────────────────────────────────────────────────────
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const userId = session.user.id

  // ── 2. Parse do body ──────────────────────────────────────────────────────
  let body: UpgradePlanBody

  try {
    body = (await req.json()) as UpgradePlanBody
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const newPlanType = body.newPlanType as string

  const newPlanConfig = plansBusinessConfig[newPlanType as PlanTypeProps]

  if (!newPlanConfig || newPlanType === 'free') {
    return NextResponse.json(
      { error: 'newPlanType inválido. Use: basic, pro ou master.' },
      { status: 400 }
    )
  }

  // ── 3. Busca dados do usuário no Firestore ────────────────────────────────
  const userDoc = await db.collection('users').doc(userId).get()

  if (!userDoc.exists || !userDoc.data()) {
    return NextResponse.json(
      { error: 'Usuário não encontrado no banco de dados.' },
      { status: 404 }
    )
  }

  const userData = userDoc.data()
  const currentPlanType: string = userData?.planType ?? 'free'
  const planExpiresAt: number | null = userData?.planExpiresAt ?? null
  const asaasCustomerId: string | null = userData?.asaasCustomerId ?? null

  // ── 4. Validações de negócio ──────────────────────────────────────────────
  if (currentPlanType === newPlanType) {
    return NextResponse.json(
      { error: 'O usuário já está neste plano.' },
      { status: 400 }
    )
  }

  if (!asaasCustomerId) {
    return NextResponse.json(
      {
        error:
          'Cliente Asaas não encontrado. Faça uma assinatura inicial primeiro.',
      },
      { status: 400 }
    )
  }

  if (!planExpiresAt || planExpiresAt <= Date.now()) {
    return NextResponse.json(
      {
        error:
          'Plano atual já expirado. Por favor, faça uma nova assinatura diretamente.',
      },
      { status: 400 }
    )
  }

  // ── 5. Cálculo de Pró-Rata ────────────────────────────────────────────────
  const now = Date.now()
  const msPerDay = 1000 * 60 * 60 * 24

  // Dias restantes do plano atual (arredondado para cima)
  const remainingDays = Math.ceil((planExpiresAt - now) / msPerDay)

  // Valor diário do plano atual (em centavos → reais)
  const currentPlanConfig =
    plansBusinessConfig[currentPlanType as PlanTypeProps]
  const currentPlanAnnualPriceReais = (currentPlanConfig?.price ?? 0) / 100
  const currentDailyRate = currentPlanAnnualPriceReais / 365

  // Crédito bruto dos dias não utilizados
  const rawCreditReais = remainingDays * currentDailyRate

  // Aplica a taxa de retenção: cliente recebe 80% do crédito como desconto
  const creditReais = Math.round(rawCreditReais * UPGRADE_CREDIT_RETENTION * 100) / 100

  // Valor do novo plano (em centavos → reais)
  const newPlanAnnualPriceReais = newPlanConfig.price / 100

  // Preço final do upgrade: novo plano anual menos o desconto efetivo
  const rawUpgradePrice = newPlanAnnualPriceReais - creditReais

  // Garante o mínimo de R$ 9,99
  const upgradePrice = Math.max(
    Math.round(rawUpgradePrice * 100) / 100,
    ASAAS_MIN_CHARGE
  )

  console.info(
    `[Upgrade Plan] userId=${userId} | ${currentPlanType}→${newPlanType}`,
    `| diasRestantes=${remainingDays} | crédito=R$${creditReais.toFixed(2)}`,
    `| preçoUpgrade=R$${upgradePrice.toFixed(2)}`
  )

  // ── 6. Salva pendência no Firestore ───────────────────────────────────────
  // O webhook vai ler esse campo para saber qual plano ativar após o pagamento
  await db.collection('users').doc(userId).update({
    pendingUpgradePlanType: newPlanType,
    updatedAt: Timestamp.now().toMillis(),
  })

  // ── 7. Cria a cobrança avulsa de upgrade no Asaas ─────────────────────────
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.BASE_URL ||
    'http://localhost:3000'

  const dueDate = toLocalDateString(new Date())

  // externalReference com prefixo UPGRADE_ para o webhook identificar o tipo
  const externalReference = `UPGRADE_${newPlanType.toUpperCase()}_${userId}`

  try {
    const payment = await createAsaasPayment({
      customer: asaasCustomerId,
      billingType: 'CREDIT_CARD',
      value: upgradePrice,
      dueDate,
      description: `Upgrade para o plano ${newPlanConfig.title} (pró-rata de ${remainingDays} dias)`,
      externalReference,
      callback: {
        successUrl: `${siteUrl}/compra?status=sucesso&gateway=asaas&tipo=upgrade`,
        cancelUrl: `${siteUrl}/compra?status=cancelado&gateway=asaas`,
        autoRedirect: true,
      },
    })

    // Salva o paymentId pendente para rastreamento
    await db.collection('users').doc(userId).update({
      pendingUpgradePaymentId: payment.id,
      updatedAt: Timestamp.now().toMillis(),
    })

    return NextResponse.json({
      paymentId: payment.id,
      invoiceUrl: payment.invoiceUrl,
      upgradePrice,
      creditApplied: creditReais,
      remainingDays,
      newPlanType,
    })
  } catch (error) {
    console.error('[Upgrade Plan] Erro ao criar cobrança no Asaas:', error)

    // Limpa a pendência em caso de erro
    await db.collection('users').doc(userId).update({
      pendingUpgradePlanType: null,
      pendingUpgradePaymentId: null,
      updatedAt: Timestamp.now().toMillis(),
    })

    return NextResponse.json(
      { error: 'Erro ao processar upgrade. Tente novamente.' },
      { status: 500 }
    )
  }
}
