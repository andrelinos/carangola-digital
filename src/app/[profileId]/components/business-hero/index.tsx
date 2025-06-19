import type { ProfileDataProps } from '@/_types/profile-data'
import { Badge } from '@/components/ui/badge'
import { Star } from 'iconoir-react'
import Image from 'next/image'
import { EditBusinessInfo } from '../edit-business-info'

interface Props {
  profileData: ProfileDataProps
  isOwner?: boolean
}

export async function BusinessHero({ profileData, isOwner }: Props) {
  const renderStars = (rating: string | null) => {
    const ratingNum = Number.parseFloat(rating || '0')
    const stars = []
    const fullStars = Math.floor(ratingNum)
    const hasHalfStar = ratingNum % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="h-4 w-4 fill-current text-yellow-400 opacity-50"
        />
      )
    }

    const remainingStars = 5 - Math.ceil(ratingNum)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
    }

    return stars
  }

  const ratingOwnerSite = profileData.isPremium

  return (
    <>
      <div className="relative h-64 w-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600">
        <Image
          width={896}
          height={256}
          src={profileData?.imagePath || '/default-image.png'}
          alt={profileData?.name || ''}
          className="mx-auto w-auto shadow-2xl"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      <div className="p-8">
        <div className="mb-8 flex flex-col items-start space-x-6 lg:flex-row">
          <div className="-mt-16 relative h-24 w-24 rounded-2xl bg-white p-2 shadow-lg">
            <Image
              width={96}
              height={96}
              src={profileData?.imagePath || '/default-image.png'}
              alt={profileData?.name || ''}
              className="h-full w-full rounded-2xl object-cover"
              priority
            />
          </div>
          <div className=" flex flex-1 flex-col gap-1 pt-8">
            <div className="relative flex w-fit">
              <h2 className="flex items-center gap-2 text-center font-bold text-3xl">
                {profileData.name}
              </h2>
              {isOwner && (
                <div className="-top-5 absolute right-0 z-1 h-6 rounded-full bg-white/70">
                  <EditBusinessInfo
                    profileData={profileData}
                    imagePath={profileData?.imagePath}
                  />
                </div>
              )}
            </div>
            <p className="mb-4 text-gray-600 text-lg">
              {profileData.businessDescription}
            </p>
            <div className="mb-2 flex items-center space-x-4">
              <Badge variant="outline" className="w-fit">
                {profileData.category || 'Geral'}
              </Badge>
              {isOwner && (
                <Badge variant="outline">
                  {profileData.planType?.toUpperCase() || 'GRÁTIS'}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="flex">
                  {renderStars(
                    ratingOwnerSite ? '4.9' : profileData.rating || '0'
                  )}
                </div>
                <span className="ml-2 font-semibold text-gray-900">
                  {ratingOwnerSite ? '4.9' : profileData.rating || '0.0'}
                </span>
                <span className="ml-1 text-gray-600">/ 5</span>
              </div>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">
                {ratingOwnerSite ? 19 : profileData.reviewCount || 0} avaliações
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
