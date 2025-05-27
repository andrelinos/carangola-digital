'use client'

import { TrendingUp } from 'lucide-react'

interface Props {
  totalVisits?: number
}

export function TotalVisits({ totalVisits = 0 }: Props) {
  return (
    <div className="flex w-min items-center gap-5 whitespace-nowrap rounded-xl border border-border-primary bg-background-secondary px-4 py-2 opacity-80 shadow-lg">
      <span className="font-bold text-white text-xs">
        Total de visitas ao seu perfil
      </span>
      <div className="flex items-center gap-2 text-accent-green">
        <span className="font-bold text-2xl">{totalVisits}</span>
        <TrendingUp />
      </div>
    </div>
  )
}
