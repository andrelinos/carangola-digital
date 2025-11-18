import { Link } from '@/components/ui/link'

export function BusinessCTA() {
  return (
    <section className="mb-4 bg-linear-to-br from-blue-700 to-blue-800 py-16 text-white dark:from-blue-800 dark:to-blue-900">
      <div className="container mx-auto max-w-5xl px-4 text-center">
        <h2 className="mb-4 font-bold text-3xl md:text-4xl">
          Seu negócio merece ser visto
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-blue-100 text-lg">
          Aumente sua presença digital. Cadastre sua empresa e conecte-se
          facilmente com quem procura seus serviços.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/dashboard/business?action=anunciar"
            size="lg"
            className="bg-white font-semibold text-blue-700 shadow-md transition-transform hover:scale-105 hover:bg-gray-100 dark:bg-slate-100 dark:text-blue-800 dark:hover:bg-slate-200"
          >
            Anunciar grátis
          </Link>

          <Link
            href="/como-funciona"
            size="lg"
            variant="outline"
            className="border-2 border-white bg-transparent font-semibold text-white shadow-md transition-transform hover:scale-105 hover:bg-white hover:text-blue-700 dark:border-slate-300 dark:text-slate-100 dark:hover:bg-slate-100 dark:hover:text-blue-800"
          >
            Saber Mais
          </Link>
        </div>
      </div>
    </section>
  )
}
