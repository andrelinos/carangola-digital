// /app/admin/dashboard/page.tsx

import { getAllProfiles } from '@/actions/get-all-profiles.action'
import { verifyAdmin } from '@/app/server/verify-admin.server'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ProfilesTable } from './_components/profiles-table'

// Esta é a página principal do seu dashboard de admin
export default async function AdminDashboardPage() {
  const session = await auth()

  const checkIsAdmin = await verifyAdmin()

  if (!checkIsAdmin) {
    redirect('/')
  }

  const profiles = await getAllProfiles()
  console.log('profiles :: ', profiles)

  return (
    <div className="container mx-auto p-8">
      <header className="mb-8">
        <h1 className="font-bold text-3xl">Gerenciamento de Perfis</h1>
        <p className="text-muted-foreground">
          Adicione, edite, apague e transfira perfis de usuários.
        </p>
      </header>

      <main>
        {/* O componente da tabela será um Client Component para interatividade */}
        <ProfilesTable
          profiles={JSON.parse(JSON.stringify(profiles))}
          session={session}
        />
      </main>
    </div>
  )
}
