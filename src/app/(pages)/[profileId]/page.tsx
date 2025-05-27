import Link from 'next/link'

import type { ProfileDataProps } from '@/_types/profile-data'
import type { UserProps } from '@/_types/user'

import { BusinessAddresses } from '@/app/(pages)/[profileId]/components/business-addresses'
import { ContactPhones } from '@/app/(pages)/[profileId]/components/business-contact-phones'
import { Description } from '@/app/(pages)/[profileId]/components/business-description'
import { LikeShareButtons } from '@/app/(pages)/[profileId]/components/like-share-buttons'
import { ContainerOpeningHours } from '@/app/(pages)/[profileId]/components/opening-hours'
import { SocialMedia } from '@/app/(pages)/[profileId]/components/social-media'

import { increaseBusinessVisits } from '@/actions/increase-business-visits'
import { getProfileData, getUsersData } from '@/app/server/get-profile-data'
import { Header } from '@/components/header'
import { auth } from '@/lib/auth'
import { getDownloadURLFromPath } from '@/lib/firebase'

import { EditBusinessInfo } from './components/edit-business-info'
import { HeroBusiness } from './components/hero'

interface Props {
  params: Promise<{
    profileId: string
  }>
}

export default async function BusinessId({ params }: Props) {
  const session = await auth()

  const { profileId } = await params

  const profileData = (await getProfileData(
    profileId
  )) as ProfileDataProps | null

  const userData = (await getUsersData(session?.user?.id || '')) as UserProps

  const isOwner = profileData?.userId === session?.user?.id
  const imagePath = await getDownloadURLFromPath(profileData?.imagePath)

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

  const isFavorite = userData?.favorites.some(fav => fav === profileId) || false

  if (!isOwner) {
    await increaseBusinessVisits(profileId)
  }

  return (
    <>
      <Header profileData={profileData} />
      <div className="flex flex-col py-32 md:py-36 lg:py-44">
        <HeroBusiness profileData={profileData} isOwner={isOwner} />
        <div className="flex w-full flex-col items-center gap-4 px-6 pt-8">
          <div className="relative mx-auto flex w-full max-w-[1080px] flex-col justify-center gap-1 text-center lg:flex-row">
            <div className="flex justify-center gap-1">
              <h2 className="font-bold text-4xl">{profileData?.name}</h2>

              {isOwner && (
                <EditBusinessInfo
                  profileData={profileData}
                  imagePath={imagePath}
                />
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

          <SocialMedia profileData={profileData} isOwner={isOwner} />

          <BusinessAddresses profileData={profileData} isOwner={isOwner} />

          <Description profileData={profileData} isOwner={isOwner} />
        </div>
      </div>
    </>
  )
}
