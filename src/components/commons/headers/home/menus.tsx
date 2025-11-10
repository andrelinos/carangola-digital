'use client'

import clsx from 'clsx'
import { CardShield, ChatBubbleQuestion, Menu } from 'iconoir-react'
import {
  BuildingIcon,
  Home,
  LayoutPanelLeft,
  Moon,
  PhoneCall,
  Search,
  Store,
  Sun,
  X,
} from 'lucide-react'
import type { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Link } from '@/components/ui/link'

interface Props {
  hasProfileLink: boolean
  session: Session | null
}

export function Menus({ session }: Props) {
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)

  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    if (
      theme === 'dark' ||
      (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
      setIsDarkMode(true)
    } else {
      document.documentElement.classList.remove('dark')
      setIsDarkMode(false)
    }
  }, [])

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDarkMode(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDarkMode(true)
    }
  }

  const hasProfileLink = session?.user?.hasProfileLink

  function handleOpen() {
    setIsOpen(!isOpen)
  }

  async function handleLogOut() {
    await signOut()

    router.replace('/')
  }

  return (
    <div className="flex w-fit items-center gap-2">
      {session ? (
        <Button variant="ghost" onClick={handleLogOut}>
          Sair
        </Button>
      ) : (
        <Link variant="ghost" href="/acesso" className="w-full">
          Entrar
        </Link>
      )}
      <div className="">
        {/* O botão "Hambúrguer" para abrir o menu mobile */}
        <button type="button" className=" p-0" onClick={handleOpen}>
          <Menu className="flex size-8 text-muted-foreground" />
        </button>

        {/* O menu modal em tela cheia */}
        <div
          className={clsx('w-full items-center gap-4 bg-muted', {
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
            <ul className="flex w-[380px] flex-col items-center gap-4 p-2">
              <Link
                href="/"
                title="Página inicial"
                variant="scale"
                className="group flex font-medium text-gray-700 text-xl hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
              >
                <Home className="size-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                Página inicial
              </Link>
              {session && (
                <Link
                  variant="scale"
                  href="/dashboard"
                  title="Painel de controle"
                  className="group flex font-medium text-gray-700 text-xl hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
                >
                  <LayoutPanelLeft className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  Painel de controle
                </Link>
              )}

              <Link
                href="/business"
                title="Estabelecimentos comerciais"
                variant="scale"
                className="group flex font-medium text-gray-700 text-xl hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
              >
                <Store className="size-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                Comércios e Serviços
              </Link>

              <Link
                href="/imoveis"
                title="Imóveis comerciais e residenciais"
                variant="scale"
                className="group flex font-medium text-gray-700 text-xl hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
              >
                <BuildingIcon className="size-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                Imóveis e Relacionados
              </Link>

              <Link
                variant="scale"
                href="/achados-e-perdidos"
                title="Achados e Perdidos"
                className="group flex font-medium text-gray-700 text-xl hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
              >
                <Search className="size-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                Achados e Perdidos
              </Link>

              <Link
                variant="scale"
                href="/como-funciona"
                title="Como funciona"
                className="group flex font-medium text-gray-700 text-xl hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
              >
                <ChatBubbleQuestion className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                Como funciona
              </Link>
              <Link
                variant="scale"
                href="/telefones-uteis"
                title="Telefones úteis"
                className="group flex font-medium text-gray-700 text-xl hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
              >
                <PhoneCall className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                Telefones úteis
              </Link>
            </ul>

            {/* Links/Ações de Autenticação Mobile */}
            {session && !hasProfileLink && (
              <Link
                variant="scale"
                href="/criar"
                title="Criar perfil"
                className="group flex font-medium text-gray-700 text-xl hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
              >
                <CardShield className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                Criar perfil
              </Link>
            )}
            <div className="mx-auto mt-8 flex w-full max-w-xs flex-col items-center justify-center gap-4 border-gray-400/30 border-t py-8">
              {session ? (
                <Button
                  onClick={handleLogOut}
                  variant="outline"
                  className={clsx(
                    'w-full px-4 transition-colors duration-300 ease-in-out hover:cursor-pointer ',
                    {
                      ' hover:border-rose-400 hover:bg-rose-400 hover:text-white':
                        session,
                    }
                  )}
                >
                  Sair
                </Button>
              ) : (
                <Link variant="outline" href="/acesso" className="w-full">
                  Entrar
                </Link>
              )}
              <div className=" ">
                <Button
                  variant="ghost"
                  onClick={toggleTheme}
                  className="text-foreground transition-colors hover:cursor-pointer hover:bg-accent hover:ring-1 hover:ring-gray-400/20"
                  aria-label="Alternar tema"
                >
                  {isDarkMode ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
