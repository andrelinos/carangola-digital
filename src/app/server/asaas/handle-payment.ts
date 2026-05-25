'use server'

/**
 * Lógica de negócio para processar eventos do Asaas webhook.
 *
 * Eventos de PAGAMENTO (PAYMENT_*) → objeto `payment` no payload
 * Eventos de ASSINATURA (SUBSCRIPTION_*) → objeto `subscription` no payload
 *
 * Estratégia de identificação do usuário:
 *   1. `payment.externalReference` ou `subscription.externalReference` → userId direto
 *   2. Fallback: busca por `asaasCustomerId` ou `asaasSubscriptionId` no Firestore
 *
 * Estratégia de identificação do planType:
 *   - Lido do campo `planType` salvo no Firestore do usuário (gravado no momento
 *     do checkout). Não dependemos do paymentId para isso.
 *
 * Ref: https://docs.asaas.com/docs/eventos-de-webhooks
 */

import { Timestamp } from 'firebase-admin/firestore'
import type {
  AsaasWebhookEvent,
  AsaasWebhookPayload,
  AsaasWebhookPayment,
  AsaasWebhookSubscription,
} from '@/_types/asaas'
import {
  type PlanTypeProps,
  plansBusinessConfig,
} from '@/configs/plans-business'
import { createAsaasSubscription, deleteAsaasSubscription } from '@/lib/asaas'
import { db } from '@/lib/firebase'

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Calcula a data de expiração com base no planType.
 * Para planos anuais (durationMonths=12), soma 12 meses à data atual.
 */
function calculateExpiresAt(planType: string): number {
  const config = plansBusinessConfig[planType as PlanTypeProps]
  const months = config?.durationMonths ?? 12
  const date = new Date()
  date.setMonth(date.getMonth() + months)
  return date.getTime()
}

/**
 * Resolve o userId a partir do externalReference ou de fallbacks no Firestore.
 *
 * Fluxo:
 *  1. externalReference === userId direto (como gravamos no checkout)
 *  2. busca por asaasCustomerId
 *  3. busca por asaasSubscriptionId
 */
async function resolveUserId(
  externalReference?: string,
  asaasCustomerId?: string,
  asaasSubscriptionId?: string
): Promise<string | null> {
  console.log(
    `[Webhook Debug] Tentando resolver usuário com: extRef=${externalReference}, customerId=${asaasCustomerId}, subId=${asaasSubscriptionId}`
  )

  // 1. externalReference = userId
  if (externalReference && externalReference !== 'N/A') {
    const doc = await db.collection('users').doc(externalReference).get()
    console.log(
      `[Webhook Debug] Resolvido via externalReference: ${externalReference}`
    )
    if (doc.exists) return externalReference
  }

  // 2. Fallback: busca por asaasCustomerId
  if (asaasCustomerId) {
    const q = await db
      .collection('users')
      .where('asaasCustomerId', '==', asaasCustomerId)
      .limit(1)
      .get()
    if (!q.empty) {
      console.log(
        `[Webhook Debug] Resolvido via asaasCustomerId: ${q.docs[0].id}`
      )
      return q.docs[0].id
    } else {
      console.log(
        `[Webhook Debug] Usuário não encontrado para asaasCustomerId: ${asaasCustomerId}`
      )
    }
  }

  // 3. Fallback: busca por asaasSubscriptionId
  if (asaasSubscriptionId) {
    const q = await db
      .collection('users')
      .where('asaasSubscriptionId', '==', asaasSubscriptionId)
      .limit(1)
      .get()
    if (!q.empty) {
      console.log(
        `[Webhook Debug] Resolvido via asaasSubscriptionId: ${q.docs[0].id}`
      )
      return q.docs[0].id
    }
  }

  console.error(
    `[Webhook Debug] ❌ FALHA TOTAL: Nenhum usuário encontrado para estes parâmetros.`
  )

  return null
}

/**
 * Atualiza também a coleção `profiles` vinculada ao userId.
 */
