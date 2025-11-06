import { getAllProfiles } from '@/actions/business/get-all-profiles.action'
import { verifyAdmin } from '@/app/server/verify-admin.server'
import { authOptions } from '@/lib/auth'

import CreatePage from '@/app/criar/page'
import { getUsersAdminsProfile } from '@/app/server/get-users-admins-profile'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { AllProfilesTable } from '../_components/all-profiles-table'
import { FormManage } from '../gerenciadores/_components/form-manage'

export default async function ProfilesPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user) {
    redirect('/acesso')
  }

  const userId = session?.user.id

  const isAdmin = await verifyAdmin()

  if (isAdmin) {
    const profiles = await getAllProfiles()

    const profilesAdmins = await getUsersAdminsProfile(userId)
    return (
      <>
        <AllProfilesTable
          profiles={JSON.parse(JSON.stringify(profiles))}
          session={session}
          isAdmin={isAdmin}
        />
        <FormManage
          session={session}
          profiles={(profilesAdmins as any) || []}
        />
      </>
    )
  }

  const profiles = await getUsersAdminsProfile(userId)

  if (user.hasProfileLink) {
    return <FormManage session={session} profiles={(profiles as any) || []} />
  }

  return <CreatePage />
}
