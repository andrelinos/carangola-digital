'use client'

import { Card, CardContent } from '@/components/ui/card'
import { GoBackButton } from '@/components/ui/go-back-button'
import { TrendingUpIcon } from 'lucide-react'

import type { ReactNode } from 'react'

interface contentProps {
  children: ReactNode
  totalVisits?: number
}

export function ContentProfile({ children, totalVisits }: contentProps) {
  return (
    <main className="mx-auto w-full max-w-4xl pt-6 sm:px-6 lg:px-8">
      <div className="mb-3 flex items-center justify-between">
        <GoBackButton fallbackHref="/" />
        <div
          className="flex items-center gap-1 px-4 text-blue-800 transition-all duration-300 ease-in-out hover:scale-110"
          title="Número de visitas"
        >
          <TrendingUpIcon size={32} className="stroke-1" /> {totalVisits}
        </div>
      </div>
      <Card className="overflow-hidden rounded-0 border-0">
        <CardContent className="flex flex-col p-0">{children}</CardContent>
      </Card>
    </main>
  )
}
