'use client'

import { GoBackButton } from '@/components/ui/go-back-button'
import { TrendingUpIcon } from 'lucide-react'

import type { ReactNode } from 'react'

interface contentProps {
  children: ReactNode
  totalVisits?: number
}

export function ContentProfile({ children, totalVisits }: contentProps) {
  return (
    <main className="mx-auto w-full max-w-7xl pt-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between px-4 sm:px-0">
        <GoBackButton fallbackHref="/" />
        <div
          className="flex items-center gap-2 rounded-2xl bg-blue-50 px-4 py-2 font-bold text-blue-600 transition-all hover:scale-105 dark:bg-blue-900/20"
          title="Número de visitas"
        >
          <TrendingUpIcon size={20} className="stroke-2" />
          <span className="text-sm">{totalVisits?.toLocaleString() || 0} visitas</span>
        </div>
      </div>
      <div className="flex flex-col gap-0 overflow-hidden rounded-3xl bg-background shadow-2xl shadow-black/5 dark:shadow-none">
        {children}
      </div>
    </main>
  )
}
