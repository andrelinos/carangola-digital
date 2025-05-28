'use client'

import { Stairs } from '@/components/effects'
import { AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function StairTransition() {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <div key={pathname} className="print:hidden">
        <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex h-screen w-screen">
          <Stairs />
        </div>
      </div>
    </AnimatePresence>
  )
}
