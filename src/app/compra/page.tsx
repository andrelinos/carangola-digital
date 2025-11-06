import CompraClient from './client-page'

export default async function CompraPage({
  searchParams,
}: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams
  return <CompraClient status={status} />
}

// https://carangoladigital.com.br/compra?status=sucesso&collection_id=115339323410&collection_status=approved&payment_id=115339323410&status=approved&external_reference=123&payment_type=account_money&merchant_order_id=31785956738&preference_id=2501694910-b401bbcc-f43b-4f33-ab30-c980278b9207&site_id=MLB&processing_mode=aggregator&merchant_account_id=null

// ?status=approved&collection_id=115339323410&collection_status=approved&payment_id=115339323410&external_reference=123&payment_type=account_money&merchant_order_id=31785956738&preference_id=2501694910-b401bbcc-f43b-4f33-ab30-c980278b9207
