import { Network } from 'iconoir-react'
import type { ProfileDataProps, SocialMediasProps } from '@/_types/profile-data'
import { Link } from '@/components/ui/link'
import { SOCIAL_MEDIA_CONFIG } from '@/components/social-icons'
import { EditBusinessSocialMedias } from './edit-business-social-medias'
import { ProfileSection } from '../profile-section'

interface Props {
  profileData: ProfileDataProps
  isOwner?: boolean
  isUserAuth?: boolean
}

export function SocialMedia({ profileData, isOwner, isUserAuth }: Props) {
  const socialMedias = profileData?.socialMedias as SocialMediasProps | any
  const hasSocial = SOCIAL_MEDIA_CONFIG.some(({ key }) => socialMedias?.[key])

  return (
    <ProfileSection 
      title="Redes Sociais" 
      icon={<Network className="size-6" />}
      delay={0.5}
    >
      <div className="relative">
        {(isOwner || isUserAuth) && (
          <div className="absolute -top-12 right-0">
            <EditBusinessSocialMedias profileData={profileData} />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          {!hasSocial ? (
            <p className="text-muted-foreground text-sm italic">Nenhuma rede social cadastrada</p>
          ) : (
            SOCIAL_MEDIA_CONFIG.map(({ key, Icon }) => {
              const url = socialMedias?.[key]
              if (!url) return null

              return (
                <Link
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex size-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 transition-all hover:scale-110 hover:bg-primary hover:text-white dark:bg-slate-900/40 dark:hover:bg-primary"
                  title={key.toUpperCase()}
                >
                  <Icon className="size-6" />
                </Link>
              )
            })
          )}
        </div>
      </div>
    </ProfileSection>
  )
}
