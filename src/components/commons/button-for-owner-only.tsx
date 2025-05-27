import type { ReactNode } from 'react'

interface Props {
  handleExecute: () => void
  isOwner?: boolean
  isSubmitting?: boolean
  children: ReactNode
}

export function ButtonForOwnerOnly({
  handleExecute,
  isOwner = true,
  isSubmitting,
  children,
}: Props) {
  if (!isOwner) return null

  return (
    <button
      onClick={handleExecute}
      type="button"
      className="h-fit text-zinc-600"
    >
      {children}
    </button>
  )
}
