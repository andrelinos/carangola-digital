import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { getAllProfiles } from '@/actions/business/get-all-profiles.action'

import CreatePage from '@/app/criar/page'
import { getUsersAdminsProfile } from '@/app/server/get-users-admins-profile'
import { verifyAdmin } from '@/app/server/verify-admin.server'
import { authOptions } from '@/lib/auth'
import { getPlanStatus } from '@/utils/get-plan-status'
import { AllProfilesTable } from '../_components/all-profiles-table'
import { FormManage } from '../gerenciadores/_components/form-manage'
import { SubscriptionStatus } from './_components/subscription-status'

export default async function ProfilesPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user) {
    redirect('/acesso')
  }

  const userId = session?.user.id
  const isAdmin = await verifyAdmin()

  // Buscar status do plano (focando em perfis/business)
  const planActive =
    (user as any).planActive?.profiles || (user as any).planActive
  const planStatus = getPlanStatus({
    ...user,
    planActive,
  } as any)

  if (isAdmin) {
    const profiles = await getAllProfiles()
    const profilesAdmins = await getUsersAdminsProfile(userId)

    return (
      <div className="flex flex-col gap-6">
        <SubscriptionStatus
          planType={planStatus.planType}
          status={planStatus.status}
          expiresIn={planStatus.expiresIn}
        />
        <AllProfilesTable
          profiles={JSON.parse(JSON.stringify(profiles))}
          session={session}
          isAdmin={isAdmin}
        />
        <FormManage
          session={session}
          profiles={(profilesAdmins as any) || []}
        />
      </div>
    )
  }

  const profiles = await getUsersAdminsProfile(userId)

  if (user.hasProfileLink) {
    return (
      <div className="flex flex-col gap-6">
        <SubscriptionStatus
          planType={planStatus.planType}
          status={planStatus.status}
          expiresIn={planStatus.expiresIn}
        />
        <FormManage session={session} profiles={(profiles as any) || []} />
      </div>
    )
  }

  return <CreatePage />
}
