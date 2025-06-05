import Image from 'next/image'

import type { ProfileDataProps } from '@/_types/profile-data'
import { TotalVisits } from '@/components/commons/total-visits'

interface Props {
  profileData: ProfileDataProps
  isOwner?: boolean
}

export async function HeroBusiness({ profileData, isOwner }: Props) {
  return (
    <div className="relative size-full max-h-[384px] overflow-y-hidden ">
      {/* <div className="mx-auto flex size-full max-h-[17vh] max-w-[1080px] justify-center overflow-hidden lg:max-h-[384px]"> */}
      <div className="flex size-full max-h-[342px] overflow-hidden bg-black">
        <Image
          width={1080}
          height={384}
          src={profileData?.imagePath || '/default-image.png'}
          alt={profileData?.name || ''}
          className="z-10 mx-auto max-h-[342px] w-auto shadow-2xl"
          priority
        />
      </div>
      <Image
        id="background-image"
        loading="eager"
        src={profileData?.imagePath || '/default-image.png'}
        className="absolute z-0 size-full object-cover object-center opacity-30 blur-md"
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
