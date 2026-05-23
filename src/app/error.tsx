'use client'

import { useEffect } from 'react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Aqui você pode logar o erro em um serviço externo (Sentry, Datadog, etc)
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
      <h2 className="font-bold text-2xl text-red-600">Ops! Algo deu errado.</h2>
      <p className="text-gray-600">
        Não foi possível carregar os dados no momento.
      </p>
      <button
        onClick={() => reset()}
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Tentar novamente
      </button>
    </div>
  )
}
