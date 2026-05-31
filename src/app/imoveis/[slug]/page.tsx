import type { Metadata } from 'next'
import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import { increasePropertyVisits } from '@/actions/properties/increase-property-visits'
import { getPropertyData } from '@/app/server/get-property-data'
import RealEstateListingJsonLd from '@/components/seo/real-estate-json-ld'
import { authOptions } from '@/lib/auth'
import {
  PropertyAction,
  PropertyAddress,
  PropertyDetails,
  PropertyFeatures,
  PropertyInfo,
  PropertyPrice,
  PropertyStatus,
  PropertyTitle,
} from './_components'
import { PropertyDescription } from './_components/property-description'
import { PropertyImageGallery } from './_components/property-image-gallery'
import { ContentProperty } from './content'
import { verifyAdmin } from '@/app/server/verify-admin.server'

interface Props {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const propertyData = await getPropertyData(slug)

  if (!propertyData) {
    return {
      title: 'Carangola Digital | Imóvel não encontrado',
      description:
        'Encontre os melhores imóveis em Carangola no portal Carangola Digital.',
    }
  }

  const title = `${propertyData.title} | Carangola Digital`
  const description =
    propertyData.description ||
    `Confira este imóvel em Carangola: ${propertyData.title}. Veja preços, fotos e detalhes no Carangola Digital.`
  const url = `https://carangoladigital.com.br/imoveis/${slug}`

  return {
    title,
    description,
    keywords:
      propertyData.features?.join(', ') || propertyData.keywords?.join(', '),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url:
            propertyData?.images?.[0]?.url ||
            'https://carangoladigital.com.br/images/og-image.png',
          width: 1200,
          height: 630,
          alt: propertyData.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [propertyData?.images?.[0]?.url || ''],
    },
  }
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  const { slug } = await params

  const propertyData = await getPropertyData(slug)

  if (!propertyData) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="font-bold text-2xl">Imóvel não encontrado</h1>
        <Link href="/imoveis" className="text-accent-purple">
          Voltar para a página inicial
        </Link>
      </div>
    )
  }

  const isOwner = propertyData?.ownerId === user?.id
  const isUserAuth = !!(
    user?.id && propertyData?.admins?.some(admin => admin.userId === user.id)
  )

  const isAdmin = await verifyAdmin()
  const canViewStats = isOwner || isAdmin || isUserAuth

  if (!isOwner) {
    await increasePropertyVisits({
      docPath: propertyData.docPath,
    })
  }

  return (
    <>
      <RealEstateListingJsonLd data={propertyData} />
      <ContentProperty totalVisits={propertyData?.totalVisits} canViewStats={canViewStats}>
        <div className="grid items-start gap-8 lg:grid-cols-3">
          <div className="relative space-y-8 lg:col-span-2">
            <PropertyImageGallery
              propertyData={propertyData}
              title={propertyData?.title}
              propertyId={propertyData?.id}
              isOwner={isOwner || isUserAuth}
            />
            <div className="w-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <PropertyTitle
                propertyData={propertyData}
                isOwner={isOwner}
                isUserAuth={isUserAuth}
              />
              <div className="mt-4 border-slate-100 border-t pt-4">
                <PropertyPrice
                  propertyData={propertyData}
                  isOwner={isOwner}
                  isUserAuth={isUserAuth}
                />
              </div>
            </div>

            {/* Address */}
            <PropertyAddress
              propertyData={propertyData}
              isOwner={isOwner}
              isUserAuth={isUserAuth}
            />

            {/* Details */}
            <PropertyDetails
              propertyData={propertyData}
              isOwner={isOwner}
              isUserAuth={isUserAuth}
            />

            {/* Description */}
            <PropertyDescription
              propertyData={propertyData}
              isOwner={isOwner}
              isUserAuth={isUserAuth}
            />

            {/* Features */}
            <PropertyFeatures
              propertyData={propertyData}
              isOwner={isOwner}
              isUserAuth={isUserAuth}
            />
          </div>
          <div className="sticky top-24 flex flex-col gap-6">
            {/* Status */}
            <PropertyStatus
              propertyData={propertyData}
              isOwner={isOwner}
              isUserAuth={isUserAuth}
            />

            {/* Information  */}
            <PropertyInfo
              propertyData={propertyData}
              isOwner={isOwner}
              isUserAuth={isUserAuth}
            />

            {/* Action  */}
            <PropertyAction
              propertyData={propertyData}
              isOwner={isOwner}
              isUserAuth={isUserAuth}
            />
          </div>
        </div>
      </ContentProperty>
      {/* <PropertyDetailComponentPage
        propertyData={propertyData}
        profileData={null}
        profileId={'profileId'}
        propertyId={slug}
        isOwner={isOwner}
        isUserAuth={isUserAuth}
      /> */}
    </>
  )
}
