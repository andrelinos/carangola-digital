import clsx from 'clsx'
import type { Session } from 'next-auth'

import { Button } from '@/components/ui/button'
import { DoorOpen } from 'lucide-react'

interface Props {
  session: Session | null
}

export function ManageAuthButton({ session }: Props) {
  return (
    <Button
      variant="outline"
      className={clsx(
        'w-full px-4 transition-colors duration-300 ease-in-out hover:cursor-pointer ',
        {
          ' hover:border-rose-400 hover:bg-rose-400 hover:text-white': session,
        }
      )}
    >
      {session ? <DoorOpen /> : 'Entrar'}
    </Button>
  )
}
