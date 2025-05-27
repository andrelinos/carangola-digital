'use client'

import { ChevronDown } from 'lucide-react'
import type { Session } from 'next-auth'
import Image from 'next/image'
import { useState } from 'react'

import { getInitialsFullNameAvatar } from '@/utils/get-initials-full-names'

interface DropdownMenuProps {
  LogOut: () => void
  userInfo?: Session['user']
}

export function DropdownMenu({ LogOut, userInfo }: DropdownMenuProps) {
  const [menuIsOpen, setMenuIsOpen] = useState(false)

  function handleOpenMenu() {
    setMenuIsOpen(!menuIsOpen)
  }

  function handleLogOut() {
    LogOut()
  }

  return (
    <div className="md:relative" onMouseLeave={handleOpenMenu}>
      <button
        type="button"
        className="group w-fit rounded-lg bg-zinc-100 px-2 py-1 hover:cursor-pointer hover:bg-blue-500"
        onClick={handleOpenMenu}
        onMouseEnter={handleOpenMenu}
      >
        <div className="flex w-full items-center justify-start gap-1 ">
          <div className="flex size-8 min-w-8 items-center justify-center overflow-hidden rounded-full bg-white font-medium text-sm">
            {userInfo?.image ? (
              <Image
                src={userInfo?.image}
                alt={userInfo?.name || ''}
                width={32}
                height={32}
                className="size-full object-cover"
              />
            ) : (
              getInitialsFullNameAvatar(userInfo?.name)
            )}
          </div>
          <div className="hidden items-center gap-1 md:flex">
            <span className=" w-40 text-nowrap text-left font-medium group-hover:text-white ">
              {userInfo?.name}
            </span>
            <ChevronDown className="size-6 stroke-1 text-zinc-700 group-hover:text-white" />
          </div>
        </div>
      </button>
      {menuIsOpen && (
        <div className="absolute right-6 w-[240px] bg-transparent py-1 font-medium transition-all duration-300 ease-in-out md:top-10 md:right-0 md:w-full">
          <div className="w-full rounded-lg border border-blue-500 bg-white py-2 font-medium text-zinc-700 ">
            <div className="flex flex-col gap-2 py-4">
              <button
                type="button"
                className="px-4 text-left transition-all duration-300 ease-in-out hover:cursor-pointer hover:pl-5.5 "
              >
                Meu perfil
              </button>
              <button
                type="button"
                onClick={handleLogOut}
                className="px-4 text-left transition-all duration-300 ease-in-out hover:cursor-pointer hover:pl-5.5 "
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
