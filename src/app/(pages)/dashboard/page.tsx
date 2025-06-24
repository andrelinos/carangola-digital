import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const session = await auth()

  if (!session || session.user.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="flex">
      <h1>dashboard</h1>
    </div>
  )
}
