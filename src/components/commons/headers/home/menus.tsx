'use client'

import clsx from 'clsx'
import {
  Home,
  LayoutPanelLeft,
  PhoneCall,
  Search,
  Store,
  X,
} from 'lucide-react'
import type { Session } from 'next-auth'
import { useState } from 'react'

import { manageAuth } from '@/actions/manage-auth'
import { ManageAuthButton } from '@/components/commons/manage-auth-button'
import { Link } from '@/components/ui/link'
import { ChatBubbleQuestion, Menu } from 'iconoir-react'

interface Props {
  hasProfileLink: boolean
  session: Session | null
}

export function Menus({ session }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const hasProfileLink = session?.user?.hasProfileLink

  function handleOpen() {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <button type="button" className=" p-0" onClick={handleOpen}>
        <Menu className="flex size-8 text-zinc-700" />
      </button>
      <div
        className={clsx('w-full items-center gap-4 bg-white', {
          'fixed inset-0 z-50 flex flex-col': isOpen,
          hidden: !isOpen,
        })}
      >
        <div className="flex w-full items-center justify-end p-6">
          <button type="button" className="p-0" onClick={handleOpen}>
            <X className="size-8" />
          </button>
        </div>
        <div className="flex h-[80vh] w-full flex-col items-center justify-center ">
          <ul className="flex w-[380px] flex-col items-center gap-1 p-2">
            <Link
              href="/"
              title="Página inicial"
              variant="primary"
              className="flex text-xl"
            >
              <Home size={24} className="text-blue-400" />
              Página inicial
            </Link>

            <Link
              href="/business"
              title="Estabelecimentos comerciais"
              variant="primary"
              className="flex text-xl"
            >
              <Store size={24} className="text-blue-500" />
              Estabelecimentos comerciais
            </Link>

            <Link
              variant="primary"
              href="/achados-e-perdidos"
              title="Achados e Perdidos"
              className="flex text-xl"
            >
              <Search size={24} className="text-green-500" />
              Achados e Perdidos
            </Link>

            <Link
              variant="primary"
              href="/como-funciona"
              title="Como funciona"
              className="flex text-xl"
            >
              <ChatBubbleQuestion className="text-purple-500" />
              Como funciona
            </Link>
            <Link
              variant="primary"
              href="/telefones-uteis"
              title="Telefones úteis"
              className="flex text-xl"
            >
              <PhoneCall className="text-blue-600" />
              Telefones úteis
            </Link>
          </ul>

          {session && hasProfileLink && (
            <Link
              variant="primary"
              href={`/${session?.user?.myProfileLink}/dashboard`}
              title="Painel de controle"
              className="flex text-xl"
            >
              <LayoutPanelLeft className="text-orange-500" />
              Painel de controle
            </Link>
          )}
          {session && !hasProfileLink && (
            <Link
              variant="primary"
              href="/criar"
              className="text-xl md:text-base"
            >
              Criar perfil
            </Link>
          )}
          <form action={manageAuth} className="flex w-full justify-center py-8">
            <ManageAuthButton session={session} />
          </form>
        </div>
      </div>
    </>
  )
}
