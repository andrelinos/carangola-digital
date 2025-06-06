import { Link } from '@/components/ui/link'
import { Instagram } from 'iconoir-react'
import Image from 'next/image'

export function Footer() {
  return (
    <div className="flex w-full flex-col items-center bg-zinc-700">
      <div className="flex w-full max-w-screen-xl flex-wrap px-4 py-10">
        <div className="w-fit pb-16">
          <Link
            variant="ghost"
            href="/"
            className="flex w-fit items-center justify-center gap-2"
          >
            <Image
              width={80}
              height={80}
              className="max-h-14 lg:max-h-16"
              src="/logo-blue.svg"
              alt="Logo Carangola Digital"
            />
            <h2 className="max-w-[90px] text-wrap text-left font-bold text-white opacity-90 lg:text-xl">
              Carangola Digital
            </h2>
          </Link>
        </div>
        <div className="flex flex-1 flex-wrap px-4 text-white md:justify-end">
          <div>
            <h2 className="px-3 font-bold text-xl">Links rápidos</h2>
            <div className="flex flex-col gap-2">
              <Link variant="footer" href="/sobre-nos">
                Sobre nós
              </Link>
              <Link variant="footer" href="/contato">
                Fale conosco
              </Link>
              <Link variant="footer" href="/policita-de-privacidade">
                Política de privacidade
              </Link>

              <Link variant="footer" href="/termos-de-uso">
                Termos de uso
              </Link>
            </div>
          </div>
          <div>
            <h2 className="px-3 font-bold text-xl">Redes sociais</h2>
            <div className="flex flex-col gap-2">
              <Link
                variant="footer"
                href="https://instagram.com/carangoladigital"
                className="flex gap-2"
                target="_blank"
              >
                <Instagram /> Instagram
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-32 w-full max-w-screen-xl items-center justify-center text-sm text-zinc-200">
        Desenvolvido com 💜 por{' '}
        <Link
          variant="footer"
          href="https://andrelino.dev/"
          target="_blank"
          className="ml-1 p-0"
        >
          Andrelino Silva
        </Link>
      </div>
    </div>
  )
}
