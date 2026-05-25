import { getPaginatedProfiles } from '@/actions/business/get-paginated-profiles'
import { getPaginatedProperties } from '@/actions/properties/get-paginated-properties'
import { ExplorerClient } from './_components/explorer-client'

export const metadata = {
  title: 'Explorar Carangola | Empresas, Serviços e Imóveis',
  description:
    'Descubra o melhor de Carangola/MG. Navegue por categorias de empresas, serviços e encontre o imóvel ideal com busca inteligente e rolagem infinita.',
}

export default async function ExplorarPage() {
  // Busca inicial para hidratar a página
  const initialProfiles = await getPaginatedProfiles(null, null, 12)
  const initialProperties = await getPaginatedProperties(null, null, 12)

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <ExplorerClient
        initialProfiles={initialProfiles}
        initialProperties={initialProperties}
      />
    </main>
  )
}
