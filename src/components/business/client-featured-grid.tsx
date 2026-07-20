'use client'

import { motion } from 'framer-motion'
import type { PublicProfileCardData } from '@/actions/business/get-latest-public-profiles'
import { BusinessCard } from './business-card'

interface ClientFeaturedGridProps {
  profiles: PublicProfileCardData[]
}

export function ClientFeaturedGrid({ profiles }: ClientFeaturedGridProps) {
  return (
    <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="scrollbar-none flex snap-x snap-mandatory gap-6 overflow-x-auto pt-4 pb-8 [scrollbar-width:none]">
        {profiles.map((profile, index) => (
          <motion.div
            key={profile.id || profile.slug + index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="min-w-[85vw] shrink-0 snap-center sm:min-w-[340px]"
          >
            <BusinessCard profile={profile} />
          </motion.div>
        ))}
      </div>

      {/* Fade Edges for Desktop to indicate scroll */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-linear-to-l from-background to-transparent sm:block" />
    </div>
  )
}
