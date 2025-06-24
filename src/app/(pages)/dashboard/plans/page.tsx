import { getPlans } from '@/app/server/get-plans'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ManagePlans } from './components/manage-plans'

export default async function Plans() {
  const session = await auth()

  if (!session || session.user.role !== 'admin') {
    redirect('/')
  }

  const plans = await getPlans()

  return (
    <div className="mb-auto flex size-full">
      <ManagePlans plans={plans} />
    </div>
  )
}
