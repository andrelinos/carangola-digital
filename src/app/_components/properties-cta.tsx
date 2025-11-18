import { Link } from '@/components/ui/link'

export function PropertiesCTA() {
  return (
    <section className="bg-linear-to-br from-slate-800 to-slate-900 py-16 text-white dark:from-slate-800 dark:to-slate-900">
      <div className="container mx-auto max-w-5xl px-4 text-center">
        <h2 className="mb-4 font-bold text-3xl md:text-4xl">
          Anuncie seu imóvel gratuitamente
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
          Venda ou alugue com facilidade. Espaço exclusivo para proprietários e
          corretores.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/imoveis/anunciar"
            className="h-12 bg-white font-semibold text-slate-700 shadow-md transition-transform hover:scale-105 hover:bg-gray-100 dark:bg-slate-100 dark:text-slate-800 dark:hover:bg-slate-200"
          >
            Anunciar grátis
          </Link>

          <Link
            href="/como-funciona"
            size="lg"
            variant="outline"
            className="h-12 border-2 border-white bg-transparent font-semibold text-white shadow-md transition-transform hover:scale-105 hover:bg-white hover:text-slate-700 dark:border-slate-300 dark:text-slate-100 dark:hover:bg-slate-100 dark:hover:text-slate-800"
          >
            Saber Mais
          </Link>
        </div>
      </div>
    </section>
  )
}
