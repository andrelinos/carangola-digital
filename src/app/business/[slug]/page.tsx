import type { Metadata } from 'next'
import Link from 'next/link'
import { increaseBusinessVisits } from '@/actions/business/increase-business-visits'
import { getProfileData, getUsersData } from '@/app/server/get-profile-data'
import { BusinessAddresses } from './_components/business-addresses'
import { ContactPhones } from './_components/business-contact-phones'
import { Description } from './_components/business-description'
import { BusinessHero } from './_components/business-hero'
import { ContainerOpeningHours } from './_components/business-opening-hours'
import { SocialMedia } from './_components/business-social-media'
import { LikeShareButtons } from './_components/like-share-buttons'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const profileData = await getProfileData(slug)

  if (!profileData) {
    return {
      title: 'Carangola Digital | Perfil não encontrado',
    }
  }

  const title = `${profileData.name} | Carangola Digital`
  const description =
    profileData.businessDescription ||
    `Veja informações de ${profileData.name}, contatos, endereço e horários de funcionamento em Carangola/MG.`
  const url = `https://carangoladigital.com.br/business/${slug}`

  return {
    title,
    description,
    keywords: profileData.categories?.join(', '),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Carangola Digital',
      images: [
        {
          url:
            profileData.coverImageUrl ||
            profileData.logoImageUrl ||
            'https://carangoladigital.com.br/images/og-image.png',
          width: 1200,
          height: 630,
          alt: profileData.name,
        },
      ],
      locale: 'pt-BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [profileData.coverImageUrl || profileData.logoImageUrl || ''],
    },
  }
}

import { ShieldCheck } from 'iconoir-react'
import { Sparkles } from 'lucide-react'
import { getServerSession } from 'next-auth/next'
import { FooterProfile } from '@/components/commons/footer-profile'
import LocalBusinessJsonLd from '@/components/seo/local-business-json-ld'
import {
  type PlanTypeProps,
  plansBusinessConfig,
} from '@/configs/plans-business'
import { authOptions } from '@/lib/auth'
import { getPlanConfig } from '@/utils/get-plan-config'
import { BusinessGallery } from './_components/business-gallery'
import { StickyCta } from './_components/sticky-cta'
import { ContentProfile } from './content'

interface Props {
  params: Promise<{
    slug: string
  }>
}

export default async function BusinessId({ params }: Props) {
  const session = await getServerSession(authOptions)

  const { slug } = await params

  const profileData = await getProfileData(slug, session?.user?.id)

  const userData = await getUsersData(session?.user?.id || '')

  const planConfig = getPlanConfig(profileData?.planActive as any)

  const isOwner = profileData?.userId === session?.user?.id
  const isUserAuth = !!(
    session?.user?.id &&
    profileData?.admins?.some(admin => admin.userId === session.user.id)
  )

  if (!profileData) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="font-bold text-2xl">Perfil não encontrado</h1>
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
      <LocalBusinessJsonLd data={profileData} />
      <ContentProfile totalVisits={profileData?.totalVisits}>
        <BusinessHero
          profileData={profileData}
          planConfig={planConfig}
          isOwner={isOwner}
          isUserAuth={isUserAuth}
        />
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Content Column (70%) */}
            <div className="space-y-8 lg:col-span-2">
              <Description
                profileData={profileData}
                isOwner={isOwner}
                isUserAuth={isUserAuth}
              />

              <BusinessAddresses
                profileData={profileData}
                isOwner={isOwner}
                isUserAuth={isUserAuth}
              />

              {planConfig.imageGallery?.enabled && (
                <BusinessGallery
                  galleryImages={profileData.galleryImages}
                  isOwner={isOwner}
                  businessId={profileData.id}
                  limit={planConfig.imageGallery.limit}
                />
              )}

              {!planConfig.imageGallery?.enabled && isOwner && (
                <div className="overflow-hidden rounded-2xl border border-blue-100 bg-blue-50/50 p-6 dark:border-blue-900/50 dark:bg-blue-900/10">
                  <div className="flex flex-col items-center gap-6 sm:flex-row">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                      <Sparkles className="size-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-bold text-blue-950 text-lg dark:text-blue-100">
                        Potencialize seu perfil!
                      </h3>
                      <p className="mt-1 text-blue-800/80 text-sm dark:text-blue-200/70">
                        Faça um upgrade para adicionar uma galeria de fotos
                        atrativa, conectar todas as suas redes e destacar seu
                        negócio no topo das buscas.
                      </p>
                    </div>
                    <div className="shrink-0">
                      <Link
                        href="/dashboard/assinatura"
                        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-sm text-white transition-all hover:bg-blue-700 hover:shadow-md dark:bg-blue-600 dark:hover:bg-blue-500"
                      >
                        Ver Benefícios
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Column (30%) */}
            <div className="space-y-8">
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

              <SocialMedia
                profileData={profileData}
                isOwner={isOwner}
                isUserAuth={isUserAuth}
              />

              <div className="pt-4">
                <LikeShareButtons
                  profileData={profileData}
                  userInfo={session?.user}
                  isFavorite={isFavorite}
                  isOwner={isOwner}
                  isUserAuth={isUserAuth}
                />
              </div>

              {!profileData.hasOwner && (
                <div className="rounded-2xl bg-blue-50 p-6 dark:bg-blue-900/20">
                  <Link
                    href={`/reivindicar-empresa?slug=${profileData.slug}&businessId=${profileData.id}`}
                    className="group flex flex-col items-center gap-2 text-center text-sm"
                    target="_blank"
                  >
                    <ShieldCheck className="size-8 text-blue-500 transition-transform group-hover:scale-110" />
                    <span className="font-bold text-blue-900 dark:text-blue-100">
                      Reivindicar esta empresa
                    </span>
                    <p className="text-blue-800/70 text-xs dark:text-blue-200/60">
                      Você é o dono deste negócio? Verifique e gerencie suas
                      informações.
                    </p>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </ContentProfile>

      <FooterProfile profileData={profileData} isOwner={isOwner} />

      {planConfig.premiumFeatures?.stickyCta && (
        <StickyCta
          phones={profileData.businessPhones || []}
          businessName={profileData.name}
          profileId={profileData.id!}
          ownerId={profileData.userId}
        />
      )}
    </>
  )
}