async function updateProfile(
  userId: string,
  data: Record<string, unknown>
): Promise<void> {
  const q = await db
    .collection('profiles')
    .where('userId', '==', userId)
    .limit(1)
    .get()
  if (!q.empty) {
    await q.docs[0].ref.update({
      ...data,
      updatedAt: Timestamp.now().toMillis(),
    })
  }
}

// ─── Handlers de eventos ─────────────────────────────────────────────────────

/**
 * PAYMENT_CONFIRMED / PAYMENT_RECEIVED / SUBSCRIPTION_PAYMENT_CONFIRMED / SUBSCRIPTION_PAYMENT_RECEIVED
 *
 * Ativa o plano do usuário no Firestore.
 */
async function handlePaymentSuccess(
  payment: AsaasWebhookPayment
): Promise<void> {
  const userId = await resolveUserId(
    payment.externalReference,
    payment.customer,
    payment.subscription
  )

  if (!userId) {
    console.error(
      '[Asaas Webhook] Usuário não encontrado para payment:',
      payment.id,
      'externalRef:',
      payment.externalReference
    )
    return
  }

  // Lê o planType do Firestore (gravado no momento do checkout)
  const userDoc = await db.collection('users').doc(userId).get()
  const planType: string = userDoc.data()?.planType ?? 'basic'

  const now = Timestamp.now().toMillis()
  const expiresAt = calculateExpiresAt(planType)

  // Estrutura aninhada que o NextAuth (session callback) espera
  const planEntry = {
    id: payment.id,
    type: planType,
    expiresAt,
    paymentDate: now,
    status: 'active',
    lastPaymentId: payment.id,
    transactionAmount: payment.value,
    netAmount: payment.netValue,
    currency: 'BRL',
    gateway: 'asaas',
    billingType: payment.billingType,
    asaasSubscriptionId: payment.subscription ?? null,
  }

  const planActive = {
    profiles: planEntry,
    properties: planEntry,
  }

  await db
    .collection('users')
    .doc(userId)
    .update({
      planActive,
      planType,
      asaasSubscriptionId: payment.subscription ?? null,
      asaasSubscriptionStatus: 'ACTIVE',
      planExpiresAt: expiresAt,
      updatedAt: now,
    })

  await updateProfile(userId, { planActive: planEntry })

  console.info(
    `[Asaas Webhook] ✅ Plano ${planType} ativado para userId=${userId} até ${new Date(expiresAt).toISOString()}`
  )
}

/**
 * UPGRADE: PAYMENT_CONFIRMED com externalReference começando por 'UPGRADE_'
 *
 * Fluxo:
 *  1. Extrai o newPlanType do externalReference (ex: UPGRADE_PRO_userId)
 *  2. Cancela a assinatura antiga no Asaas
 *  3. Cria nova assinatura anual no Asaas (vencimento = hoje + 1 ano)
 *  4. Atualiza o Firestore com o novo plano e limpa campos pendentes
 */
