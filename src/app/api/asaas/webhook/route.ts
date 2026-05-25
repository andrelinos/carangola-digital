/**
 * POST /api/asaas/webhook
 *
 * Recebe todos os eventos do Asaas e encaminha para o handler de negócio.
 *
 * Segurança:
 *   - Valida o header `asaas-access-token` contra ASAAS_WEBHOOK_TOKEN
 *   - Sempre responde 200 para eventos desconhecidos/informativos (idempotência)
 *   - Responde 200 mesmo em erros internos para não pausar a fila de retentativas
 *
 * Configure no painel Asaas (Integrações > Webhooks):
 *   URL:   https://seudominio.com.br/api/asaas/webhook
 *   Token: valor de ASAAS_WEBHOOK_TOKEN
 *
 * Ref: https://docs.asaas.com/docs/sobre-os-webhooks
 */

import { NextResponse } from 'next/server'
import type { AsaasWebhookPayload } from '@/_types/asaas'
import { handleAsaasWebhook } from '@/app/server/asaas/handle-payment'

export async function POST(request: Request) {
  console.log('webhook recebido')
  console.log(request)
  // ── 1. Validação do token de segurança ─────────────────────────────────────
  const receivedToken = request.headers.get('asaas-access-token')
  const expectedToken = process.env.ASAAS_WEBHOOK_TOKEN

  if (!expectedToken) {
    console.error('[Asaas Webhook] ASAAS_WEBHOOK_TOKEN não configurado.')
    // Retorna 200 para não pausar a fila do Asaas
    return NextResponse.json({ received: true }, { status: 200 })
  }

  if (receivedToken !== expectedToken) {
    console.warn('[Asaas Webhook] Token inválido recebido:', receivedToken)
    return NextResponse.json(
      { error: 'Token de webhook inválido' },
      { status: 401 }
    )
  }

  // ── 2. Parse do payload ────────────────────────────────────────────────────
  let payload: AsaasWebhookPayload

  try {
    payload = (await request.json()) as AsaasWebhookPayload
  } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })
  }

  const { event } = payload

  // Log do evento recebido (útil para debug/auditoria)
  console.info(
    `[Asaas Webhook] Evento: ${event}`,
    payload.payment
      ? `| payment=${payload.payment.id} | externalRef=${payload.payment.externalReference ?? 'N/A'}`
      : payload.subscription
        ? `| subscription=${payload.subscription.id} | externalRef=${payload.subscription.externalReference ?? 'N/A'}`
        : ''
  )

  // ── 3. Processamento ──────────────────────────────────────────────────────
  try {
    await handleAsaasWebhook(payload)
  } catch (error) {
    console.error('[Asaas Webhook] Erro inesperado ao processar:', error)
    // Retorna 200 para não bloquear a fila de retentativas do Asaas.
    // O erro já foi logado; corrija e use o painel de reenvio do Asaas se necessário.
    return NextResponse.json(
      { received: true, error: 'Erro interno' },
      { status: 200 }
    )
  }

  // ── 4. Resposta rápida (o Asaas exige resposta em < 5s) ───────────────────
  return NextResponse.json({ received: true }, { status: 200 })
}
