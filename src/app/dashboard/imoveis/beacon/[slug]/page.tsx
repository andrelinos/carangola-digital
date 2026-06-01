import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { getPropertyData } from '@/app/server/get-property-data'
import { authOptions } from '@/lib/auth'
import { BeaconContent } from './_components/beacon-content'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function PropertyBeaconPage({ params }: PageProps) {
  const { slug } = await params
  const session = await getServerSession(authOptions)

  const property = await getPropertyData(slug)

  if (!property) {
    notFound()
  }

  return <BeaconContent slug={slug} property={property} />
}
