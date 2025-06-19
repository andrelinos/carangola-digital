import { EditPencil } from 'iconoir-react'
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
      className="group relative flex h-fit gap-1 rounded-md bg-blue-500 px-3 py-1 font-bold text-white text-xs hover:cursor-pointer"
    >
      <EditPencil className="size-4 transition-all duration-300 group-hover:scale-150" />
      {children}

      <span className="-top-7 -translate-x-1/2 absolute left-1/2 z-10 hidden w-fit transform text-nowrap rounded-md bg-amber-200 px-2 py-1 text-xs text-zinc-700 shadow-lg group-hover:flex">
        Editar informações
      </span>
      <span className="-translate-x-1/2 absolute top-7 left-1/2 z-10 hidden w-24 transform rounded-md bg-blue-100 px-2 py-1 font-light text-xs text-zinc-950 shadow-lg group-hover:flex">
        Opção visível apenas para você
      </span>
    </button>
  )
}
