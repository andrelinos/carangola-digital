'use client'

import {
  CinemaOld,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Network,
  Threads,
  Tiktok,
} from 'iconoir-react'

import type { ProfileDataProps, SocialMediasProps } from '@/_types/profile-data'

import { Link } from '@/components/ui/link'

import { EditBusinessSocialMedias } from './edit-business-social-medias'

interface Props {
  profileData: ProfileDataProps
  isOwner?: boolean
}

const SOCIAL_MEDIA_CONFIG = [
  { key: 'facebook', Icon: Facebook },
  { key: 'instagram', Icon: Instagram },
  { key: 'linkedin', Icon: Linkedin },
  { key: 'threads', Icon: Threads },
  { key: 'tiktok', Icon: Tiktok },
  { key: 'kwai', Icon: CinemaOld },
  { key: 'site', Icon: Globe },
]

export function SocialMedia({ profileData, isOwner }: Props) {
  const socialMedias = profileData?.socialMedias as SocialMediasProps | any

  return (
    <div className="mt-6 flex w-full flex-col items-center gap-1 px-4 pt-6 pb-12 shadow-lg">
      <div className="relative flex">
        <h2 className="flex items-center gap-2 text-center font-bold text-xl">
          <Network className="size-6" /> Redes sociais
        </h2>
        {isOwner && (
          <div className="-top-5 absolute right-0 h-6 rounded-full bg-white/70">
            <EditBusinessSocialMedias profileData={profileData} />
          </div>
        )}
      </div>
      <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center gap-4">
        {!socialMedias && (
          <div className="-top-5 absolute right-0 z-10 h-6 rounded-full bg-white/70">
            <p>Nenhuma rede social cadastrada</p>
          </div>
        )}
      </div>

      <div className="mx-auto flex w-full max-w-lg flex-wrap justify-center gap-2">
        {SOCIAL_MEDIA_CONFIG?.map(({ key, Icon }) => {
          const url = socialMedias?.[key]
          return url ? (
            <Link
              key={key}
              href={url}
              variant="outline"
              target="_blank"
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
  )
}
