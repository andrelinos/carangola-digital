import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'

import type { ProfileDataProps } from '@/_types/profile-data'
import { LogoHeader } from '../logo-header'
import { Menus } from './menus'

interface Props {
  profileData?: ProfileDataProps
}

export async function HeaderHome({ profileData }: Props) {
  const session = await auth()

  const hasProfileLink = session?.user?.hasProfileLink || false

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between p-6">
      <div className="flex w-full items-center justify-between">
        <LogoHeader />
        <Menus hasProfileLink={hasProfileLink} session={session} />
      </div>
      {session && !hasProfileLink && (
        <div className="fixed inset-x-0 bottom-0 z-10 flex w-full items-center justify-center bg-white p-4">
          <Button className="w-full max-w-xs bg-orange-500 px-6 md:hidden">
            ANUNCIAR
          </Button>
        </div>
      )}
    </div>
  )
}
