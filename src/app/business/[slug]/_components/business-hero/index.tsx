import { MessageText, Star } from 'iconoir-react'

import type { ProfileDataProps } from '@/_types/profile-data'
import { Badge } from '@/components/ui/badge'
import { SafeImage } from '@/components/ui/safe-image'
import { EditBusinessHero } from './edit-business-hero'

interface Props {
  profileData: ProfileDataProps
  isOwner?: boolean
  isUserAuth?: boolean
}

export async function BusinessHero({
  profileData,
  isOwner,
  isUserAuth,
}: Props) {
  const businessHeroInfo = profileData || []
  const profileId = profileData?.id || ''

  const currentRating = profileData.isPremium
    ? '4.9'
    : profileData.rating || '0.0'
  const currentReviewCount = profileData.isPremium
    ? 19
    : profileData.reviewCount || 0

  const renderStars = (ratingValue: string) => {
    const ratingNum = Number.parseFloat(ratingValue)
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= ratingNum) {
        stars.push(
          <Star
            key={i}
            className="h-5 w-5 text-yellow-400"
            fill="currentColor"
          />
        )
      } else if (i === Math.ceil(ratingNum) && !Number.isInteger(ratingNum)) {
        stars.push(
          <div key={i} className="relative">
            <Star className="h-5 w-5 text-zinc-300" fill="currentColor" />
            <div className="absolute top-0 left-0 h-full w-1/2 overflow-hidden">
              <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
            </div>
          </div>
        )
      } else {
        stars.push(
          <Star key={i} className="h-5 w-5 text-zinc-300" fill="currentColor" />
        )
      }
    }
    return stars
  }

  return (
    <section className="w-full pb-12">
      <div className="relative h-48 w-full md:h-64">
        <SafeImage
          src={profileData?.coverImageUrl || '/default-image.png'}
          alt={`Banner de ${profileData?.name}`}
          className="object-cover shadow-md"
          fill
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-black/10" />
      </div>

      <div className="-mt-20 container px-4">
        <div className="relative rounded-2xl bg-background/80 p-6 shadow-lg">
          <div className="flex flex-col items-center gap-4 border-slate-200 border-b pb-6 text-center sm:flex-row sm:text-left">
            <div className="relative h-28 w-28 shrink-0">
              <SafeImage
                src={profileData?.logoImageUrl || '/default-image.png'}
                alt={`Banner de ${profileData?.name}`}
                className="size-full rounded-full border-4 border-white object-cover shadow-md"
                // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                fill
              />
            </div>

            <div className="flex w-full flex-col items-center justify-between sm:flex-row sm:items-start">
              <h1 className="font-bold text-3xl">{profileData?.name}</h1>
              {(isOwner || isUserAuth) && (
                <div className="mt-2 sm:mt-0 sm:ml-4">
                  <EditBusinessHero data={{ businessHeroInfo, profileId }} />
                </div>
              )}
            </div>
          </div>

          <div className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center justify-center gap-3 sm:justify-start">
                <div className="flex">{renderStars(currentRating)}</div>
                <div className="text-sm">
                  <span className="font-bold text-zinc-800">
                    {currentRating}
                  </span>
                  <span className="text-zinc-500"> / 5</span>
                </div>
                <div className="h-4 w-px bg-slate-200" />
                <a
                  href="#avaliacoes"
                  className="flex items-center gap-1.5 text-sm text-zinc-600 hover:text-blue-600"
                >
                  <MessageText className="h-4 w-4" />
                  <span>{currentReviewCount} avaliações</span>
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {profileData?.categories?.length ? (
                  profileData?.categories?.slice(0, 3).map(category => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="bg-blue-100 text-blue-800"
                    >
                      {category}
                    </Badge>
                  ))
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    Geral
                  </Badge>
                )}

                {(isOwner || isUserAuth) && (
                  <div className='flex flex-col items-center rounded-md bg-white/20 px-2 py-1 text-xs'>
                    <span>PLANO</span>
                    <span className="font-semibold">
                      {profileData?.planType?.toUpperCase() || 'GRÁTIS'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {profileData?.businessDescription && (
              <p className="mt-6 text-center text-base text-muted-foreground sm:text-left">
                {profileData?.businessDescription}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
