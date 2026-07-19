'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/utils'

interface ModalProps {
  children: React.ReactNode
  isOpen: boolean
  title?: string
  description?: string
  classname?: string
  setIsOpen: (isOpen: boolean) => void
}

export function Modal({
  children,
  title,
  description,
  isOpen,
  setIsOpen,
  classname,
  ...props
}: ModalProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }

  if (!isOpen || !mounted) {
    return null
  }

  return createPortal(
    // biome-ignore lint/a11y/noStaticElementInteractions: ignore interaction with the modal overlay
    <div
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
    >
      <div
        ref={ref}
        {...props}
        className={cn('relative md:rounded-2xl', classname)}
      >
        {title && <p className="font-bold text-xl">{title}</p>}
        {description && (
          <p className="-mt-1 pb-8 font-light text-sm">- {description}</p>
        )}
        {children}
      </div>
    </div>,
    document.body
  )
}
