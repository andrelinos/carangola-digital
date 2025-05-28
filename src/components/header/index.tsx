import Image from 'next/image'
import NextLink from 'next/link'

import { manageAuth } from '@/actions/manage-auth'
import { Button } from '@/components/ui/button'
import { Link } from '@/components/ui/link'
import { auth } from '@/lib/auth'

import type { ProfileDataProps } from '@/_types/profile-data'

import { DropdownMenu } from './menu'

interface Props {
  profileData?: ProfileDataProps
}

export async function Header({ profileData }: Props) {
  const session = await auth()

  const hasProfileLink = session?.user?.hasProfileLink || false

  return (
    <div className="absolute top-0 right-0 left-0 z-50 mx-auto flex w-full max-w-7xl flex-col items-center justify-between p-6">
      <div className="flex w-full justify-between">
        <NextLink
          href="/"
          className="flex w-full items-center justify-center gap-2"
        >
          <Image
            width={80}
            height={80}
            className="max-h-14 lg:max-h-16"
            src="/logo-blue.svg"
            alt="Logo Carangola Digital"
          />
          <h2 className="max-w-[112px] font-bold opacity-90 lg:text-xl">
            Carangola Digital
          </h2>
        </NextLink>
        <div className="flex items-center gap-4">
          {!hasProfileLink ? (
            <Link
              href="/criar"
              className="hidden bg-orange-500 px-6 py-2 md:flex"
            >
              ANUNCIAR
            </Link>
          ) : (
            <Link
              href={`/${session?.user?.myProfileLink}`}
              className="hidden bg-blue-500 px-6 py-2 md:flex"
            >
              Meu perfil
            </Link>
          )}
          <form action={manageAuth} className="w-fit ">
            {session ? (
              <DropdownMenu LogOut={manageAuth} userInfo={session?.user} />
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
      <div className="fixed inset-x-0 bottom-0 z-10 flex w-full items-center justify-center bg-white p-4">
        {session && (
          <Button className="w-full max-w-xs bg-orange-500 px-6 md:hidden">
            ANUNCIAR
          </Button>
        )}
      </div>
    </div>
  )
}
