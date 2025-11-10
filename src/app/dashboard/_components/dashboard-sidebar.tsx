'use client'

import { Building2, Home, PanelLeft, StoreIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Link } from '@/components/ui/link'

export function DashboardSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const pathname = usePathname()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const baseClasses = 'flex items-center gap-3 rounded-lg px-4 py-2.5'
  const inactiveClasses =
    'bg-sidebar-accent text-sidebar-accent-foreground font-medium hover:text-white'
  const activeClasses =
    'transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'

  return (
    <>
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
        <PanelLeft className="opacity-70" /> Menu
      </Button>
      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 transform border-sidebar-border border-r bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex h-full flex-col pt-16">
          <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
            <Link
              href="/dashboard"
              className={`justify-start ${baseClasses} ${
                pathname === '/dashboard' ? activeClasses : inactiveClasses
              }`}
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/dashboard/business"
              className={`justify-start ${baseClasses} ${
                pathname.startsWith('/dashboard/business')
                  ? activeClasses
                  : inactiveClasses
              }`}
            >
              <StoreIcon className="h-5 w-5" />
              <span>Menus negócios</span>
            </Link>

            <Link
              href="/dashboard/imoveis"
              className={`justify-start ${baseClasses} ${
                pathname.startsWith('/dashboard/imoveis')
                  ? activeClasses
                  : inactiveClasses
              }`}
            >
              <Building2 className="h-5 w-5" />
              <span>Meus imóveis</span>
            </Link>
          </nav>

          <footer className="mt-auto space-y-2 border-sidebar-border border-t px-4 py-6">
            <div className="flex w-full flex-col items-end gap-2">
              <p className="w-full text-center">Painel de controle</p>
              <span className="mt-6 w-full text-right font-bold text-xs">
                Versão: 1.25.1
              </span>
            </div>
          </footer>
        </div>
      </aside>
    </>
  )
}
