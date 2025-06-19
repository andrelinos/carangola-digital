import { auth } from '@/lib/auth'

import type { ProfileDataProps } from '@/_types/profile-data'

import { HeaderPageContainer } from '..'
import { LogoHeader } from '../logo-header'
import { Menus } from './menus'

interface Props {
  profileData?: ProfileDataProps
  headerShow?: boolean
}

export async function HeaderHome({ profileData, headerShow = true }: Props) {
  const session = await auth()

  const hasProfileLink = session?.user?.hasProfileLink || false

  return (
    <HeaderPageContainer>
      {headerShow && (
        <div className="flex w-full items-center justify-between">
          <LogoHeader />
          <Menus hasProfileLink={hasProfileLink} session={session} />
        </div>
      )}
    </HeaderPageContainer>
  )
}
