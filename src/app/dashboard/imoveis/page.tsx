import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { getUserProperties } from '@/actions/properties/get-all-properties-from-user'
import { PropertyComponentAdmin } from '@/app/imoveis/_components/manage-properties'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { getPlanStatus } from '@/utils/get-plan-status'
import { SubscriptionStatus } from '../business/_components/subscription-status'

export default async function PropertiesPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user) {
    redirect('/acesso')
  }

  const userId = user.id

  // Busca dados frescos do Firestore para exibir o plano ativo correto sem depender do relog
  const userDoc = await db.collection('users').doc(userId).get()
  const userData = userDoc.exists ? userDoc.data() : null

  const planActive =
    userData?.planActive?.profiles ??
    userData?.planActive ??
    (user as any).planActive ??
    null

  const planStatus = getPlanStatus({
    ...user,
    planActive,
  } as any)

  const allPropertiesFromUser = await getUserProperties(userId)

  return (
    <div className="flex flex-col gap-6">
      <SubscriptionStatus
        planType={planStatus.planType}
        status={planStatus.status}
        expiresIn={planStatus.expiresIn}
      />
      <PropertyComponentAdmin data={allPropertiesFromUser} />
    </div>
  )
}
