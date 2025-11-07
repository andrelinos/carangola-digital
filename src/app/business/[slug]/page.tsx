import Link from 'next/link'

import { BusinessAddresses } from './_components/business-addresses'
import { ContactPhones } from './_components/business-contact-phones'
import { Description } from './_components/business-description'
import { BusinessHero } from './_components/business-hero'
import { ContainerOpeningHours } from './_components/business-opening-hours'
import { SocialMedia } from './_components/business-social-media'
import { LikeShareButtons } from './_components/like-share-buttons'

import { increaseBusinessVisits } from '@/actions/business/increase-business-visits'
import { getProfileData, getUsersData } from '@/app/server/get-profile-data'

import { FooterProfile } from '@/components/commons/footer-profile'
import { authOptions } from '@/lib/auth'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth/next'
import { ContentProfile } from './content'

interface Props {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const profileData = await getProfileData(slug)

  if (!profileData) {
    return {
      title: 'Perfil não encontrado | Carangola Digital',
      description:
        'O perfil que você está procurando não existe ou foi movido.',
    }
  }

  const businessName = profileData.name || 'Perfil'

  return {
    title: `${businessName} | Carangola Digital`,
    description:
      profileData.businessDescription ||
      'Carangola Digital é uma plataforma para divulgar negócios locais.',

    openGraph: {
      title: `${businessName} | Carangola Digital`,
      description: profileData.businessDescription,
      images: [profileData.logoImageUrl || profileData.coverImageUrl || ''],
    },
  }
}

export default async function BusinessId({ params }: Props) {
  const session = await getServerSession(authOptions)

  const { slug } = await params

  const profileData = await getProfileData(slug)

  const userData = await getUsersData(session?.user?.id || '')

  const isOwner = profileData?.userId === session?.user?.id
  const isUserAuth = !!(
    session?.user?.id &&
    profileData?.admins?.some(admin => admin.userId === session.user.id)
  )

  if (!profileData) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="font-bold text-2xl ">Perfil não encontrado</h1>
        <Link href="/business" className="text-accent-purple">
          Voltar para a página inicial
        </Link>
      </div>
    )
  }

  const isFavorite = userData?.favorites?.some(fav => fav === slug) || false

  if (!isOwner) {
    await increaseBusinessVisits({ profileId: profileData?.id })
  }

  return (
    <>
      <ContentProfile totalVisits={profileData?.totalVisits}>
        <BusinessHero
          profileData={profileData}
          isOwner={isOwner}
          isUserAuth={isUserAuth}
        />

        <div className="flex w-full flex-col items-center gap-8 pt-8">
          <ContainerOpeningHours
            profileData={profileData}
            isOwner={isOwner}
            isUserAuth={isUserAuth}
          />

          <ContactPhones
            profileData={profileData}
            isOwner={isOwner}
            isUserAuth={isUserAuth}
          />

          <BusinessAddresses
            profileData={profileData}
            isOwner={isOwner}
            isUserAuth={isUserAuth}
          />

          <Description
            profileData={profileData}
            isOwner={isOwner}
            isUserAuth={isUserAuth}
          />

          <SocialMedia
            profileData={profileData}
            isOwner={isOwner}
            isUserAuth={isUserAuth}
          />
          <LikeShareButtons
            profileData={profileData}
            userInfo={session?.user}
            isFavorite={isFavorite}
            isOwner={isOwner}
            isUserAuth={isUserAuth}
          />
        </div>
      </ContentProfile>

      <FooterProfile profileData={profileData} isOwner={isOwner} />
    </>
  )
}
