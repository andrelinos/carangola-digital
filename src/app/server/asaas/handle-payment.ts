'use server'

/**
 * Lógica de negócio para processar eventos do Asaas webhook.
 * Atualiza o Firestore com o status da assinatura do usuário.
 *
 * Ref: https://docs.asaas.com/docs/eventos-de-webhooks
 */

import { Timestamp } from 'firebase-admin/firestore'
import type { AsaasWebhookEvent, AsaasWebhookPayload } from '@/_types/asaas'
import {
  type PlanTypeProps,
  plansBusinessConfig,
} from '@/configs/plans-business'
import { db } from '@/lib/firebase'

// Mapeamento de planType (ex: 'basic') → cycle Asaas
const PLAN_TO_CYCLE: Record<string, string> = {
  basic: 'YEARLY',
  pro: 'YEARLY',
  master: 'YEARLY',
}

/**
 * Calcula a data de expiração com base no planType usando plansBusinessConfig.
 */
function calculateExpiresAt(planType: string): number {
  const config = plansBusinessConfig[planType as PlanTypeProps]
  const months = config?.durationMonths ?? 12
  const date = new Date()
  date.setMonth(date.getMonth() + months)
  return date.getTime()
}

/**
 * Busca o userId no Firestore a partir do asaasSubscriptionId ou externalReference.
 * O externalReference no checkout contém o userId.
 */
async function findUserByExternalReference(
  externalReference: string
): Promise<string | null> {
  // O externalReference foi gravado como userId no createAsaasCheckout
  // Verificamos se existe o usuário com esse ID diretamente
  const userDoc = await db.collection('users').doc(externalReference).get()
  if (userDoc.exists) return externalReference

  // Fallback: busca por asaasCustomerId
  const query = await db
    .collection('users')
    .where('asaasCustomerId', '==', externalReference)
    .limit(1)
    .get()

  return query.docs[0]?.id ?? null
}

/**
 * Processa o payload do webhook Asaas e atualiza o Firestore.
 *
 * Eventos tratados:
 * - PAYMENT_RECEIVED / PAYMENT_CONFIRMED → ativa o plano
 * - PAYMENT_OVERDUE → mantém ativo mas registra atraso
 * - SUBSCRIPTION_INACTIVATED → marca como INACTIVE
 */
export async function handleAsaasWebhook(
  payload: AsaasWebhookPayload,
  planType: string = 'basic'
): Promise<boolean> {
  const { event, payment } = payload

  const externalRef = payment.externalReference

  if (!externalRef) {
    console.error('[Asaas Webhook] externalReference ausente no pagamento:', payment.id)
    return false
  }

  try {
    const userId = await findUserByExternalReference(externalRef)

    if (!userId) {
      console.error('[Asaas Webhook] Usuário não encontrado para externalReference:', externalRef)
      return false
    }

    const now = Timestamp.now().toMillis()

    const handledEvents: AsaasWebhookEvent[] = [
      'PAYMENT_RECEIVED',
      'PAYMENT_CONFIRMED',
      'PAYMENT_OVERDUE',
      'SUBSCRIPTION_INACTIVATED',
    ]

    if (!handledEvents.includes(event)) {
      // Evento não relevante — retorna 200 sem processar
      return true
    }

    if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
      const expiresAt = calculateExpiresAt(planType)

      const planActive = {
        id: payment.id,
        type: planType,
        expiresAt,
        paymentDate: now,
        status: 'active',
        lastPaymentId: payment.id,
        transactionAmount: payment.value,
        currency: 'BRL',
        gateway: 'asaas',
        asaasSubscriptionId: payment.subscription ?? null,
      }

      // Atualiza coleção users
      await db.collection('users').doc(userId).update({
        planActive,
        asaasSubscriptionId: payment.subscription ?? null,
        asaasSubscriptionStatus: 'ACTIVE',
        planType,
        planExpiresAt: expiresAt,
        updatedAt: now,
      })

      // Atualiza coleção profiles (usa o mesmo userId como profileId base)
      // Se o profileId for diferente do userId, precisará de um lookup extra
      const profileQuery = await db
        .collection('profiles')
        .where('userId', '==', userId)
        .limit(1)
        .get()

      if (!profileQuery.empty) {
        await profileQuery.docs[0].ref.update({
          planActive,
          updatedAt: now,
        })
      }

      return true
    }

    if (event === 'PAYMENT_OVERDUE') {
      // Pagamento atrasado — mantém o plano mas registra o status
      await db.collection('users').doc(userId).update({
        asaasSubscriptionStatus: 'PENDING',
        updatedAt: now,
      })
      return true
    }

    if (event === 'SUBSCRIPTION_INACTIVATED') {
      const planActive = {
        type: 'free',
        expiresAt: null,
        status: 'inactive',
        gateway: 'asaas',
      }

      await db.collection('users').doc(userId).update({
        planActive,
        asaasSubscriptionStatus: 'INACTIVE',
        planType: 'free',
        planExpiresAt: null,
        updatedAt: now,
      })

      const profileQuery = await db
        .collection('profiles')
        .where('userId', '==', userId)
        .limit(1)
        .get()

      if (!profileQuery.empty) {
        await profileQuery.docs[0].ref.update({
          planActive,
          updatedAt: now,
        })
      }

      return true
    }

    return true
  } catch (error) {
    console.error('[Asaas Webhook] Erro ao processar evento:', event, error)
    return false
  }
}

export { PLAN_TO_CYCLE }
