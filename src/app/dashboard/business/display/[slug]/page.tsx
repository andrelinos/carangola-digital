import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { getProfileData } from '@/app/server/get-profile-data'
import { authOptions } from '@/lib/auth'
import { DisplayContent } from './_components/display-content'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CounterDisplayPage({ params }: PageProps) {
  const { slug } = await params
  const session = await getServerSession(authOptions)

  const profile = await getProfileData(slug, session?.user?.id)

  if (!profile) {
    notFound()
  }

  return (
    <DisplayContent
      slug={slug}
      establishmentName={profile.name || 'Sem nome'}
    />
  )
}
