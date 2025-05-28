'use client'

import { FadeLoader } from 'react-spinners'

export function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/50 text-xs">
      <FadeLoader color="#fff" />
      <span className="text-white">Aguarde...</span>
    </div>
  )
}
