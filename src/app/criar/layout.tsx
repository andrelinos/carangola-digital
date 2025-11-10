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

  if (!session) {
    redirect('/acesso')
  }

  const profileId = await getProfileId(session?.user?.id)

  if (profileId?.length) {
    redirect('/dashboard')
  }

  return <>{children}</>
}