async function handleUpgradePayment(
  payment: AsaasWebhookPayment,
  userId: string
): Promise<void> {
  // externalReference format: UPGRADE_{PLANTYPE}_{userId}
  // ex: UPGRADE_PRO_abc123
  const parts = (payment.externalReference ?? '').split('_')
  // parts[0] = 'UPGRADE', parts[1] = 'PRO', parts[2..] = userId parts
  const newPlanType = parts[1]?.toLowerCase() as PlanTypeProps

  const newPlanConfig = plansBusinessConfig[newPlanType]
  if (!newPlanConfig) {
    console.error(
      `[Asaas Webhook] Upgrade: planType inválido extraido do externalReference: ${payment.externalReference}`
    )
    return
  }

  const userDoc = await db.collection('users').doc(userId).get()
  const userData = userDoc.data()
  const oldSubscriptionId: string | null = userData?.asaasSubscriptionId ?? null
  const asaasCustomerId: string | null = userData?.asaasCustomerId ?? null

  const now = Timestamp.now().toMillis()

  // ── 2. Cancela a assinatura antiga ───────────────────────────────────────
  if (oldSubscriptionId) {
    try {
      await deleteAsaasSubscription(oldSubscriptionId)
      console.info(
        `[Asaas Webhook] 🗑️ Assinatura antiga cancelada: ${oldSubscriptionId}`
      )
    } catch (err) {
      // Não bloqueia o upgrade se o cancel falhar (assinatura pode já estar inativa)
      console.warn(
        `[Asaas Webhook] Aviso: falha ao cancelar assinatura antiga ${oldSubscriptionId}:`,
        err
      )
    }
  }

  // ── 3. Cria nova assinatura anual (cobrará o valor cheio daqui a 1 ano) ──
  let newSubscriptionId: string | null = null

  if (asaasCustomerId) {
    try {
      const nextDueDate = new Date()
      nextDueDate.setFullYear(nextDueDate.getFullYear() + 1)
      const y = nextDueDate.getFullYear()
      const m = String(nextDueDate.getMonth() + 1).padStart(2, '0')
      const d = String(nextDueDate.getDate()).padStart(2, '0')

      const newSubscription = await createAsaasSubscription({
        customer: asaasCustomerId,
        billingType: 'CREDIT_CARD',
        value: newPlanConfig.price / 100, // centavos → reais
        nextDueDate: `${y}-${m}-${d}`,
        cycle: 'YEARLY',
        description: `Assinatura ${newPlanConfig.title} — Carangola Digital (Renovação Anual)`,
        externalReference: userId, // webhook vai usar externalReference normal no futuro
      })

      newSubscriptionId = newSubscription.id
      console.info(
        `[Asaas Webhook] ✅ Nova assinatura criada: ${newSubscriptionId} para plano ${newPlanType}`
      )
    } catch (err) {
      console.error(
        '[Asaas Webhook] Erro ao criar nova assinatura após upgrade:',
        err
      )
      // Não aborta: o Firestore será atualizado mesmo sem a subscription
    }
  }

  // ── 4. Calcula nova data de expiração (hoje + 1 ano) ───────────────────
  const expiresAt = calculateExpiresAt(newPlanType)

  const planEntry = {
    id: payment.id,
    type: newPlanType,
    expiresAt,
    paymentDate: now,
    status: 'active',
    lastPaymentId: payment.id,
    transactionAmount: payment.value,
    netAmount: payment.netValue,
    currency: 'BRL',
    gateway: 'asaas',
    billingType: payment.billingType,
    asaasSubscriptionId: newSubscriptionId,
  }

  const planActive = {
    profiles: planEntry,
    properties: planEntry,
  }

  await db.collection('users').doc(userId).update({
    planActive,
    planType: newPlanType,
    asaasSubscriptionId: newSubscriptionId,
    asaasSubscriptionStatus: 'ACTIVE',
    planExpiresAt: expiresAt,
    // Limpa campos de pendência do upgrade
    pendingUpgradePlanType: null,
    pendingUpgradePaymentId: null,
    updatedAt: now,
  })

  await updateProfile(userId, { planActive: planEntry })

  console.info(
    `[Asaas Webhook] 🎉 Upgrade concluído! userId=${userId} | ${userData?.planType ?? '?'} → ${newPlanType}`,
    `| válido até ${new Date(expiresAt).toISOString()}`
  )
}

/**
 * PAYMENT_OVERDUE / SUBSCRIPTION_PAYMENT_OVERDUE
 *
 * Registra o atraso mas NÃO cancela o plano imediatamente.
 * O Asaas tentará recobrar automaticamente.
 */
async function handlePaymentOverdue(
  payment: AsaasWebhookPayment
): Promise<void> {
  const userId = await resolveUserId(
    payment.externalReference,
    payment.customer,
    payment.subscription
  )
  if (!userId) return

  const now = Timestamp.now().toMillis()
  await db.collection('users').doc(userId).update({
    asaasSubscriptionStatus: 'PENDING',
    'planActive.status': 'overdue',
    updatedAt: now,
  })

  console.warn(
    `[Asaas Webhook] ⚠️ Pagamento em atraso para userId=${userId}, payment=${payment.id}`
  )
}

