import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import CreatePage from '@/app/criar/page'
import { getUsersAdminsProfile } from '@/app/server/get-users-admins-profile'
import { verifyAdmin } from '@/app/server/verify-admin.server'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { getPlanStatus } from '@/utils/get-plan-status'
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

  // Busca dados frescos do Firestore para exibir o plano ativo correto sem depender do relog
  const userDoc = await db.collection('users').doc(userId).get()
  const userData = userDoc.exists ? userDoc.data() : null

  // Buscar status do plano (focando em perfis/business)
  const planActive =
    userData?.planActive?.profiles ??
    userData?.planActive ??
    (user as any).planActive ??
    null

  const planStatus = getPlanStatus({
    ...user,
    planActive,
  } as any)

  const profiles = await getUsersAdminsProfile(userId)

  if (isAdmin || user.hasProfileLink) {
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
