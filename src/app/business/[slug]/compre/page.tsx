import { PricingPlans } from '@/components/commons/plan-section'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth/next'

interface Props {
  params: Promise<{
    profileId: string
  }>
}
export default async function Compre({ params }: Props) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  const { profileId } = await params

  return (
    <div className="flex h-screen items-center justify-center">
      <PricingPlans />
      {/* <PurchaseButtons profileId={profileId} user={user} /> */}
    </div>
  )
}
