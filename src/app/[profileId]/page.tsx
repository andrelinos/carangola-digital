import Link from 'next/link'

import type { ProfileDataProps } from '@/_types/profile-data'
import type { UserProps } from '@/_types/user'

import { increaseBusinessVisits } from '@/actions/increase-business-visits'
import { getProfileData, getUsersData } from '@/app/server/get-profile-data'
import { auth } from '@/lib/auth'

import { FooterProfile } from '@/components/commons/footer-profile'
import { HeaderProfile } from '@/components/commons/headers'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft } from 'iconoir-react'
import type { Metadata } from 'next'

import { BusinessAddresses } from './components/business-addresses'
import { ContactPhones } from './components/business-contact-phones'
import { Description } from './components/business-description'
import { BusinessHero } from './components/business-hero'
import { ContainerOpeningHours } from './components/business-opening-hours'
import { SocialMedia } from './components/business-social-media'
import { LikeShareButtons } from './components/like-share-buttons'

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
  const isUserAuth = !!(
    session?.user?.id &&
    profileData?.admins?.some(admin => admin.userId === session.user.id)
  )

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
      <main className="mx-auto w-full max-w-4xl pt-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>
        <Card className="overflow-hidden rounded-0 border-0 bg-white">
          <CardContent className="flex flex-col p-0">
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
                userInfo={session?.user}
                isFavorite={isFavorite}
                isOwner={isOwner}
                isUserAuth={isUserAuth}
              />
            </div>
          </CardContent>
        </Card>
      </main>

      <FooterProfile profileData={profileData} isOwner={isOwner} />
    </>
  )
}
