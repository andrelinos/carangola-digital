import type { ProfileDataProps } from '@/_types/profile-data'
import Image from 'next/image'
import { FooterByDevNameTitle } from '../footer-by-dev-name-title'
import { SafeImage } from '@/components/ui/safe-image'



import { Link } from '@/components/ui/link'
import { SOCIAL_MEDIA_CONFIG } from '@/components/social-icons'

interface Props {
  profileData?: ProfileDataProps
  isOwner?: boolean
}



export function FooterProfile({ profileData, isOwner }: Props) {
  return (
    <div className="flex w-full flex-col items-center bg-zinc-700 text-white">
      <div className="flex w-full max-w-screen-xl px-4 py-10">
        <div className="size-24 relative max-h-24 max-w-24 overflow-hidden rounded-lg">
          {/* {profileData?.imagePath && (
            <Image
              width={80}
              height={80}
              className="size-full rounded-lg object-cover object-center"
              src={profileData?.imagePath}
              alt={profileData?.name || ''}
            />
          )} */}
             <SafeImage
                          src={profileData?.logoImageUrl || '/default-image.png'}
                          alt={`Banner de ${profileData?.name}`}
                          className="rounded-lg border-1 border-white object-cover shadow-md"
                          fill
                        />
        </div>
        <div className='flex gap-4 justify-center flex-1 items-center px-4'>
           {SOCIAL_MEDIA_CONFIG?.map(({ key, Icon }) => {
          const url = profileData?.socialMedias?.[key]
          const type = url?.includes('@') ? 'email' : ''

          return url ? (
            <Link
              key={key}
              type={type as any}
              href={url}
              variant="outline"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
            >
              <Icon />
              <span className="-top-7 -translate-x-1/2 absolute left-1/2 z-10 hidden w-fit transform text-nowrap rounded-md bg-zinc-500 px-2 py-1 text-white text-xs shadow-lg group-hover:flex">
                {key?.toUpperCase()}
              </span>
            </Link>
          ) : null
        })}
        </div>

      </div>
      <FooterByDevNameTitle />
    </div>
  )
}
