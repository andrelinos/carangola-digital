import { redirect } from 'next/navigation'

import { getProfileId } from '@/app/server/get-profile-data'
import { auth } from '@/lib/auth'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  const profileId = await getProfileId(session?.user?.id)

  if (!session?.user?.id) {
    redirect('/')
  }

  if (profileId?.length) {
    redirect(`/${profileId}`)
  }

  return <>{children}</>
}
