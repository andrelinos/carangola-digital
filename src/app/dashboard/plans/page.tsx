import { getPlans } from '@/app/server/get-plans'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { ManagePlans } from './components/manage-plans'

export default async function Plans() {
  const session = await getServerSession(authOptions)
  const user = session?.user

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
