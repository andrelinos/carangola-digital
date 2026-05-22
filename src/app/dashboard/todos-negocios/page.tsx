import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { getAllProfiles } from '@/actions/business/get-all-profiles.action'

import { verifyAdmin } from '@/app/server/verify-admin.server'
import { authOptions } from '@/lib/auth'
import { AllProfilesTable } from '../_components/all-profiles-table'

export default async function TodosNegociosPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user) {
    redirect('/acesso')
  }

  const isAdmin = await verifyAdmin()
  if (!isAdmin) {
    redirect('/dashboard')
  }

  const profiles = await getAllProfiles()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className='font-bold text-2xl tracking-tight'>Todos os Negócios</h1>
        <p className="text-muted-foreground">
          Gerencie todos os perfis da plataforma.
        </p>
      </div>
      <AllProfilesTable
        profiles={JSON.parse(JSON.stringify(profiles))}
        session={session}
        isAdmin={isAdmin}
      />
    </div>
  )
}
