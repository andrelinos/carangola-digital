import { Link } from '@/components/ui/link'
import { Instagram } from 'iconoir-react'
import Image from 'next/image'

export function Footer() {
  return (
    <div className="flex w-full justify-center bg-zinc-700">
      <div className="flex w-full max-w-screen-xl px-4 py-10">
        <div className="w-fit">
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
        <div className="flex flex-1 justify-end px-4 text-white">
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
              <Link variant="footer" href="/" className="flex gap-2">
                <Instagram /> Instagram
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
