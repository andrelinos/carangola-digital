import Link from 'next/link'

export default function VerifyRequest() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-zinc-800/20 dark:bg-zinc-800">
      <span className="mb-8 max-w-40 overflow-hidden">
        <span>me.bio</span>
      </span>
      <div className="flex max-w-sm flex-col gap-6 rounded-lg border border-muted bg-zinc-950/20 p-8 shadow-lg dark:bg-zinc-950 dark:text-white">
        <h2 className="text-center text-3xl">Verifique seu e-mail</h2>
        <p className="text-lg">
          Foi enviado um link de acesso para o seu endereço de e-mail.
        </p>
        <Link
          href={process.env?.NEXT_PUBLIC_BASE_URL || ''}
          className="text-center hover:text-orange-600 dark:hover:text-blue-400"
        >
          {process.env?.NEXT_PUBLIC_BASE_URL || ''}
        </Link>
      </div>
    </div>
  )
}
