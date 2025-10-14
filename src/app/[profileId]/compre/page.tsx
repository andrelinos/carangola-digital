import { PricingPlans } from '@/components/commons/plan-section'
import { auth } from '@/lib/auth'
import { PurchaseButtons } from './components/purchase-buttons'

interface Props {
  params: Promise<{
    profileId: string
  }>
}
export default async function Compre({ params }: Props) {
  const session = await auth()

  const { profileId } = await params

  const user = session?.user

  return (
    <div className="flex h-screen items-center justify-center">
      <PricingPlans />
      {/* <PurchaseButtons profileId={profileId} user={user} /> */}
    </div>
  )
}
