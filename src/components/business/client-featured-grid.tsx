'use client'

import { motion } from 'framer-motion'
import type { PublicProfileCardData } from '@/actions/business/get-latest-public-profiles'
import { BusinessCard } from './business-card'

interface ClientFeaturedGridProps {
  profiles: PublicProfileCardData[]
}

export function ClientFeaturedGrid({ profiles }: ClientFeaturedGridProps) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {profiles.map((profile, index) => (
        <motion.div
          key={profile.id || profile.slug + index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex justify-center"
        >
          <BusinessCard profile={profile} />
        </motion.div>
      ))}
    </div>
  )
}
