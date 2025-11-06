import type { ProfileDataProps } from '@/_types/profile-data'

import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth/next'
import { Suspense } from 'react'
import { HeaderPageContainer } from '..'
import { LogoHeader } from '../logo-header'
import { Menus } from './menus'

interface Props {
  profileData?: ProfileDataProps
  headerShow?: boolean
}

export async function HeaderHome({ profileData, headerShow = true }: Props) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  const hasProfileLink = session?.user?.hasProfileLink || false

  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <HeaderPageContainer>
        {headerShow && (
          <div className="flex w-full items-center justify-between">
            <LogoHeader />
            <Menus hasProfileLink={hasProfileLink} session={session} />
          </div>
        )}
      </HeaderPageContainer>
    </Suspense>
  )
}
