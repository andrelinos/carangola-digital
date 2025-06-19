export async function handleMercadoPagoPayment(paymentData: PaymentResponse) {
  console.log('TETE :: ', 'tudo certo pagamento', paymentData)

  return true
}

// Retorno do Mercado Pago sucesso
// compra?
// status=sucesso
// collection_id=115158347167
// collection_status=approved
// payment_id=115158347167
// status=approved
// external_reference=123
// payment_type=account_money
// merchant_order_id=31842477622
// preference_id=2501694910-7c231f7a-8985-4716-9706-4932d746babe
// site_id=MLB
// processing_mode=aggregator
// merchant_account_id=null
