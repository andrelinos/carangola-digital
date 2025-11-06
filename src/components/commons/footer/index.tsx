import { menus } from '@/assets/data/menu-data'
import { Link } from '@/components/ui/link'
import { Instagram } from 'iconoir-react'
import Image from 'next/image'
import { FooterByDevNameTitle } from '../footer-by-dev-name-title'

export function Footer() {
  return (
    <>
      <div className="mt-16 flex w-full flex-col items-center bg-blue-950">
        <div className="w-full max-w-7xl px-4 py-10 lg:px-8">
          {/* Estrutura principal: Logo | Seção de Links */}
          <div className="flex flex-col gap-10 md:flex-row md:justify-between">
            {/* 1. Seção do Logo */}
            <div className="w-full shrink-0 md:w-auto">
              <Link
                variant="ghost"
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
                <h2 className="max-w-[100px] text-wrap text-left font-bold text-blue-100 opacity-90 lg:text-xl">
                  Carangola Digital
                </h2>
              </Link>
            </div>

            {/* 2. Wrapper dos Links (Links Rápidos + Redes Sociais) */}
            <div className="flex flex-1 flex-col gap-10 sm:flex-row sm:justify-between md:justify-end md:gap-16">
              {/* 2a. Links Rápidos */}
              <div className="flex-1 sm:max-w-md">
                <h2 className="font-bold text-white text-xl">Links rápidos</h2>
                {/* Links unificados em um só container */}
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
                  {menus.map(menu => (
                    <Link
                      variant="footer"
                      key={menu.title}
                      href={menu.href}
                      className="text-blue-200 transition-colors hover:text-white"
                    >
                      {menu.title}
                    </Link>
                  ))}
                  {/* Links de Política e Termos movidos para cá */}
                  <Link
                    variant="footer"
                    href="/policita-de-privacidade"
                    className="text-blue-200 transition-colors hover:text-white"
                  >
                    Política de privacidade
                  </Link>
                  <Link
                    variant="footer"
                    href="/termos-de-uso"
                    className="text-blue-200 transition-colors hover:text-white"
                  >
                    Termos de uso
                  </Link>
                </div>
              </div>

              {/* 2b. Redes Sociais */}
              <div className="w-full sm:w-auto">
                <h2 className="font-bold text-white text-xl">Redes sociais</h2>
                <div className="mt-4 flex flex-col gap-3">
                  <Link
                    variant="footer"
                    href="https://instagram.com/carangoladigital"
                    className="flex items-center gap-2 text-blue-200 transition-colors hover:text-white"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Instagram className="h-5 w-5" /> Instagram
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Componente "Desenvolvido por" fica fora do max-w-7xl para centralizar na página */}
        <FooterByDevNameTitle />
      </div>
    </>
  )
}
