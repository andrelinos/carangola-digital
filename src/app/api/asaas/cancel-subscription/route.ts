/**
 * POST /api/asaas/cancel-subscription
 *
 * Cancela apenas a RENOVAÇÃO da assinatura — modelo Netflix/HBO Max.
 *
 * O que faz:
 *  - Cancela a assinatura recorrente no Asaas (DELETE /subscriptions/:id)
 *    → O Asaas não cobrará o próximo ciclo
 *  - Marca `planCancelledAt` e `asaasSubscriptionStatus: 'CANCELLED'` no Firestore
 *  - NÃO altera `planType` nem `planExpiresAt`
 *    → O usuário mantém o acesso até a data de expiração atual
 *
 * Segurança: apenas o próprio usuário autenticado pode cancelar.
 */

import { Timestamp } from 'firebase-admin/firestore'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { deleteAsaasSubscription } from '@/lib/asaas'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'

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
  const subscriptionId: string | null = userData?.asaasSubscriptionId ?? null
  const planType: string = userData?.planType ?? 'free'
  const planExpiresAt: number | null = userData?.planExpiresAt ?? null

  // ── 3. Validações ─────────────────────────────────────────────────────────
  if (planType === 'free') {
    return NextResponse.json(
      { error: 'Não há assinatura paga ativa para cancelar.' },
      { status: 400 }
    )
  }

  if (userData?.asaasSubscriptionStatus === 'CANCELLED') {
    return NextResponse.json(
      { error: 'A renovação já foi cancelada. Você mantém acesso até o fim do período atual.' },
      { status: 400 }
    )
  }

  if (!planExpiresAt || planExpiresAt <= Date.now()) {
    return NextResponse.json(
      { error: 'Plano já expirado. Não há renovação futura para cancelar.' },
      { status: 400 }
    )
  }

  // ── 4. Cancela no Asaas (se houver subscription ID) ──────────────────────
  if (subscriptionId) {
    try {
      await deleteAsaasSubscription(subscriptionId)
      console.info(
        `[Cancel Subscription] Assinatura ${subscriptionId} cancelada no Asaas para userId=${userId}`
      )
    } catch (err) {
      console.error('[Cancel Subscription] Erro ao cancelar no Asaas:', err)
      // Continua mesmo se o Asaas retornar erro (pode já estar inativa)
    }
  } else {
    console.warn(
      `[Cancel Subscription] userId=${userId} não possui asaasSubscriptionId. Cancelando apenas no Firestore.`
    )
  }

  // ── 5. Marca cancelamento no Firestore (sem remover acesso) ───────────────
  // planType e planExpiresAt NÃO são alterados — acesso garantido até expirar
  const now = Timestamp.now().toMillis()

  await db.collection('users').doc(userId).update({
    asaasSubscriptionStatus: 'CANCELLED',
    planCancelledAt: now,
    // Garante que o planActive reflita o cancelamento da renovação
    'planActive.profiles.status': 'cancelled_renewal',
    'planActive.properties.status': 'cancelled_renewal',
    updatedAt: now,
  })

  console.info(
    `[Cancel Subscription] ✅ Renovação cancelada para userId=${userId}. Acesso até ${new Date(planExpiresAt!).toISOString()}`
  )

  return NextResponse.json({
    success: true,
    message: 'Renovação cancelada com sucesso. Você mantém o acesso até o fim do período atual.',
    accessUntil: planExpiresAt,
  })
}
