import Link from 'next/link'

import type { ProfileDataProps } from '@/_types/profile-data'
import type { UserProps } from '@/_types/user'

import { increaseBusinessVisits } from '@/actions/increase-business-visits'
import { getProfileData, getUsersData } from '@/app/server/get-profile-data'
import { auth } from '@/lib/auth'

import { FooterProfile } from '@/components/commons/footer-profile'
import { HeaderProfile } from '@/components/commons/headers'
import type { Metadata } from 'next'
import { BusinessAddresses } from './components/business-addresses'
import { ContactPhones } from './components/business-contact-phones'
import { Description } from './components/business-description'
import { EditBusinessInfo } from './components/edit-business-info'
import { HeroBusiness } from './components/hero'
import { LikeShareButtons } from './components/like-share-buttons'
import { ContainerOpeningHours } from './components/opening-hours'
import { SocialMedia } from './components/social-media'

interface Props {
  params: Promise<{
    profileId: string
  }>
}

export const metadata: Metadata = {
  title: 'Carangola Digital - Perfil',
  description:
    'Carangola Digital é uma plataforma para divulgar negócios locais.',
}

export default async function BusinessId({ params }: Props) {
  const session = await auth()

  const { profileId } = await params

  const profileData = (await getProfileData(
    profileId
  )) as ProfileDataProps | null

  const userData = (await getUsersData(session?.user?.id || '')) as UserProps

  const isOwner = profileData?.userId === session?.user?.id

  if (!profileData) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="font-bold text-2xl ">Perfil não encontrado</h1>
        <Link href="/" className="text-accent-purple">
          Voltar para a página inicial
        </Link>
      </div>
    )
  }

  const isFavorite =
    userData?.favorites?.some(fav => fav === profileId) || false

  if (!isOwner) {
    await increaseBusinessVisits(profileId)
  }

  return (
    <>
      <HeaderProfile profileData={profileData} isOwner={isOwner} />
      <div className="flex flex-col py-32 md:py-36 lg:py-44">
        <HeroBusiness profileData={profileData} isOwner={isOwner} />
        <div className="flex w-full flex-col items-center gap-4 pt-8">
          <div className="relative mx-auto flex w-full max-w-[1080px] flex-col justify-center gap-4 text-center lg:flex-row">
            <div className="relative flex flex-col items-center gap-1">
              <h2 className="px-6 font-bold text-3xl sm:text-4xl">
                {profileData?.name}
              </h2>
              <div className="flex text-base">
                <span className="font-medium">Categoria</span>:
                <span className="pl-2">{profileData.category || 'Geral'}</span>
              </div>

              {isOwner && (
                <div className="absolute top-0 right-0 z-10 size-6 rounded-full bg-white/70">
                  <EditBusinessInfo
                    profileData={profileData}
                    imagePath={profileData?.imagePath}
                  />
                </div>
              )}
            </div>

            <LikeShareButtons
              userInfo={session?.user}
              isFavorite={isFavorite}
              isOwner={isOwner}
            />
          </div>

          <ContainerOpeningHours profileData={profileData} isOwner={isOwner} />

          <ContactPhones profileData={profileData} isOwner={isOwner} />

          <BusinessAddresses profileData={profileData} isOwner={isOwner} />

          <Description profileData={profileData} isOwner={isOwner} />

          <SocialMedia profileData={profileData} isOwner={isOwner} />
        </div>
      </div>

      <FooterProfile profileData={profileData} isOwner={isOwner} />
    </>
  )
}
