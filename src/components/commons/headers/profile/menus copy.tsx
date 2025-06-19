'use client'

import { manageAuth } from '@/actions/manage-auth'
import { menus } from '@/assets/data/menu-data'
import { Button } from '@/components/ui/button'
import { Link } from '@/components/ui/link'
import { getInitialsFullNameAvatar } from '@/utils/get-initials-full-names'
import clsx from 'clsx'
import { Search } from 'iconoir-react'
import { List, X } from 'lucide-react'
import type { Session } from 'next-auth'
import Image from 'next/image'
import { useState } from 'react'

interface MenusProps {
  hasProfileLink: boolean
  isOwner?: boolean
  session: Session | null
}

function UserAvatar({ session }: { session: Session }) {
  const { user } = session
  return (
    <div className="flex min-w-8 items-center justify-center overflow-hidden rounded-full bg-white font-medium">
      {user?.image ? (
        <Image
          src={user.image}
          alt={user.name || 'Avatar'}
          width={120}
          height={120}
          className="object-cover"
          priority
        />
      ) : (
        getInitialsFullNameAvatar(user?.name)
      )}
    </div>
  )
}

function AuthButton({ session }: { session: Session | null }) {
  if (session) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={manageAuth}
          className="font-semibold transition-all duration-300 ease-in-out hover:cursor-pointer hover:text-rose-400"
        >
          Sair
        </button>
        <div className="hidden size-8 md:flex">
          <UserAvatar session={session} />
        </div>
      </div>
    )
  }

  return (
    <Button
      variant="link"
      className="text-zinc-700 hover:cursor-pointer"
      onClick={manageAuth}
    >
      Entrar
    </Button>
  )
}

export function Menus({ hasProfileLink, session, isOwner }: MenusProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(prev => !prev)

  return (
    <>
      <Button variant="ghost" className="p-0 md:hidden" onClick={toggleMenu}>
        <List className="size-8 text-zinc-700" />
      </Button>

      <div
        className={clsx('items-center gap-4 bg-white md:flex', {
          'fixed inset-0 z-50 flex flex-col': isOpen,
          hidden: !isOpen && true, // garante que mobile fique escondido caso não esteja aberto
        })}
      >
        {/* Cabeçalho do menu mobile */}
        <div className="flex w-full items-center justify-end p-6 md:hidden">
          <Button variant="ghost" className="p-0" onClick={toggleMenu}>
            <X className="size-8" />
          </Button>
        </div>

        <form action={manageAuth} className="flex w-fit md:hidden">
          {session ? (
            <UserAvatar session={session} />
          ) : (
            <Button
              variant="link"
              className="text-zinc-700 hover:cursor-pointer"
              onClick={manageAuth}
            >
              Entrar
            </Button>
          )}
        </form>

        <div className="flex w-full flex-col items-center md:flex-row md:gap-4">
          <Link variant="primary" href="/" className="flex gap-1">
            <Search /> Buscar
          </Link>

          {menus.map(menu => (
            <Link variant="primary" key={menu.title} href={menu.href}>
              {menu.title}
            </Link>
          ))}

          {/* Renderiza link para "Criar perfil" ou "Meu perfil" */}
          {session &&
            (!hasProfileLink ? (
              <Link variant="primary" href="/criar">
                Criar perfil
              </Link>
            ) : (
              !isOwner && (
                <Link variant="primary" href={`/${session.user.myProfileLink}`}>
                  Meu perfil
                </Link>
              )
            ))}

          <form action={manageAuth} className="w-fit">
            <AuthButton session={session} />
          </form>
        </div>
      </div>
    </>
  )
}
