import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'

import { authOptions } from '@/lib/auth'
import ClaimButton from './_components/claim-button'

interface PageParams {
  slug?: string
}

interface PageSearchParams {
  businessId?: string
  slug?: string
}

interface ReivindicarEmpresaPageProps {
  params: Promise<PageParams>
  searchParams: Promise<PageSearchParams>
}

export default async function ReivindicarEmpresaPage({
  params,
  searchParams,
}: ReivindicarEmpresaPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return redirect('/')
  }

  const companySlugFromParams = (await params).slug
  const businessId = (await searchParams).businessId
  const companySlugFromSearch = (await searchParams).slug

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center font-bold text-3xl text-gray-800">
          Reivindicar esta Empresa
        </h1>

        <div className="space-y-4">
          <div className="rounded-md bg-gray-100 p-4">
            <p className="font-medium text-gray-500 text-sm">Slug:</p>
            <p className="font-semibold text-gray-900 text-lg">
              {companySlugFromSearch || 'Nome não encontrado'}
            </p>
          </div>

          <div className="rounded-md bg-gray-100 p-4">
            <p className="font-medium text-gray-500 text-sm">ID:</p>
            <p className="font-semibold text-gray-900 text-lg">
              {businessId || 'ID não encontrado'}
            </p>
          </div>

          {companySlugFromParams !== undefined && (
            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
              <p className="font-medium text-sm text-yellow-600">
                Parâmetro de Rota 'slug' (params.slug):
              </p>
              <p className="font-semibold text-lg text-yellow-800">
                {companySlugFromParams === ''
                  ? '(vazio)'
                  : companySlugFromParams}
              </p>
              <p className="mt-1 text-xs text-yellow-700">
                (Isto provavelmente está 'undefined' pois o arquivo não parece
                estar em uma pasta [slug])
              </p>
            </div>
          )}
        </div>

        <ClaimButton
          businessId={businessId}
          companySlug={companySlugFromSearch}
          userId={session?.user.id}
        />
        <p className="p-4 text-muted-foreground text-xs">
          <strong>Importante: </strong> Após clicar em "
          <strong>Confirmar Reivindicação</strong>", aguarde. Assim que abrir a
          janela de conversa no instagram, você cola a mensagem gerada neste
          processo.
        </p>
      </div>
    </div>
  )
}
