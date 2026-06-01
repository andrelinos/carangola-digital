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
  action?: ReactNode
}

export function ProfileSection({
  children,
  title,
  icon,
  className,
  delay = 0,
  action,
}: ProfileSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        'group relative w-full overflow-hidden rounded-3xl border bg-card p-6 shadow-black/3 shadow-sm sm:p-8 dark:shadow-none',
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

      {action && (
        <div className="absolute top-4 right-4 z-10 transition-opacity duration-150 sm:top-5 sm:right-5 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
          {action}
        </div>
      )}
      {children}
    </motion.section>
  )
}
