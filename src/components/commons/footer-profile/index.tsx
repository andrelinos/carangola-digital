import type { ProfileDataProps } from '@/_types/profile-data'
import Image from 'next/image'
import { FooterByDevNameTitle } from '../footer-by-dev-name-title'

interface Props {
  profileData?: ProfileDataProps
  isOwner?: boolean
}

export function FooterProfile({ profileData, isOwner }: Props) {
  return (
    <div className="flex w-full flex-col items-center bg-zinc-700 text-white">
      <div className="flex w-full max-w-screen-xl px-4 py-10">
        <div className="size-full max-h-24 max-w-24 overflow-hidden rounded-lg">
          {profileData?.imagePath && (
            <Image
              width={80}
              height={80}
              className="size-full rounded-lg object-cover object-center"
              src={profileData?.imagePath}
              alt={profileData?.name || ''}
            />
          )}
        </div>
        <div className="flex flex-1 justify-end px-4 text-white">{/*  */}</div>
      </div>
      <FooterByDevNameTitle />
    </div>
  )
}
