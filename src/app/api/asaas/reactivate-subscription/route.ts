/**
 * POST /api/asaas/reactivate-subscription
 *
 * Reativa a renovação automática após um cancelamento no modelo Netflix.
 *
 * Fluxo:
 *  1. Valida sessão e estado do usuário (deve estar cancelado e dentro do período pago)
 *  2. Cria nova assinatura no Asaas com nextDueDate = planExpiresAt
 *     → Nenhuma cobrança imediata; o cliente paga apenas na renovação original
 *  3. Atualiza Firestore: novo asaasSubscriptionId, status ACTIVE, limpa planCancelledAt
 *
 * Ref: https://docs.asaas.com/reference/criar-nova-assinatura
 */

import { Timestamp } from 'firebase-admin/firestore'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { type PlanTypeProps, plansBusinessConfig } from '@/configs/plans-business'
import { createAsaasSubscription } from '@/lib/asaas'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'

/** Formata timestamp em YYYY-MM-DD para o Asaas */
function toAsaasDate(timestamp: number): string {
  const d = new Date(timestamp)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export async function POST() {
  // ── 1. Autenticação ───────────────────────────────────────────────────────
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const userId = session.user.id

  // ── 2. Busca dados do usuário ─────────────────────────────────────────────
  const userDoc = await db.collection('users').doc(userId).get()

  if (!userDoc.exists) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
  }

  const userData = userDoc.data()
  const planType: string = userData?.planType ?? 'free'
  const planExpiresAt: number | null = userData?.planExpiresAt ?? null
  const asaasCustomerId: string | null = userData?.asaasCustomerId ?? null
  const subscriptionStatus: string | null = userData?.asaasSubscriptionStatus ?? null

  // ── 3. Validações de negócio ──────────────────────────────────────────────
  if (planType === 'free') {
    return NextResponse.json(
      { error: 'Nenhuma assinatura paga encontrada para reativar.' },
      { status: 400 }
    )
  }

  if (subscriptionStatus !== 'CANCELLED') {
    return NextResponse.json(
      { error: 'A assinatura não está cancelada.' },
      { status: 400 }
    )
  }

  if (!planExpiresAt || planExpiresAt <= Date.now()) {
    return NextResponse.json(
      {
        error:
          'O período pago já expirou. Faça uma nova assinatura para continuar.',
      },
      { status: 400 }
    )
  }

  if (!asaasCustomerId) {
    return NextResponse.json(
      { error: 'Cliente Asaas não encontrado. Entre em contato com o suporte.' },
      { status: 400 }
    )
  }

  // ── 4. Busca config do plano atual ────────────────────────────────────────
  const planConfig = plansBusinessConfig[planType as PlanTypeProps]

  if (!planConfig || planConfig.price === 0) {
    return NextResponse.json(
      { error: 'Configuração do plano inválida.' },
      { status: 400 }
    )
  }

  // ── 5. Cria nova assinatura com nextDueDate = data de expiração atual ─────
  // O Asaas não cobrará agora — a primeira cobrança ocorre em planExpiresAt
  const nextDueDate = toAsaasDate(planExpiresAt)
  const priceInReais = planConfig.price / 100

  let newSubscriptionId: string

  try {
    const subscription = await createAsaasSubscription({
      customer: asaasCustomerId,
      billingType: 'CREDIT_CARD',
      value: priceInReais,
      nextDueDate,
      cycle: 'YEARLY',
      description: `Assinatura ${planConfig.title} — Carangola Digital (Renovação Anual)`,
      externalReference: userId,
    })

    newSubscriptionId = subscription.id

    console.info(
      `[Reactivate] Nova assinatura criada: ${newSubscriptionId} para userId=${userId}`,
      `| nextDueDate=${nextDueDate} | plano=${planType}`
    )
  } catch (err) {
    console.error('[Reactivate] Erro ao criar assinatura no Asaas:', err)
    return NextResponse.json(
      { error: 'Não foi possível reativar a renovação. Tente novamente.' },
      { status: 500 }
    )
  }

  // ── 6. Atualiza Firestore ─────────────────────────────────────────────────
  const now = Timestamp.now().toMillis()

  await db.collection('users').doc(userId).update({
    asaasSubscriptionId: newSubscriptionId,
    asaasSubscriptionStatus: 'ACTIVE',
    planCancelledAt: null,
    // Mantém planType e planExpiresAt intactos
    'planActive.profiles.status': 'active',
    'planActive.properties.status': 'active',
    updatedAt: now,
  })

  console.info(
    `[Reactivate] ✅ Renovação reativada para userId=${userId}`,
    `| próxima cobrança em ${nextDueDate}`
  )

  return NextResponse.json({
    success: true,
    message: `Renovação reativada! Próxima cobrança em ${nextDueDate}.`,
    nextDueDate,
    subscriptionId: newSubscriptionId,
  })
}
