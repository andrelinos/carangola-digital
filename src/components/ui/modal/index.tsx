'use client'

import { useRef } from 'react'

import { useOnClickOutside } from '@/hooks/handle-click-outside'
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

  useOnClickOutside(ref, () => setIsOpen(false))

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#787878]/10 backdrop-blur-md"
    >
      <div ref={ref} {...props} className={cn(classname)}>
        <p className="font-bold text-xl">{title}</p>
        <p className="font-light ">{description}</p>
        {children}
      </div>
    </div>
  )
}
