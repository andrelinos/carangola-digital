/**
 * Asaas REST API client
 * Documentação oficial: https://docs.asaas.com/reference
 *
 * Autenticação: header `access_token` com a API Key
 * Sandbox: https://sandbox.asaas.com/api/v3
 * Produção:  https://api.asaas.com/v3
 */

import type {
  AsaasCheckoutResponse,
  AsaasCreateCheckoutBody,
} from '@/_types/asaas'

// Base URL de acordo com o ambiente configurado
const ASAAS_BASE_URL =
  process.env.NEXT_PUBLIC_ASAAS_ENV === 'production'
    ? 'https://api.asaas.com/v3'
    : 'https://sandbox.asaas.com/api/v3'

/**
 * Faz uma requisição autenticada para a API REST do Asaas.
 * Lança um Error se a resposta não for 2xx.
 */
export async function asaasFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const apiKey = process.env.ASAAS_API_KEY

  if (!apiKey) {
    throw new Error(
      '[Asaas] ASAAS_API_KEY não configurada. Adicione a variável de ambiente.'
    )
  }

  const response = await fetch(`${ASAAS_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      access_token: apiKey,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(
      `[Asaas] Erro ${response.status} em ${endpoint}: ${errorBody}`
    )
  }

  return response.json() as Promise<T>
}

// ============================================================
// Checkout
// ============================================================

/**
 * Cria um Checkout Asaas.
 * Para assinaturas recorrentes, inclua `chargeTypes: ['RECURRENT']`
 * e o campo `subscription` no body.
 *
 * Retorna a `url` do checkout para redirecionar o cliente.
 *
 * Ref: https://docs.asaas.com/docs/checkout-com-assinatura-recorrente
 */
export async function createAsaasCheckout(
  body: AsaasCreateCheckoutBody
): Promise<AsaasCheckoutResponse> {
  return asaasFetch<AsaasCheckoutResponse>('/checkouts', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

/**
 * Busca os detalhes de um checkout pelo ID.
 */
export async function getAsaasCheckout(
  checkoutId: string
): Promise<AsaasCheckoutResponse> {
  return asaasFetch<AsaasCheckoutResponse>(`/checkouts/${checkoutId}`)
}

// ============================================================
// Clientes (Customer)
// ============================================================

export interface AsaasCustomer {
  id: string
  name: string
  email: string
  cpfCnpj?: string
  phone?: string
  externalReference?: string
}

export interface AsaasCustomerListResponse {
  data: AsaasCustomer[]
  totalCount: number
}

/**
 * Busca clientes pelo email (usado para evitar duplicatas).
 */
export async function findAsaasCustomerByEmail(
  email: string
): Promise<AsaasCustomer | null> {
  const result = await asaasFetch<AsaasCustomerListResponse>(
    `/customers?email=${encodeURIComponent(email)}&limit=1`
  )
  return result.data?.[0] ?? null
}

/**
 * Cria um novo cliente no Asaas.
 * Agora aceitando os dados de endereço essenciais para o Checkout.
 */
export async function createAsaasCustomer(data: {
  name: string
  email: string
  externalReference?: string
  postalCode?: string
  address?: string
  addressNumber?: string
  province?: string
  city?: string
}): Promise<AsaasCustomer> {
  return asaasFetch<AsaasCustomer>('/customers', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Atualiza um cliente existente no Asaas.
 * Crucial para adicionar endereço em clientes antigos (testes) antes do checkout.
 */
export async function updateAsaasCustomer(
  customerId: string,
  data: {
    postalCode: string
    address: string
    addressNumber: string
    province: string
    city: string
  }
): Promise<AsaasCustomer> {
  return asaasFetch<AsaasCustomer>(`/customers/${customerId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * Cria ou reutiliza um cliente Asaas pelo email.
 * Garante que não criamos duplicatas.
 */
export async function createOrFetchAsaasCustomer(data: {
  name: string
  email: string
  externalReference?: string
  postalCode: string
  address: string
  addressNumber: string
  province: string
  city: string
}): Promise<AsaasCustomer> {
  const existing = await findAsaasCustomerByEmail(data.email)

  // Se o cliente já existe, nós o retornamos (a atualização do endereço será feita na route.ts)
  if (existing) return existing

  // Se não existe, criamos JÁ ENVIANDO o endereço
  return createAsaasCustomer(data)
}

// ============================================================
// Cobranças avulsas (Payment)
// ============================================================

export interface AsaasPayment {
  id: string
  customer: string
  billingType: string
  value: number
  dueDate: string
  status: string
  externalReference?: string
  description?: string
  invoiceUrl?: string
  bankSlipUrl?: string | null
}

/**
 * Cria uma cobrança avulsa (pagamento único) no Asaas.
 * Usada para proration/upgrade de plano.
 *
 * Ref: https://docs.asaas.com/reference/criar-nova-cobranca
 */
export async function createAsaasPayment(data: {
  customer: string
  billingType: 'CREDIT_CARD' | 'BOLETO' | 'PIX'
  value: number
  dueDate: string
  description?: string
  externalReference?: string
  /** URL de sucesso após pagamento (redirect automático) */
  callback?: {
    successUrl: string
    cancelUrl?: string
    autoRedirect?: boolean
  }
}): Promise<AsaasPayment> {
  return asaasFetch<AsaasPayment>('/payments', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// ============================================================
// Assinaturas (Subscription)
// ============================================================

export interface AsaasSubscription {
  id: string
  customer: string
  billingType: string
  cycle: string
  value: number
  nextDueDate: string
  status: string
  externalReference?: string
  description?: string
}

/**
 * Cria uma nova assinatura recorrente no Asaas.
 * Usada APÓS o upgrade ser confirmado via webhook para criar
 * a recorrência futura do novo plano.
 *
 * Ref: https://docs.asaas.com/reference/criar-nova-assinatura
 */
export async function createAsaasSubscription(data: {
  customer: string
  billingType: 'CREDIT_CARD' | 'BOLETO' | 'PIX'
  value: number
  nextDueDate: string
  cycle: 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUALLY' | 'YEARLY'
  description?: string
  externalReference?: string
}): Promise<AsaasSubscription> {
  return asaasFetch<AsaasSubscription>('/subscriptions', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Cancela/deleta uma assinatura existente no Asaas.
 * Deve ser chamado antes de criar a nova assinatura no upgrade.
 *
 * Ref: https://docs.asaas.com/reference/remover-assinatura
 */
export async function deleteAsaasSubscription(
  subscriptionId: string
): Promise<{ deleted: boolean; id: string }> {
  return asaasFetch<{ deleted: boolean; id: string }>(
    `/subscriptions/${subscriptionId}`,
    { method: 'DELETE' }
  )
}

/**
 * Busca uma assinatura pelo ID.
 */
export async function getAsaasSubscription(
  subscriptionId: string
): Promise<AsaasSubscription> {
  return asaasFetch<AsaasSubscription>(`/subscriptions/${subscriptionId}`)
}
