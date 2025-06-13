import Image from 'next/image'
import NextLink from 'next/link'

import { manageAuth } from '@/actions/manage-auth'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'

import type { ProfileDataProps } from '@/_types/profile-data'
import { Link } from '@/components/ui/link'
import { menus } from '../menu-data'

interface Props {
  profileData?: ProfileDataProps
}

export async function HeaderHome({ profileData }: Props) {
  const session = await auth()

  const hasProfileLink = session?.user?.hasProfileLink || false

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between p-6">
      <div className="flex w-full justify-between">
        <NextLink
          href="/"
          className="flex w-fit items-center justify-center gap-2"
        >
          <Image
            width={80}
            height={80}
            className="size-auto max-h-14 lg:max-h-16"
            src="/logo-blue.svg"
            alt="Logo Carangola Digital"
            priority
          />
          <h2 className="max-w-[112px] font-bold opacity-90 lg:text-xl">
            Carangola Digital
          </h2>
        </NextLink>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-4 md:flex">
            {menus.map(menu => (
              <Link variant="primary" key={menu.title} href={menu.href}>
                {menu.title}
              </Link>
            ))}
          </div>
          {!hasProfileLink ? (
            <Link variant="primary" href="/criar">
              Meu perfil
            </Link>
          ) : (
            <Link variant="primary" href={`/${session?.user?.myProfileLink}`}>
              Meu perfil
            </Link>
          )}
          <form action={manageAuth} className="w-fit ">
            {!session && (
              <Button variant="link" className="text-zinc-700">
                Entrar
              </Button>
            )}
          </form>
        </div>
      </div>
      {session && !hasProfileLink && (
        <div className="fixed inset-x-0 bottom-0 z-10 flex w-full items-center justify-center bg-white p-4">
          <Button className="w-full max-w-xs bg-orange-500 px-6 md:hidden">
            ANUNCIAR
          </Button>
        </div>
      )}
    </div>
  )
}
