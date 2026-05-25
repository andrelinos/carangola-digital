'use client'

import { TrendingUpIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { GoBackButton } from '@/components/ui/go-back-button'

interface contentProps {
  children: ReactNode
  totalVisits?: number
}

export function ContentProperty({ children, totalVisits }: contentProps) {
  return (
    <main className="container mx-auto w-full pt-12 pb-6 sm:px-6 md:pt-16 lg:px-8">
      <div className="mb-3 flex items-center justify-between">
        <GoBackButton fallbackHref="/" />
        <div
          className="flex items-center gap-1 px-4 text-blue-800 transition-all duration-300 ease-in-out hover:scale-110"
          title="Número de visitas"
        >
          <TrendingUpIcon size={32} className="stroke-1" /> {totalVisits}
        </div>
      </div>
      <div className="flex flex-col">{children}</div>
    </main>
  )
}
