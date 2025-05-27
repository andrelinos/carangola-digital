'use client'

import { useEffect } from 'react'

export function useOnClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler?: (event: MouseEvent | KeyboardEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | KeyboardEvent | TouchEvent) => {
      const target = event.target as HTMLElement

      if (!ref.current || ref.current.contains(target)) {
        return
      }

      if (handler) {
        handler(event as MouseEvent | KeyboardEvent)
      }
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    document.addEventListener('keydown', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
      document.removeEventListener('keydown', listener)
    }
  }, [ref, handler])
}
