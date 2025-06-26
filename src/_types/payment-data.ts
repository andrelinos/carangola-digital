// types/mercadopago.ts

export interface PaymentDataProps {
  accounts_info: any | null
  acquirer_reconciliation: any[]
  additional_info: AdditionalInfo
  authorization_code: string | null
  binary_mode: boolean
  brand_id: string | null
  build_version: string
  call_for_authorize_id: string | null
  captured: boolean
  card: Record<string, unknown>
  charges_details: ChargeDetail[]
  charges_execution_info: ChargesExecutionInfo
  collector_id: number
  corporation_id: number | null
  counter_currency: string | null
  coupon_amount: number
  currency_id: string
  date_approved: string
  date_created: string
  date_last_updated: string
  date_of_expiration: string | null
  deduction_schema: any | null
  description: string
  differential_pricing_id: number | null
  external_reference: string
  fee_details: FeeDetail[]
  financing_group: any | null
  id: number
  installments: number
  integrator_id: string | null
  issuer_id: string
  live_mode: boolean
  marketplace_owner: any | null
  merchant_account_id: any | null
  merchant_number: any | null
  metadata: Metadata
  money_release_date: string
  money_release_schema: any | null
  money_release_status: string
  notification_url: string | null
  operation_type: string
  order: Order
  payer: Payer
  payment_method: PaymentMethod
  payment_method_id: string
  payment_type_id: string
  platform_id: any | null
  point_of_interaction: PointOfInteraction
  pos_id: any | null
  processing_mode: string
  refunds: any[]
  release_info: any | null
  shipping_amount: number
  sponsor_id: any | null
  statement_descriptor: any | null
  status: string
  status_detail: string
  store_id: any | null
  tags: any | null
  taxes_amount: number
  transaction_amount: number
  transaction_amount_refunded: number
  transaction_details: TransactionDetails
  api_response: ApiResponse
}

export interface AdditionalInfo {
  ip_address: string
  items: any[]
  tracking_id: string
}

export interface ChargeDetail {
  accounts: any
  amounts: any
  client_id: number
  date_created: string
  id: string
  last_updated: string
  metadata: any
  name: string
  refund_charges: any[]
  reserve_id: any | null
  type: string
}

export interface ChargesExecutionInfo {
  internal_execution: {
    date: string
    execution_id: string
  }
}

export interface FeeDetail {
  amount: number
  fee_payer: string
  type: string
}

export interface PlanProps {
  id: string
  type: string
  name: string
  price: number
  period: string
}
export interface Metadata {
  profile_id: string
  user_email: string
  user_id: string
  plan: PlanProps
  // plan_type: string
  // plan_id: string
  // plan_price: number
  // plan_period: string
  // plan_name: string
}

export interface Order {
  id: string
  type: string
}

export interface Payer {
  email: string
  entity_type: string | null
  first_name: string | null
  id: string
  identification: {
    number: string
    type: string
  }
  last_name: string | null
  operator_id: string | null
  phone: {
    number: string | null
    extension: string | null
    area_code: string | null
  }
  type: string | null
}

export interface PaymentMethod {
  id: string
  issuer_id: string
  type: string
}

export interface PointOfInteraction {
  application_data: {
    name: string
    operating_system: string | null
    version: string
  }
  business_info: {
    branch: string
    sub_unit: string
    unit: string
  }
  transaction_data: {
    e2e_id: string | null
  }
  type: string
}

export interface TransactionDetails {
  acquirer_reference: string | null
  external_resource_url: string | null
  financial_institution: string | null
  installment_amount: number
  net_received_amount: number
  overpaid_amount: number
  payable_deferral_period: string | null
  payment_method_reference_id: string | null
  total_paid_amount: number
}

export interface ApiResponse {
  status: number
  headers: Record<string, string[]>
}
export interface ApiResponseError {
  status: number
  message: string
  error: string
  cause?: string
  details?: Record<string, any>
}
