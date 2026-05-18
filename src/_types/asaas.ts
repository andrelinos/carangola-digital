// ============================================================
// Asaas API — Tipos TypeScript
// Referência: https://docs.asaas.com/reference
// ============================================================

// ----------------------------
// Checkout
// ----------------------------

export type AsaasBillingType =
  | 'BOLETO'
  | 'CREDIT_CARD'
  | 'PIX'
  | 'UNDEFINED'

export type AsaasChargeType = 'DETACHED' | 'RECURRENT' | 'INSTALLMENT'

export type AsaasSubscriptionCycle =
  | 'WEEKLY'
  | 'BIWEEKLY'
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'SEMIANNUALLY'
  | 'YEARLY'

export interface AsaasCheckoutItem {
  name: string
  description?: string
  quantity: number
  value: number
}

export interface AsaasCheckoutSubscription {
  /** Ciclo de cobrança */
  cycle: AsaasSubscriptionCycle
  /** Descrição visível ao cliente */
  description?: string
  /** Data da próxima cobrança no formato YYYY-MM-DD */
  nextDueDate?: string
  /** Valor da cobrança recorrente (se diferente do item) */
  value?: number
}

export interface AsaasCheckoutCallback {
  /** URL de sucesso após pagamento */
  successUrl: string
  /** URL de cancelamento */
  cancelUrl?: string
  /** Se true, redireciona automaticamente após pagamento */
  autoRedirect?: boolean
}

export interface AsaasCheckoutCustomerData {
  name?: string
  email?: string
  cpfCnpj?: string
  phone?: string
}

export interface AsaasCreateCheckoutBody {
  /** Formas de pagamento aceitas */
  billingTypes: AsaasBillingType[]
  /** Tipos de cobrança: RECURRENT para assinatura */
  chargeTypes: AsaasChargeType[]
  /** Tempo em minutos para o checkout expirar */
  minutesToExpire?: number
  /** Identificador externo no seu sistema (userId, profileId...) */
  externalReference?: string
  /** Callback após pagamento */
  callback?: AsaasCheckoutCallback
  /** Itens do checkout */
  items: AsaasCheckoutItem[]
  /** Dados do cliente pré-preenchidos */
  customer?: string
  /** Detalhes da assinatura — obrigatório se chargeTypes inclui RECURRENT */
  subscription?: AsaasCheckoutSubscription
}

export interface AsaasCheckoutResponse {
  id: string
  status: string
  externalReference?: string
}

// ----------------------------
// Webhook Payload
// ----------------------------

/**
 * Todos os eventos suportados pelo Asaas Webhook.
 * Ref: https://docs.asaas.com/docs/eventos-de-webhooks
 */
export type AsaasWebhookEvent =
  // Cobranças (payment)
  | 'PAYMENT_CREATED'
  | 'PAYMENT_UPDATED'
  | 'PAYMENT_CONFIRMED'
  | 'PAYMENT_RECEIVED'
  | 'PAYMENT_OVERDUE'
  | 'PAYMENT_DELETED'
  | 'PAYMENT_RESTORED'
  | 'PAYMENT_REFUNDED'
  | 'PAYMENT_RECEIVED_IN_CASH_UNDONE'
  | 'PAYMENT_CHARGEBACK_REQUESTED'
  | 'PAYMENT_CHARGEBACK_DISPUTE'
  | 'PAYMENT_AWAITING_CHARGEBACK_REVERSAL'
  | 'PAYMENT_DUNNING_RECEIVED'
  | 'PAYMENT_DUNNING_REQUESTED'
  | 'PAYMENT_BANK_SLIP_VIEWED'
  | 'PAYMENT_CHECKOUT_VIEWED'
  // Assinaturas (subscription)
  | 'SUBSCRIPTION_CREATED'
  | 'SUBSCRIPTION_UPDATED'
  | 'SUBSCRIPTION_INACTIVATED'
  | 'SUBSCRIPTION_ACTIVATED'
  | 'SUBSCRIPTION_DELETED'
  | 'SUBSCRIPTION_PAYMENT_CREATED'
  | 'SUBSCRIPTION_PAYMENT_CONFIRMED'
  | 'SUBSCRIPTION_PAYMENT_RECEIVED'
  | 'SUBSCRIPTION_PAYMENT_OVERDUE'
  | 'SUBSCRIPTION_PAYMENT_DELETED'
  | 'SUBSCRIPTION_PAYMENT_REFUNDED'

