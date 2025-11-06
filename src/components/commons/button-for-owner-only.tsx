import { Edit } from 'iconoir-react'
import type { ReactNode } from 'react'
import { Button } from '../ui/button'

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
      variant="ghost"
      onClick={handleExecute}
      type="button"
      className="group relative z-1 flex size-fit h-fit gap-1 bg-transparent p-0 text-muted-foreground text-xs hover:cursor-pointer"
    >
      <Edit className="size-6 transition-all duration-300 group-hover:scale-150 group-hover:text-blue-600 dark:group-hover:text-blue-600" />
      {children}

      <span className="-top-7 -translate-x-1/2 absolute left-1/2 z-10 hidden w-fit transform text-nowrap rounded-md bg-amber-200 px-2 py-1 font-bold text-xs text-zinc-700 shadow-lg group-hover:flex">
        Editar {title ?? 'informações'}
      </span>
      <span className="-translate-x-1/2 absolute top-7 left-1/2 z-10 hidden w-24 transform text-wrap rounded-md bg-blue-100 px-2 py-1 font-semibold text-xs text-zinc-950 shadow-lg group-hover:flex">
        Opção visível apenas para você
      </span>
    </Button>
  )
}
