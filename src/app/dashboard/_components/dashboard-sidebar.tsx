'use client'

import {
  Building2,
  CreditCard,
  Home,
  LayoutDashboard,
  PanelLeft,
  Shield,
  StoreIcon,
  UserCircle,
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

import { Loading } from '@/components/commons/loading'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function DashboardSidebar({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname()
  const router = useRouter()

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  function goToPath(path: string) {
    if (pathname === path) return
    setIsLoading(true)
    router.push(path)
  }

  const baseClasses =
    'flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-200 w-full justify-start text-sm group'
  const activeClasses =
    'bg-primary/10 dark:bg-primary/20 text-primary font-semibold shadow-none hover:bg-primary/15 dark:hover:bg-primary/25'
  const inactiveClasses =
    'bg-transparent text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800/55 hover:text-slate-900 dark:hover:text-slate-100 border border-transparent'

  return (
    <>
      {isSidebarOpen && (
        // biome-ignore lint/a11y/useSemanticElements: Semântica é de overlay
        <div
          role="button"
          tabIndex={0}
          aria-label="Fechar menu lateral"
          className="fixed inset-x-0 top-[72px] bottom-0 z-20 bg-black/50 md:hidden"
          onClick={toggleSidebar}
          onKeyDown={e => {
            // Aciona a função se o usuário apertar "Enter" ou "Espaço"
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              toggleSidebar()
            }
          }}
        />
      )}

      {!isSidebarOpen && (
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="fixed top-[84px] left-6 z-40 rounded-full border-slate-200 bg-white shadow-md md:hidden dark:border-slate-850 dark:bg-slate-900"
        >
          <PanelLeft className="size-5 opacity-70 dark:text-slate-300" />
        </Button>
      )}

      <aside
        className={cn(
          'fixed top-[72px] left-0 z-30 h-[calc(100vh-72px)] w-64 transform border-slate-100 border-r bg-white px-4 py-8 text-slate-900 transition-transform duration-500 ease-in-out dark:border-slate-800/60 dark:bg-slate-900 dark:text-slate-100',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo Area */}
          <div className="mb-10 flex items-center gap-3 px-2">
            <div className="rounded-2xl bg-primary/10 p-2 dark:bg-primary/20">
              <LayoutDashboard className="size-6 text-primary" />
            </div>
            <div>
              <h2 className="font-black text-slate-900 leading-none tracking-tighter dark:text-slate-100">
                PAINEL
              </h2>
              <p className="font-bold text-[10px] text-slate-400 uppercase tracking-widest dark:text-slate-500">
                Controle Geral
              </p>
            </div>
          </div>

          <nav className="flex-1 space-y-6">
            {/* Grupo: Principal */}
            <div className="space-y-1">
              <span className="mb-2 block px-4 font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                Principal
              </span>
              <Button
                className={cn(
                  baseClasses,
                  pathname === '/dashboard' ? activeClasses : inactiveClasses
                )}
                onClick={() => goToPath('/dashboard')}
                variant="ghost"
              >
                <Home className="size-5" />
                <span>Visão Geral</span>
              </Button>

              <Button
                className={cn(
                  baseClasses,
                  pathname.startsWith('/dashboard/perfil')
                    ? activeClasses
                    : inactiveClasses
                )}
                onClick={() => goToPath('/dashboard/perfil')}
                variant="ghost"
              >
                <UserCircle className="size-5" />
                <span>Meu Perfil</span>
              </Button>

              <Button
                className={cn(
                  baseClasses,
                  pathname.startsWith('/dashboard/assinatura')
                    ? activeClasses
                    : inactiveClasses
                )}
                onClick={() => goToPath('/dashboard/assinatura')}
                variant="ghost"
              >
                <CreditCard className="size-5" />
                <span>Assinatura</span>
              </Button>
            </div>

            {/* Grupo: Anúncios */}
            <div className="space-y-1">
              <span className="mb-2 block px-4 font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                Meus Anúncios
              </span>
              <Button
                className={cn(
                  baseClasses,
                  pathname.startsWith('/dashboard/business')
                    ? activeClasses
                    : inactiveClasses
                )}
                onClick={() => goToPath('/dashboard/business')}
                variant="ghost"
              >
                <StoreIcon className="size-5" />
                <span>Meus Negócios</span>
              </Button>

              <Button
                className={cn(
                  baseClasses,
                  pathname.startsWith('/dashboard/imoveis')
                    ? activeClasses
                    : inactiveClasses
                )}
                onClick={() => goToPath('/dashboard/imoveis')}
                variant="ghost"
              >
                <Building2 className="size-5" />
                <span>Meus Imóveis</span>
              </Button>
            </div>

            {/* Grupo: Admin */}
            {isAdmin && (
              <div className="space-y-1 border-slate-100 border-t pt-4">
                <span className="mb-2 block px-4 font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                  Painel Admin
                </span>
                <Button
                  className={cn(
                    baseClasses,
                    pathname.startsWith('/dashboard/todos-negocios')
                      ? activeClasses
                      : inactiveClasses
                  )}
                  onClick={() => goToPath('/dashboard/todos-negocios')}
                  variant="ghost"
                >
                  <Shield className="size-5" />
                  <span>Todos os Negócios</span>
                </Button>
              </div>
            )}
          </nav>

          <footer className="mt-auto border-slate-100 border-t pt-6 dark:border-slate-800/60">
            <div className="rounded-2xl border border-slate-200/50 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
              <p className="mb-1 text-center font-black text-slate-400 text-xs uppercase tracking-widest dark:text-slate-500">
                Versão do Sistema
              </p>
              <p className="text-center font-bold text-slate-900 text-sm dark:text-slate-100">
                v1.26.2
              </p>
            </div>
          </footer>
        </div>
      </aside>

      {isLoading && <Loading />}
    </>
  )
}
