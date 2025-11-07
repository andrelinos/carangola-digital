import { getServerSession } from 'next-auth/next'
import Link from 'next/link'

import { increasePropertyVisits } from '@/actions/properties/increase-property-visits'
import { getPropertyData } from '@/app/server/get-property-data'
import { authOptions } from '@/lib/auth'

import { PropertyDescription } from './_components/property-description'

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
import { PropertyImageGallery } from './_components/property-image-gallery'
import { ContentProperty } from './content'

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  const { slug } = await params

  const propertyData = await getPropertyData(slug)

  const isOwner = propertyData?.ownerId === user?.id
  const isUserAuth = !!(
    user?.id && propertyData?.admins?.some(admin => admin.userId === user.id)
  )

  if (!propertyData) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="font-bold text-2xl ">Imóvel não encontrado</h1>
        <Link href="/imoveis" className="text-accent-purple">
          Voltar para a página inicial
        </Link>
      </div>
    )
  }

  if (!isOwner) {
    await increasePropertyVisits({
      docPath: propertyData.docPath,
    })
  }

  return (
    <>
      <ContentProperty totalVisits={propertyData?.totalVisits}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="relative space-y-6 lg:col-span-2">
            <PropertyImageGallery
              propertyData={propertyData}
              title={propertyData?.title}
              propertyId={propertyData?.id}
              isOwner={isOwner || isUserAuth}
            />
            <div className="w-full rounded-lg p-6 shadow">
              <PropertyTitle
                propertyData={propertyData}
                isOwner={isOwner}
                isUserAuth={isUserAuth}
              />
              <PropertyPrice
                propertyData={propertyData}
                isOwner={isOwner}
                isUserAuth={isUserAuth}
              />
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
          <div className="flex flex-col gap-6">
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
