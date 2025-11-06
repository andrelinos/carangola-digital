'use client'

import { Button } from '@/components/ui/button'
import { Link } from '@/components/ui/link'
import { Home, LayoutList, MessageSquare, PanelLeft } from 'lucide-react'
// 1. Importe o hook usePathname
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface Props {
  isSuper: boolean
}

export function DashboardSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  // 2. Obtenha o pathname atual
  const pathname = usePathname()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const isSuper = true

  // 3. Classes base e ativas para reutilizar
  const baseClasses = 'flex items-center gap-3 rounded-lg px-4 py-2.5'
  const inactiveClasses =
    'bg-sidebar-accent text-sidebar-accent-foreground font-medium hover:text-white'
  const activeClasses =
    'transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'

  return (
    <>
      {/* Overlay para fechar sidebar no mobile */}
      {isSidebarOpen && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: ignore
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      <Button
        variant="ghost"
        onClick={toggleSidebar}
        className="fixed top-18 left-0"
      >
        <PanelLeft className="opacity-70" />
      </Button>
      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 transform border-sidebar-border border-r bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex h-full flex-col pt-16">
          {/* Navegação Principal */}
          <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
            {/* 4. Aplique a lógica dinâmica */}
            <Link
              href="/dashboard" // Mudei de '#' para '/dashboard'
              className={`justify-start ${baseClasses} ${
                // Use 'match exato' para o dashboard principal
                pathname === '/dashboard' ? activeClasses : inactiveClasses
              }`}
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/dashboard/imoveis"
              className={`justify-start ${baseClasses} ${
                // Use 'startsWith' para rotas filhas (ex: /dashboard/imoveis/123)
                pathname.startsWith('/dashboard/imoveis')
                  ? activeClasses
                  : inactiveClasses
              }`}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Meus imóveis</span>
            </Link>
            {isSuper && (
              <>
                <Link
                  href="/dashboard/business"
                  className={`justify-start ${baseClasses} ${
                    pathname.startsWith('/dashboard/business')
                      ? activeClasses
                      : inactiveClasses
                  }`}
                >
                  <LayoutList className="h-5 w-5" />
                  <span>Negócios</span>
                </Link>
                {/* <Link
                  href="#" // Este link não ficará ativo pois href="#"
                  className={`${baseClasses} ${inactiveClasses}`}
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>Estatísticas</span>
                </Link> */}
              </>
            )}
          </nav>

          {/* Navegação Secundária (Rodapé) */}
          <footer className="mt-auto space-y-2 border-sidebar-border border-t px-4 py-6">
            {/* ... links do rodapé ... */}
          </footer>
        </div>
      </aside>
    </>
  )
}
