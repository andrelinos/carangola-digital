import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { getAllProperties } from '@/actions/properties/get-all-properties.action'
import { verifyAdmin } from '@/app/server/verify-admin.server'
import { authOptions } from '@/lib/auth'
import { AllPropertiesAdminTable } from '../_components/all-properties-admin-table'

export default async function TodosImoveisPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user) {
    redirect('/acesso')
  }

  const isAdmin = await verifyAdmin()
  if (!isAdmin) {
    redirect('/dashboard')
  }

  const result = await getAllProperties()
  const properties = Array.isArray(result) ? result : []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-2xl tracking-tight">Todos os Imóveis</h1>
        <p className="text-muted-foreground">
          Gerencie todos os imóveis da plataforma.
        </p>
      </div>
      <AllPropertiesAdminTable
        properties={JSON.parse(JSON.stringify(properties))}
        session={session}
        isAdmin={isAdmin}
      />
    </div>
  )
}
