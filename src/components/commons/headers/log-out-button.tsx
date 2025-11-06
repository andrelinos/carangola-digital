import { LogOut } from 'iconoir-react'

import { manageAuth } from '@/actions/manage-auth'
import { Button } from '@/components/ui/button'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth/next'

export async function LogInOutButton() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  return (
    <div className="flex w-full items-center justify-end gap-2">
      <form action={manageAuth} className="w-full">
        <Button type="submit" variant="ghost" className="w-full">
          {session ? (
            <div className="flex w-full items-center justify-end gap-2">
              <span className="text-zinc-600">Sair</span>
              <LogOut className="size-6 stroke-1 text-zinc-700 hover:cursor-pointer" />
            </div>
          ) : (
            <div className="flex w-full items-center justify-end gap-2">
              <span className="text-zinc-600">Entrar</span>
              <LogOut className="size-6 stroke-1 text-zinc-700 hover:cursor-pointer" />
            </div>
          )}
        </Button>
      </form>
    </div>
  )
}
