import { auth } from '@/lib/auth'

import type { ProfileDataProps } from '@/_types/profile-data'

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
  const session = await auth()

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
