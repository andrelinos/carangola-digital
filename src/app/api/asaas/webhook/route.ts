/**
 * POST /api/asaas/webhook
 *
 * Recebe eventos do Asaas e processa o status da assinatura.
 *
 * Segurança: valida o header `asaas-access-token` contra ASAAS_WEBHOOK_TOKEN.
 *
 * Configure no painel Asaas (Integrações > Webhooks):
 *   URL: https://seudominio.com.br/api/asaas/webhook
 *   Token: o valor de ASAAS_WEBHOOK_TOKEN
 *
 * Ref: https://docs.asaas.com/docs/sobre-os-webhooks
 */

import { NextResponse } from 'next/server'
import type { AsaasWebhookPayload } from '@/_types/asaas'
import { handleAsaasWebhook } from '@/app/server/asaas/handle-payment'

export async function POST(request: Request) {
  // 1. Valida o token de segurança do webhook
  const receivedToken = request.headers.get('asaas-access-token')
  const expectedToken = process.env.ASAAS_WEBHOOK_TOKEN

  if (!expectedToken) {
    console.error('[Asaas Webhook] ASAAS_WEBHOOK_TOKEN não configurado.')
    // Retorna 200 para não pausar a fila do Asaas (idempotência)
    return NextResponse.json({ received: true }, { status: 200 })
  }

  if (receivedToken !== expectedToken) {
    return NextResponse.json(
      { error: 'Token de webhook inválido' },
      { status: 401 }
    )
  }

  let payload: AsaasWebhookPayload

  try {
    payload = (await request.json()) as AsaasWebhookPayload
  } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })
  }

  const { event, payment } = payload

  // Loga o evento recebido (remover em produção se gerar muito ruído)
  console.info(`[Asaas Webhook] Evento recebido: ${event} | Payment: ${payment?.id}`)

  try {
    /**
     * Detecta o planType a partir do externalReference salvo no checkout.
     * Como gravamos `externalReference: userId`, buscamos o planType
     * no campo `planType` salvo no Firestore ao criar o checkout.
     *
     * Alternativa mais robusta: salvar o planType no externalReference
     * como JSON encoded ou usar campos separados.
     */
    const planType = await detectPlanTypeFromPayment(payment?.id)

    await handleAsaasWebhook(payload, planType)
  } catch (error) {
    console.error('[Asaas Webhook] Erro ao processar:', error)
    // Retorna 200 mesmo em erro interno para não bloquear a fila Asaas
    // O Asaas re-tentará automaticamente se retornarmos 5xx
    return NextResponse.json({ received: true, error: 'Erro interno' }, { status: 200 })
  }

  // Responde 200 rapidamente — o Asaas exige resposta rápida
  return NextResponse.json({ received: true }, { status: 200 })
}

/**
 * Tenta detectar o planType buscando o usuário que possui esse paymentId
 * ou usando o campo `planType` gravado no Firestore durante o checkout.
 *
 * Se não encontrar, retorna 'basic' como fallback seguro.
 */
async function detectPlanTypeFromPayment(
  paymentId?: string
): Promise<string> {
  if (!paymentId) return 'basic'

  try {
    // Import dinâmico para evitar circular dependency
    const { db } = await import('@/lib/firebase')

    // Busca usuário que tem esse paymentId gravado (via planActive.id)
    const query = await db
      .collection('users')
      .where('planActive.lastPaymentId', '==', paymentId)
      .limit(1)
      .get()

    if (!query.empty) {
      return query.docs[0].data()?.planType ?? 'basic'
    }

    // Busca pelo asaasLastCheckoutId
    const checkoutQuery = await db
      .collection('users')
      .where('asaasLastCheckoutId', '==', paymentId)
      .limit(1)
      .get()

    if (!checkoutQuery.empty) {
      return checkoutQuery.docs[0].data()?.planType ?? 'basic'
    }
  } catch {
    // Falha silenciosa — usa fallback
  }

  return 'basic'
}
