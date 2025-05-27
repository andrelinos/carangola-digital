import { manageAuth } from '@/actions/manage-auth'
import { LogoLight } from '@/assets/Logos/Logo/LogoLight'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Link } from '@/components/ui/link'
import { auth } from '@/lib/auth'

export default async function Home() {
  const session = await auth()

  return (
    <>
      <Header />
      <div className="min-h-screen w-full py-36">
        <div className="flex w-full flex-col items-center pt-28">
          <LogoLight />
          <h1 className="mt-10 max-w-2xl text-center font-bold text-5xl">
            Encontre em compartilhe estabelecimentos e serviços
          </h1>
          <p className="my-4 max-w-2xl text-center">
            Estamos aqui para facilitar a sua vida em Carangola — conectando
            você com o que precisa e ajudando a compartilhar de forma simples e
            rápida.
          </p>

          {session ? (
            <Link href="/criar" className="w-full max-w-xs bg-orange-500">
              Anuncie2
            </Link>
          ) : (
            <form action={manageAuth} className="w-full max-w-xs">
              <Button className="w-full bg-orange-500">Anuncie</Button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
