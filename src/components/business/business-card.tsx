'use client'

import { motion } from 'framer-motion'
import { ArrowRight, MapPin, ShieldCheck, Star } from 'lucide-react'
import Link from 'next/link'
import type { ProfileDataProps } from '@/_types/profile-data'
import type { PublicProfileCardData } from '@/actions/business/get-latest-public-profiles'
import { Badge } from '@/components/ui/badge'
import { SafeImage } from '@/components/ui/safe-image'
import { cn } from '@/lib/utils'
import { getOperatingStatus } from '@/utils/get-status-from-day/get-operating-status'

interface BusinessCardProps {
  profile: PublicProfileCardData | ProfileDataProps
  className?: string
}

export function BusinessCard({ profile, className }: BusinessCardProps) {
  const status = getOperatingStatus({
    schedule: profile.openingHours as any,
    currentTime: new Date(),
    holidayExceptions: profile.holidayExceptions,
  })

  const neighborhood = profile.businessAddresses?.[0]?.neighborhood
  const logo =
    profile.logoImageUrl ||
    ('imagePath' in profile ? profile.imagePath : null) ||
    '/default-image.webp'

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative flex h-full min-h-[380px] w-full max-w-[340px] flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:border-primary/50 hover:shadow-xl',
        className
      )}
    >
      {/* Header with Background Pattern/Gradient */}
      <div className="relative h-32 w-full bg-linear-to-br from-primary/15 via-primary/5 to-secondary/15">
        {/* Decorative elements container with overflow-hidden so they don't leak */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -right-4 size-32 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-4 -left-4 size-32 rounded-full bg-secondary/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-1/2 w-full bg-linear-to-t from-background/50 to-transparent" />
        </div>

        {/* Premium Badge */}
        <div className="absolute top-3 right-3 z-20">
          {profile.isPremium && (
            <Badge
              variant="default"
              className="flex items-center gap-1 border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-amber-600 shadow-sm backdrop-blur-md hover:bg-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400"
            >
              <Star className="size-3 fill-amber-500 text-amber-500" />
              <span className="font-semibold text-[10px] uppercase tracking-wider">
                Premium
              </span>
            </Badge>
          )}
        </div>

        {/* Overlapping Logo Container */}
        <div className="absolute -bottom-14 left-1/2 z-10 -translate-x-1/2">
          <div className="relative size-28 overflow-hidden rounded-2xl border-4 border-background bg-white shadow-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
            <SafeImage
              src={logo}
              alt={profile.name}
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center px-5 pt-16 pb-6 text-center">
        <h3 className="mb-2 flex items-center justify-center gap-1.5 font-bold text-foreground text-xl tracking-tight transition-colors group-hover:text-primary">
          <span className="line-clamp-1">{profile.name}</span>
          {profile.isVerified && (
            <ShieldCheck className="size-5 shrink-0 text-blue-500" />
          )}
        </h3>

        <div className="mb-3 flex justify-center">
          <Badge
            variant="secondary"
            className="bg-secondary/50 font-medium text-[10px] text-secondary-foreground uppercase"
          >
            {profile.category || 'Serviços'}
          </Badge>
        </div>

        {/* Status indicator always visible */}
        <div className="mb-4 flex justify-center font-medium text-xs">
          {status}
        </div>

        {neighborhood && (
          <div className="mb-6 flex items-center justify-center gap-1.5 text-muted-foreground text-sm">
            <MapPin className="size-4 shrink-0 text-primary/50" />
            <span className="line-clamp-1">{neighborhood}</span>
          </div>
        )}

        <div className="mt-auto w-full">
          <Link
            href={`/business/${profile.slug}`}
            className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-primary/5 px-4 py-2.5 font-semibold text-primary text-sm transition-all hover:bg-primary hover:text-primary-foreground"
          >
            Ver perfil
            <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
