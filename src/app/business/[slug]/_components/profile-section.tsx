'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ProfileSectionProps {
  children: ReactNode
  title?: string
  icon?: ReactNode
  className?: string
  delay?: number
}

export function ProfileSection({
  children,
  title,
  icon,
  className,
  delay = 0,
}: ProfileSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        'w-full overflow-hidden rounded-3xl border bg-card p-6 shadow-black/3 shadow-sm sm:p-8 dark:shadow-none',
        className
      )}
    >
      {title && (
        <div className="mb-6 flex items-center gap-3">
          {icon && <div className="text-primary">{icon}</div>}
          <h2 className="font-bold text-foreground text-xl tracking-tight">
            {title}
          </h2>
        </div>
      )}
      {children}
    </motion.section>
  )
}
