import CompraClient from './client-page'

export default async function CompraPage({
  searchParams,
}: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams
  return <CompraClient status={status} />
}
