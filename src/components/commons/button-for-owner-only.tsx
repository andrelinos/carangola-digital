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
      className="ga-1 group relative flex h-fit rounded-md bg-blue-500 p-1 font-bold text-white text-xs hover:cursor-pointer"
    >
      {children}

      <span className="-top-7 -translate-x-1/2 absolute left-1/2 z-40 hidden w-fit transform text-nowrap rounded-md bg-white-500 px-2 py-1 text-xs text-zinc-700 shadow-lg group-hover:flex">
        Editar informações
      </span>
    </button>
  )
}
