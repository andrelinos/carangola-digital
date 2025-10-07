import clsx from 'clsx'
import type { Session } from 'next-auth'

import { Button } from '@/components/ui/button'

interface Props {
  session: Session | null
}

export function ManageAuthButton({ session }: Props) {
  return (
    <Button
      variant="outline"
      className={clsx(
        'w-full max-w-xs text-base text-zinc-700 transition-colors duration-300 ease-in-out hover:cursor-pointer ',
        {
          ' hover:border-rose-400 hover:bg-rose-400 hover:text-white': session,
        }
      )}
    >
      {session ? 'Sair' : 'Entrar'}
    </Button>
  )
}
