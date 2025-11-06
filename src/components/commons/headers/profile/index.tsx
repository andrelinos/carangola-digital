import { getServerSession } from 'next-auth/next'

import type { ProfileDataProps } from '@/_types/profile-data'
import { authOptions } from '@/lib/auth'
import { HeaderPageContainer } from '..'
import { LogoHeader } from '../logo-header'
import { Menus } from './menus'

interface Props {
  profileData?: ProfileDataProps
  isOwner?: boolean
  isUserAuth?: boolean
}

export async function HeaderProfile({
  profileData,
  isOwner,
  isUserAuth,
}: Props) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  const hasProfileLink = session?.user?.hasProfileLink || false

  return (
    <HeaderPageContainer>
      <div className="flex w-full justify-between">
        <LogoHeader />
        <Menus
          hasProfileLink={hasProfileLink}
          session={session}
          isOwner={isOwner}
          isUserAuth={isUserAuth}
        />
      </div>
    </HeaderPageContainer>
  )
}