/**
 * PAYMENT_REFUNDED / PAYMENT_DELETED / SUBSCRIPTION_PAYMENT_REFUNDED / SUBSCRIPTION_PAYMENT_DELETED
 *
 * Reverte o plano para free.
 */
async function handlePaymentReverted(
  payment: AsaasWebhookPayment
): Promise<void> {
  const userId = await resolveUserId(
    payment.externalReference,
    payment.customer,
    payment.subscription
  )
  if (!userId) return

  const now = Timestamp.now().toMillis()
  const planEntry = {
    type: 'free',
    expiresAt: null,
    status: 'refunded',
    gateway: 'asaas',
  }
  const planActive = { profiles: planEntry, properties: planEntry }

  await db.collection('users').doc(userId).update({
    planActive,
    asaasSubscriptionStatus: 'INACTIVE',
    planType: 'free',
    planExpiresAt: null,
    updatedAt: now,
  })

  await updateProfile(userId, { planActive: planEntry })

  console.info(
    `[Asaas Webhook] 🔄 Plano revertido para free. userId=${userId}, payment=${payment.id}`
  )
}

/**
 * SUBSCRIPTION_INACTIVATED / SUBSCRIPTION_DELETED
 *
 * Assinatura cancelada — reverte para free.
 */
async function handleSubscriptionInactivated(
  subscription: AsaasWebhookSubscription
): Promise<void> {
  const userId = await resolveUserId(
    subscription.externalReference,
    subscription.customer,
    subscription.id
  )
  if (!userId) {
    console.error(
      '[Asaas Webhook] Usuário não encontrado para subscription:',
      subscription.id
    )
    return
  }

  const now = Timestamp.now().toMillis()
  const planEntry = {
    type: 'free',
    expiresAt: null,
    status: 'inactive',
    gateway: 'asaas',
  }
  const planActive = { profiles: planEntry, properties: planEntry }

  await db.collection('users').doc(userId).update({
    planActive,
    asaasSubscriptionStatus: 'INACTIVE',
    planType: 'free',
    planExpiresAt: null,
    updatedAt: now,
  })

  await updateProfile(userId, { planActive: planEntry })

  console.info(
    `[Asaas Webhook] ❌ Assinatura inativada para userId=${userId}, sub=${subscription.id}`
  )
}

/**
 * SUBSCRIPTION_ACTIVATED
 *
 * Assinatura reativada — mantém o planType do Firestore e recalcula expiração.
 */
async function handleSubscriptionActivated(
  subscription: AsaasWebhookSubscription
): Promise<void> {
  const userId = await resolveUserId(
    subscription.externalReference,
    subscription.customer,
    subscription.id
  )
  if (!userId) return

  const userDoc = await db.collection('users').doc(userId).get()
  const planType: string = userDoc.data()?.planType ?? 'basic'

  const now = Timestamp.now().toMillis()
  const expiresAt = calculateExpiresAt(planType)

  await db.collection('users').doc(userId).update({
    asaasSubscriptionId: subscription.id,
    asaasSubscriptionStatus: 'ACTIVE',
    planExpiresAt: expiresAt,
    'planActive.status': 'active',
    'planActive.expiresAt': expiresAt,
    updatedAt: now,
  })

  console.info(
    `[Asaas Webhook] 🔁 Assinatura reativada para userId=${userId}, sub=${subscription.id}`
  )
}

// ─── Dispatcher principal ────────────────────────────────────────────────────

/**
 * Processa o payload do webhook Asaas e roteia para o handler correto.
 *
 * Retorna `true` se processado com sucesso (ou evento ignorado intencionalmente).
 * Retorna `false` apenas em erros internos inesperados.
 */