export type AsaasPaymentStatus =
  | 'PENDING'
  | 'RECEIVED'
  | 'CONFIRMED'
  | 'OVERDUE'
  | 'REFUNDED'
  | 'RECEIVED_IN_CASH'
  | 'REFUND_REQUESTED'
  | 'CHARGEBACK_REQUESTED'
  | 'CHARGEBACK_DISPUTE'
  | 'AWAITING_CHARGEBACK_REVERSAL'
  | 'DUNNING_REQUESTED'
  | 'DUNNING_RECEIVED'
  | 'AWAITING_RISK_ANALYSIS'

/**
 * Objeto de cobrança (payment) presente em eventos PAYMENT_*
 * Ref: https://docs.asaas.com/reference/recuperar-uma-unica-cobranca
 */
export interface AsaasWebhookPayment {
  object: 'payment'
  id: string
  /** ID do cliente Asaas (cus_...) */
  customer: string
  /** ID da assinatura vinculada, se existir (sub_...) */
  subscription?: string
  /** ID do installment, se existir */
  installment?: string
  status: AsaasPaymentStatus
  /** Valor bruto cobrado */
  value: number
  /** Valor líquido após taxas */
  netValue: number
  billingType: AsaasBillingType
  /** userId do seu sistema — gravado no checkout como externalReference */
  externalReference?: string
  dueDate?: string
  paymentDate?: string | null
  clientPaymentDate?: string | null
  confirmedDate?: string | null
  description?: string
  invoiceUrl?: string
  bankSlipUrl?: string | null
  invoiceNumber?: string
  deleted: boolean
  anticipated: boolean
  anticipable: boolean
  creditDate?: string | null
  estimatedCreditDate?: string | null
  transactionReceiptUrl?: string | null
  nossoNumero?: string | null
  originalValue?: number | null
  interestValue?: number | null
  originalDueDate?: string
  split?: unknown[]
  chargeback?: {
    status: string
    reason: string
  } | null
  refunds?: unknown[] | null
}

/**
 * Objeto de assinatura (subscription) presente em eventos SUBSCRIPTION_*
 * Ref: https://docs.asaas.com/reference/recuperar-uma-unica-assinatura
 */
export interface AsaasWebhookSubscription {
  object: 'subscription'
  id: string
  /** ID do cliente Asaas (cus_...) */
  customer: string
  billingType: AsaasBillingType
  cycle: AsaasSubscriptionCycle
  value: number
  nextDueDate: string
  status: 'ACTIVE' | 'INACTIVE'
  description?: string
  externalReference?: string
  deleted: boolean
  paymentLink?: string | null
  endDate?: string | null
  maxPayments?: number | null
  fine?: { value: number; type: string } | null
  interest?: { value: number; type: string } | null
  split?: unknown[]
}

/**
 * Payload genérico do webhook Asaas.
 * - Eventos PAYMENT_* → contém `payment`
 * - Eventos SUBSCRIPTION_* (sem PAYMENT) → contém `subscription`
 */
export interface AsaasWebhookPayload {
  event: AsaasWebhookEvent
  payment?: AsaasWebhookPayment
  subscription?: AsaasWebhookSubscription
}

// ----------------------------
// Campos no Firestore (users / profiles)
// ----------------------------

export type AsaasSubscriptionStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'EXPIRED'
  | 'INACTIVE'

export interface AsaasUserFields {
  asaasCustomerId?: string          // "cus_000005123456"
  asaasSubscriptionId?: string      // "sub_..."
  asaasSubscriptionStatus?: AsaasSubscriptionStatus
  planExpiresAt?: number | null     // timestamp em ms (null = free permanente)
}

