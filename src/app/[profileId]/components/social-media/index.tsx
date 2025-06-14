'use client'

import {
  CinemaOld,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
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
      <div className="mb-6 flex w-full justify-center gap-1 bg-zinc-100 p-6 text-center">
        <h2 className="text-center font-bold text-xl">Redes sociais</h2>
        {isOwner && <EditBusinessSocialMedias profileData={profileData} />}
      </div>
      <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center gap-4">
        {!socialMedias && <p>Nenhuma rede social cadastrada</p>}
      </div>

      <div className="mx-auto flex w-full max-w-lg flex-wrap justify-center gap-2">
        {SOCIAL_MEDIA_CONFIG?.map(({ key, Icon }) => {
          const url = socialMedias?.[key]
          return url ? (
            <Link key={key} href={url} variant="secondary" target="_blank">
              <Icon />
            </Link>
          ) : null
        })}
      </div>
    </div>
  )
}
