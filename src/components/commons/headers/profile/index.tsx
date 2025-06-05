import Image from 'next/image'

import { manageAuth } from '@/actions/manage-auth'
import { Button } from '@/components/ui/button'
import { Link } from '@/components/ui/link'
import { auth } from '@/lib/auth'

import type { ProfileDataProps } from '@/_types/profile-data'

import { getInitialsFullNameAvatar } from '@/utils/get-initials-full-names'
import { Search } from 'iconoir-react'

interface Props {
  profileData?: ProfileDataProps
  isOwner?: boolean
}

export async function HeaderProfile({ profileData, isOwner }: Props) {
  const session = await auth()

  const hasProfileLink = session?.user?.hasProfileLink || false

  return (
    <div className="absolute top-0 right-0 left-0 z-50 mx-auto flex w-full max-w-7xl flex-col items-center justify-between p-6">
      <div className="flex w-full justify-between">
        <div className="size-full max-h-24 max-w-24 overflow-hidden rounded-lg shadow">
          {profileData?.imagePath && (
            <Image
              width={80}
              height={80}
              className="size-full rounded-lg object-cover object-center"
              src={profileData?.imagePath}
              alt={profileData?.name || ''}
            />
          )}
        </div>
        <div className="flex items-center gap-4">
          <Link variant="primary" href="/" className="flex gap-1">
            <Search /> Buscar
          </Link>

          {!hasProfileLink ? (
            <Link variant="primary" href="/criar">
              Criar perfil
            </Link>
          ) : (
            !isOwner && (
              <Link variant="primary" href={`/${session?.user?.myProfileLink}`}>
                Meu perfil
              </Link>
            )
          )}

          <form action={manageAuth} className="w-fit ">
            {session ? (
              <div className="flex min-w-8 items-center justify-center overflow-hidden rounded-full bg-white font-medium ">
                {session?.user?.image ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={manageAuth}
                      className="px-4 text-left font-semibold outline-0 transition-all duration-300 ease-in-out hover:cursor-pointer hover:text-rose-400"
                    >
                      Sair
                    </button>

                    <span className="flex size-8 min-w-8 items-center justify-center overflow-hidden rounded-full bg-white font-medium text-sm">
                      <Image
                        src={session?.user?.image}
                        alt={session?.user?.name || ''}
                        width={32}
                        height={32}
                        className="size-full object-cover"
                      />
                    </span>
                  </div>
                ) : (
                  getInitialsFullNameAvatar(session?.user?.name)
                )}
              </div>
            ) : (
              <Button
                variant="ghost"
                className="h-12 min-w-40 rounded-lg bg-blue-500 p-0 px-2 hover:cursor-pointer"
              >
                Entrar
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
