import { MessageText, ShieldCheck, Star } from 'iconoir-react'

import type { ProfileDataProps } from '@/_types/profile-data'
import { Badge } from '@/components/ui/badge'
import { SafeImage } from '@/components/ui/safe-image'
import type { PlanConfigProps } from '@/configs/plans-business'
import { EditBusinessHero } from './edit-business-hero'
import { RatingStars } from './rating-stars'

interface Props {
  profileData: ProfileDataProps
  planConfig: PlanConfigProps
  isOwner?: boolean
  isUserAuth?: boolean
}

export async function BusinessHero({
  profileData,
  planConfig,
  isOwner,
  isUserAuth,
}: Props) {
  const businessHeroInfo = profileData || []
  const profileId = profileData?.id || ''

  const currentRating =
    typeof profileData.rating === 'number' ? profileData.rating : 0
  const currentReviewCount = profileData.reviewCount || 0

  return (
    <section className="relative w-full overflow-hidden bg-slate-900 pb-24 text-white lg:rounded-b-[3rem]">
      {/* Immersive Cover Image */}
      <div className="absolute inset-0 opacity-40">
        <SafeImage
          src={profileData?.coverImageUrl || '/default-image-png'}
          alt={`Banner de ${profileData?.name}`}
          className="size-full object-cover"
          fill
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 pt-32 lg:pt-48">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-end md:gap-12">
          {/* Logo Frame */}
          <div className="group relative shrink-0">
            <div className="relative size-40 overflow-hidden rounded-4xl bg-white p-1.5 shadow-2xl ring-8 ring-white/10 transition-transform duration-500 group-hover:scale-105">
              <SafeImage
                src={profileData?.logoImageUrl || '/default-image.png'}
                alt={`Logo de ${profileData?.name}`}
                className="size-full rounded-4xl object-contain p-2"
                fill
              />
            </div>
            {profileData?.isPremium && (
              <div className="absolute -top-2 -right-2 z-20 flex size-10 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-xl ring-4 ring-slate-950">
                <Star className="size-6 fill-current" />
              </div>
            )}
          </div>

          {/* Business Info Layer */}
          <div className="flex-1 text-center md:pb-4 md:text-left">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              {(profileData?.isVerified ||
                ('premiumFeatures' in planConfig
                  ? planConfig.premiumFeatures?.verifiedBadge
                  : false)) && (
                <Badge
                  variant="default"
                  className="gap-1 border-none bg-blue-500 px-3 py-1 font-bold text-white tracking-tight"
                >
                  <ShieldCheck className="size-3.5" />
                  Verificado
                </Badge>
              )}
              {profileData?.categories?.length ? (
                profileData.categories.slice(0, 2).map(category => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="border-slate-700/50 bg-slate-800/80 text-white/90 backdrop-blur-sm"
                  >
                    {category}
                  </Badge>
                ))
              ) : (
                <Badge
                  variant="secondary"
                  className="bg-slate-800/80 text-white/90 backdrop-blur-sm"
                >
                  Geral
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
              <h1 className="font-extrabold text-4xl leading-tight tracking-tight md:text-6xl">
                {profileData?.name}
              </h1>
              {(isOwner || isUserAuth) && (
                <EditBusinessHero data={{ businessHeroInfo, profileId }} />
              )}
            </div>

            <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center">
              {/* Rating Component Integration */}
              <RatingStars
                profileId={profileId}
                slug={profileData.slug}
                initialRating={currentRating}
                totalReviews={currentReviewCount}
                userRating={profileData.currentUserRating}
                isLoggedIn={!!isUserAuth || !!isOwner}
                isOwner={isOwner}
              />

              <div className="hidden h-8 w-px bg-white/20 md:block" />

              <a
                href="#avaliacoes"
                className="group flex items-center justify-center gap-3 font-semibold text-sm text-white/60 transition-colors hover:text-white md:justify-start"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-white/5 transition-colors group-hover:bg-amber-500 group-hover:text-white">
                  <MessageText className="size-5" />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-bold text-base text-white">
                    {currentReviewCount}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider opacity-60">
                    Avaliações reais
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
