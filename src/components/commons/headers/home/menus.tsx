'use client'

import { manageAuth } from '@/actions/manage-auth'
import { menus } from '@/assets/data/menu-data'
import { Button } from '@/components/ui/button'
import { Link } from '@/components/ui/link'
import clsx from 'clsx'
import { List, X } from 'lucide-react'
import type { Session } from 'next-auth'
import { useState } from 'react'

interface Props {
  hasProfileLink: boolean
  session: Session | null
}

export function Menus({ hasProfileLink, session }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenMobile, setIsOpenMobile] = useState(false)

  function handleOpen() {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <Button variant="ghost" className="p-0" onClick={handleOpen}>
        <List className="flex size-8 text-zinc-700 md:hidden" />
      </Button>
      <div
        className={clsx(' items-center gap-4 bg-white md:flex', {
          // 'flex flex-col': isOpenMobile,
          'fixed inset-0 z-50 flex flex-col': isOpen,
          hidden: !isOpen,
        })}
      >
        <div className="flex w-full items-center justify-end p-6 md:hidden">
          <Button variant="ghost" className="p-0" onClick={handleOpen}>
            <X className="size-8" />
          </Button>
        </div>
        <div className="flex w-full flex-col items-center md:flex-row md:gap-4">
          {menus.map(menu => (
            <Link variant="primary" key={menu.title} href={menu.href}>
              {menu.title}
            </Link>
          ))}
          {session &&
            (!hasProfileLink ? (
              <Link variant="primary" href="/criar">
                Meu perfil
              </Link>
            ) : (
              <Link variant="primary" href={`/${session?.user?.myProfileLink}`}>
                Meu perfil
              </Link>
            ))}
          <form action={manageAuth} className="w-fit ">
            {!session && (
              <Button
                variant="link"
                className="text-zinc-700 hover:cursor-pointer"
              >
                Entrar
              </Button>
            )}
          </form>
        </div>
      </div>
    </>
  )
}
