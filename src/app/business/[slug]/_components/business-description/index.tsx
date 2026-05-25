import { InfoCircle } from 'iconoir-react'
import type { ProfileDataProps } from '@/_types/profile-data'
import { ProfileSection } from '../profile-section'
import { EditBusinessDescription } from './edit-business-description'

interface Props {
  profileData: ProfileDataProps
  isOwner?: boolean
  isUserAuth?: boolean
}

export function Description({ profileData, isOwner, isUserAuth }: Props) {
  const businessDescription = profileData?.businessDescription || ''
  const profileId = profileData?.id || ''

  return (
    <ProfileSection
      title="Sobre a Empresa"
      icon={<InfoCircle className="size-6" />}
      delay={0.1}
    >
      <div className="relative">
        {(isOwner || isUserAuth) && (
          <div className="absolute -top-12 right-0">
            <EditBusinessDescription
              data={{ businessDescription, profileId }}
            />
          </div>
        )}

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="font-medium text-muted-foreground/90 text-xl leading-relaxed">
            {profileData.businessDescription
              ? profileData.businessDescription
              : 'Esta empresa ainda não forneceu uma descrição detalhada sobre seus serviços e história.'}
          </p>
        </div>
      </div>
    </ProfileSection>
  )
}
