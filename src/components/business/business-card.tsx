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
    '/default-image.png'

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative flex h-full min-h-[380px] w-full max-w-[340px] flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:border-primary/50 hover:shadow-xl',
        className
      )}
    >
      {/* Top Banner / Status */}
      <div className="absolute top-4 right-4 z-20">
        {profile.isPremium && (
          <Badge
            variant="default"
            className="flex items-center gap-1 border-none bg-amber-500 shadow-sm hover:bg-amber-600"
          >
            <Star className="size-3 fill-current" />
            <span className="text-[10px] uppercase tracking-wider">
              Premium
            </span>
          </Badge>
        )}
      </div>

      {/* Header with Background Pattern/Gradient and Logo */}
      <div className="relative h-32 w-full overflow-hidden bg-linear-to-br from-primary/10 via-background to-secondary/10">
        {/* Subtle decorative elements */}
        <div className="absolute -top-4 -right-4 size-24 rounded-full bg-primary/5 blur-2xl" />
        <div className="absolute -bottom-4 -left-4 size-24 rounded-full bg-secondary/5 blur-2xl" />

        {/* Logo Container */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="relative size-20 overflow-hidden rounded-xl border-2 border-white bg-white shadow-md ring-4 ring-primary/5 transition-transform group-hover:scale-105">
            <SafeImage
              src={logo}
              alt={profile.name}
              fill
              className="object-contain p-2"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Status indicator always visible */}
        <div className="mb-3 flex justify-center font-medium text-xs">
          {status}
        </div>

        <div className="mb-2 flex flex-col items-center">
          <h3 className="line-clamp-1 text-center font-bold text-foreground text-lg transition-colors group-hover:text-primary">
            {profile.name}
            {profile.isVerified && (
              <ShieldCheck className="ml-1 inline-block size-4 text-blue-500" />
            )}
          </h3>

          <div className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
            <Badge
              variant="secondary"
              className="px-1.5 py-0 font-normal text-[10px] uppercase"
            >
              {profile.category || 'Serviços'}
            </Badge>
          </div>
        </div>

        <div className="mt-auto space-y-3">
          {neighborhood && (
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-sm">
              <MapPin className="size-3.5 text-primary/60" />
              <span>{neighborhood}</span>
            </div>
          )}

          <div className="mt-4 flex items-center justify-center">
            <Link
              href={`/business/${profile.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-2 font-semibold text-primary text-sm transition-all hover:bg-primary hover:text-white"
            >
              Ver perfil
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
