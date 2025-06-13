import { auth } from '@/lib/auth'

import type { ProfileDataProps } from '@/_types/profile-data'

import { LogoHeader } from '../logo-header'
import { Menus } from './menus'

interface Props {
  profileData?: ProfileDataProps
  isOwner?: boolean
}

export async function HeaderProfile({ profileData, isOwner }: Props) {
  const session = await auth()

  const hasProfileLink = session?.user?.hasProfileLink || false

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between p-4">
      <div className="flex w-full justify-between">
        <LogoHeader />
        <Menus
          hasProfileLink={hasProfileLink}
          session={session}
          isOwner={isOwner}
        />
      </div>
    </div>
  )
}
