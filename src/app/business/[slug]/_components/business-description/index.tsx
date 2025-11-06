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
  const profileId = profileData?.id || ''

  return (
    <div className="mt-6 flex w-full flex-col items-center gap-1 rounded-b-xl px-4 pt-6 pb-16">
      <div className="relative flex">
        <h2 className="flex items-center gap-2 text-center font-bold text-xl">
          <InfoCircle className="size-6" /> Descrição
        </h2>
        {(isOwner || isUserAuth) && (
          <div className="-top-5 absolute right-0 h-6 rounded-full ">
            <EditBusinessDescription
              data={{ businessDescription, profileId }}
            />
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
