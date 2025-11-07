import { Compass } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-100 px-4 py-12 font-sans dark:bg-slate-900">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg transition-colors duration-300 md:p-12 dark:border-slate-700 dark:bg-slate-800">
        {/* Ícone: Compass (Bússola) - mais semântico para "perdido" */}
        <Compass
          className="mx-auto h-16 w-16 text-indigo-600 dark:text-indigo-400"
          strokeWidth={1.5}
        />

        {/* O '404' com gradiente elegante */}
        <h1 className="mt-6 bg-linear-to-r from-indigo-500 to-blue-500 bg-clip-text font-black text-9xl text-transparent">
          404
        </h1>

        {/* Título */}
        <h2 className="mt-4 font-bold text-3xl text-slate-900 tracking-tight sm:text-4xl dark:text-slate-100">
          Página Não Encontrada
        </h2>

        {/* Descrição: Mais concisa e profissional */}
        <p className="mt-4 text-md text-slate-600 dark:text-slate-400">
          Parece que o link que você seguiu está quebrado ou a página foi
          removida.
        </p>
        <p className="mt-2 text-md text-slate-600 dark:text-slate-400">
          Mas não se preocupe, você pode voltar à página inicial ou tentar uma
          de nossas seções populares.
        </p>

        {/* Links de Ação com Hierarquia Visual (Primário e Secundários) */}
        <div className="mt-10 flex w-full flex-col gap-4 sm:flex-row sm:justify-center">
          {/* Ação Primária: Voltar à Home */}
          <Link
            href="/"
            className="hover:-translate-y-0.5 inline-block rounded-lg bg-indigo-600 px-6 py-3 font-medium text-lg text-white shadow-md transition-all duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
          >
            Página Inicial
          </Link>

          {/* Ação Secundária 1 */}
          <Link
            href="/business"
            className="hover:-translate-y-0.5 inline-block rounded-lg border border-indigo-300 px-6 py-3 font-medium text-indigo-700 text-lg transition-all duration-200 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-indigo-700 dark:text-indigo-300 dark:focus:ring-offset-slate-800 dark:hover:bg-slate-700"
          >
            Estabelecimentos
          </Link>

          {/* Ação Secundária 2 */}
          <Link
            href="/imoveis"
            className="hover:-translate-y-0.5 inline-block rounded-lg border border-blue-300 px-6 py-3 font-medium text-blue-700 text-lg transition-all duration-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-blue-700 dark:text-blue-300 dark:focus:ring-offset-slate-800 dark:hover:bg-slate-700"
          >
            Imóveis
          </Link>
        </div>
      </div>
    </main>
  )
}
