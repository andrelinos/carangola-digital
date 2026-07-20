'use client'

import { Edit } from 'iconoir-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'

interface Props {
  handleExecute: () => void
  isOwner?: boolean
  children?: ReactNode
  title?: string
}

export function ButtonForOwnerOnly({
  handleExecute,
  isOwner = true,
  children,
  title,
}: Props) {
  if (!isOwner) return null

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleExecute}
      type="button"
      aria-label={`Editar ${title ?? 'informações'}`}
      className="h-7 gap-1 rounded-full px-2.5 font-medium text-[11px] text-muted-foreground hover:text-foreground"
    >
      <Edit className="size-3" />
      {children}
    </Button>
  )
}
