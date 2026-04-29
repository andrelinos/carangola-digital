'use client'

import {
  Building2,
  CreditCard,
  Home,
  LayoutDashboard,
  PanelLeft,
  StoreIcon,
  UserCircle,
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

import { Loading } from '@/components/commons/loading'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function DashboardSidebar() {
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
    'flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300'
  const activeClasses =
    'bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary/90'
  const inactiveClasses =
    'bg-slate-100/50 text-slate-500 font-medium hover:bg-slate-100 hover:text-slate-900 border border-transparent'

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-x-0 top-[72px] bottom-0 z-20 bg-black/50 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {!isSidebarOpen && (
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="fixed top-[84px] left-6 z-40 rounded-full bg-white shadow-md md:hidden"
        >
          <PanelLeft className="size-5 opacity-70" />
        </Button>
      )}

      <aside
        className={cn(
          'fixed top-[72px] left-0 z-30 h-[calc(100vh-72px)] w-64 transform border-slate-100 border-r bg-white px-4 py-8 text-slate-900 transition-transform duration-500 ease-in-out',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo Area */}
          <div className="mb-10 flex items-center gap-3 px-2">
            <div className="rounded-2xl bg-primary/10 p-2">
              <LayoutDashboard className="size-6 text-primary" />
            </div>
            <div>
              <h2 className="font-black text-slate-900 leading-none tracking-tighter">
                PAINEL
              </h2>
              <p className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                Controle Geral
              </p>
            </div>
          </div>

          <nav className="flex-1 space-y-3">
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
          </nav>

          <footer className="mt-auto border-slate-100 border-t pt-6">
            <div className="rounded-2xl border border-slate-200/50 bg-slate-50 p-4">
              <p className="mb-1 text-center font-black text-slate-400 text-xs uppercase tracking-widest">
                Versão do Sistema
              </p>
              <p className="text-center font-bold text-slate-900 text-sm">
                v1.25.11
              </p>
            </div>
          </footer>
        </div>
      </aside>

      {isLoading && <Loading />}
    </>
  )
}
