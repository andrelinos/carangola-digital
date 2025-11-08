import type { Metadata } from 'next'

import { getProfileData } from '@/app/server/get-profile-data'

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col justify-between">{children}</div>
  )
}
