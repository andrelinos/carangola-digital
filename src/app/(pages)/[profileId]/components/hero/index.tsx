import Image from 'next/image'

import type { ProfileDataProps } from '@/_types/profile-data'
import { TotalVisits } from '@/components/commons/total-visits'
import { getDownloadURLFromPath } from '@/lib/firebase'

interface Props {
  profileData: ProfileDataProps
  isOwner?: boolean
}

export async function HeroBusiness({ profileData, isOwner }: Props) {
  return (
    <div className="relative size-full max-h-[384px] overflow-y-hidden ">
      <div className="mx-auto flex size-full max-h-[384px] max-w-[1080px] justify-center overflow-hidden">
        <Image
          width={1080}
          height={384}
          src={
            (await getDownloadURLFromPath(profileData?.imagePath)) ||
            '/default-image.png'
          }
          alt={profileData?.name || ''}
          className="z-10 size-full object-cover object-left-top"
          priority
        />
      </div>
      <Image
        id="background-image"
        loading="eager"
        src={
          (await getDownloadURLFromPath(profileData?.imagePath)) ||
          '/default-image.png'
        }
        className="absolute z-0 size-full object-cover object-left-top blur-lg"
        alt={profileData?.name || ''}
        quality={10}
        fill
        unoptimized
        priority
      />
      <div className="absolute right-4 bottom-4 z-20 mx-auto w-min">
        {isOwner && <TotalVisits totalVisits={profileData.totalVisits} />}
      </div>
    </div>
  )
}