export async function handleAsaasWebhook(
  payload: AsaasWebhookPayload
): Promise<boolean> {
  const { event, payment, subscription } = payload

  console.info(`[Asaas Webhook] Evento: ${event}`)

  try {
    // ── Eventos de Pagamento ───────────────────────────────────────
    if (
      event === 'PAYMENT_CONFIRMED' ||
      event === 'PAYMENT_RECEIVED' ||
      event === 'SUBSCRIPTION_PAYMENT_CONFIRMED' ||
      event === 'SUBSCRIPTION_PAYMENT_RECEIVED'
    ) {
      if (!payment) {
        console.error(`[Asaas Webhook] Evento ${event} sem objeto payment.`)
        return false
      }

      // ✨ Intercepta pagamentos de UPGRADE (externalReference: UPGRADE_{PLAN}_{userId})
      if (payment.externalReference?.startsWith('UPGRADE_')) {
        // Extrai o userId: formato UPGRADE_{PLANTYPE}_{userId} (userId pode conter _)
        // parts[0]='UPGRADE', parts[1]='PRO', parts[2..n]=userId
        const parts = payment.externalReference.split('_')
        const upgradeUserId = parts.slice(2).join('_')

        if (!upgradeUserId) {
          console.error(
            '[Asaas Webhook] Upgrade: não foi possível extrair userId do externalReference:',
            payment.externalReference
          )
          return false
        }

        await handleUpgradePayment(payment, upgradeUserId)
        return true
      }

      // Pagamento normal de nova assinatura
      await handlePaymentSuccess(payment)
      return true
    }

    if (
      event === 'PAYMENT_OVERDUE' ||
      event === 'SUBSCRIPTION_PAYMENT_OVERDUE'
    ) {
      if (payment) await handlePaymentOverdue(payment)
      return true
    }

    if (
      event === 'PAYMENT_REFUNDED' ||
      event === 'PAYMENT_DELETED' ||
      event === 'SUBSCRIPTION_PAYMENT_REFUNDED' ||
      event === 'SUBSCRIPTION_PAYMENT_DELETED'
    ) {
      if (payment) await handlePaymentReverted(payment)
      return true
    }

    // ── Eventos de Assinatura ─────────────────────────────────────
    if (
      event === 'SUBSCRIPTION_INACTIVATED' ||
      event === 'SUBSCRIPTION_DELETED'
    ) {
      if (!subscription) {
        console.error(
          `[Asaas Webhook] Evento ${event} sem objeto subscription.`
        )
        return false
      }
      await handleSubscriptionInactivated(subscription)
      return true
    }

    if (event === 'SUBSCRIPTION_ACTIVATED') {
      if (!subscription) return false
      await handleSubscriptionActivated(subscription)
      return true
    }

    // ── Eventos informativos (sem ação necessária) ─────────────────
    const informationalEvents: AsaasWebhookEvent[] = [
      'PAYMENT_CREATED',
      'PAYMENT_UPDATED',
      'PAYMENT_RESTORED',
      'PAYMENT_RECEIVED_IN_CASH_UNDONE',
      'PAYMENT_CHARGEBACK_REQUESTED',
      'PAYMENT_CHARGEBACK_DISPUTE',
      'PAYMENT_AWAITING_CHARGEBACK_REVERSAL',
      'PAYMENT_DUNNING_RECEIVED',
      'PAYMENT_DUNNING_REQUESTED',
      'PAYMENT_BANK_SLIP_VIEWED',
      'PAYMENT_CHECKOUT_VIEWED',
      'SUBSCRIPTION_CREATED',
      'SUBSCRIPTION_UPDATED',
      'SUBSCRIPTION_PAYMENT_CREATED',
    ]

    if (informationalEvents.includes(event)) {
      console.info(`[Asaas Webhook] Evento informativo ignorado: ${event}`)
      return true
    }

    console.warn(`[Asaas Webhook] Evento desconhecido não tratado: ${event}`)
    return true
  } catch (error) {
    console.error(
      '[Asaas Webhook] Erro inesperado ao processar evento:',
      event,
      error
    )
    return false
  }
}
