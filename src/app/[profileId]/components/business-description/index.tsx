import { EditBusinessDescription } from './edit-business-description'

import type { ProfileDataProps } from '@/_types/profile-data'
import { InfoCircle } from 'iconoir-react'

interface Props {
  profileData: ProfileDataProps
  isOwner?: boolean
  isUserAuth?: boolean
}

export function Description({ profileData, isOwner, isUserAuth }: Props) {
  const businessDescription = profileData?.businessDescription || ''

  return (
    <div className="mt-6 flex w-full flex-col items-center gap-1 px-4 pt-6 pb-12 shadow-lg">
      <div className="relative flex">
        <h2 className="flex items-center gap-2 text-center font-bold text-xl">
          <InfoCircle className="size-6" /> Descrição
        </h2>
        {(isOwner || isUserAuth) && (
          <div className="-top-5 absolute right-0 h-6 rounded-full bg-white/70">
            <EditBusinessDescription data={businessDescription} />
          </div>
        )}
      </div>
      <div className="mx-auto flex w-full max-w-[1080px] flex-col items-center gap-4">
        <p className="w-full">
          {profileData.businessDescription
            ? profileData.businessDescription
            : 'Nenhuma descrição cadastrada'}
        </p>
      </div>
    </div>
  )
}
