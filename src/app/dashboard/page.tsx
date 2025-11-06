import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { DashboardComponent } from './_components/dashboard-component'

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user) {
    redirect('/')
  }

  return <DashboardComponent />
}
