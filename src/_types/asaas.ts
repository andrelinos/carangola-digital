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

export type AsaasWebhookEvent =
  | 'PAYMENT_CREATED'
  | 'PAYMENT_RECEIVED'
  | 'PAYMENT_CONFIRMED'
  | 'PAYMENT_OVERDUE'
  | 'PAYMENT_DELETED'
  | 'PAYMENT_REFUNDED'
  | 'SUBSCRIPTION_CREATED'
  | 'SUBSCRIPTION_UPDATED'
  | 'SUBSCRIPTION_INACTIVATED'
  | 'SUBSCRIPTION_DELETED'

export type AsaasPaymentStatus =
  | 'PENDING'
  | 'RECEIVED'
  | 'CONFIRMED'
  | 'OVERDUE'
  | 'REFUNDED'
  | 'RECEIVED_IN_CASH'
  | 'REFUND_REQUESTED'
  | 'CHARGEBACK_REQUESTED'

export interface AsaasWebhookPayment {
  id: string
  customer: string
  subscription?: string          // ID da assinatura vinculada
  status: AsaasPaymentStatus
  value: number
  netValue: number
  billingType: AsaasBillingType
  externalReference?: string
  dueDate?: string
  paymentDate?: string
  description?: string
}

export interface AsaasWebhookPayload {
  event: AsaasWebhookEvent
  payment: AsaasWebhookPayment
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
  asaasSubscriptionId?: string      // sub_ ou ID do checkout
  asaasSubscriptionStatus?: AsaasSubscriptionStatus
  planExpiresAt?: number | null     // timestamp em ms (null = free permanente)
}
