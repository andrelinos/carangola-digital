import { EditBusinessDescription } from './edit-business-description'

import type { ProfileDataProps } from '@/_types/profile-data'

interface Props {
  profileData: ProfileDataProps
  isOwner?: boolean
}

export function Description({ profileData, isOwner }: Props) {
  const businessDescription = profileData?.businessDescription || ''

  return (
    <div className="mt-6 flex w-full flex-col items-center gap-1 bg-orange-50 p-4">
      <div className="flex w-full justify-center gap-1 text-center">
        <h2 className="text-center font-bold text-xl">Descrição</h2>
        {isOwner && <EditBusinessDescription data={businessDescription} />}
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
