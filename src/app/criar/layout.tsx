import { redirect } from 'next/navigation'

import { getProfileId } from '@/app/server/get-profile-data'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth/next'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  const profileId = await getProfileId(session?.user?.id)

  if (!session?.user?.id) {
    redirect('/')
  }

  if (profileId?.length) {
    redirect('/dashboard')
  }

  return <>{children}</>
}
