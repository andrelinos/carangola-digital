'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface HomeProps {
  searchParams: {
    status?: string
  }
}

export default function Buy() {
  const router = useRouter()

  const searchParams = useSearchParams()

  const status = searchParams.get('status')

  console.log('MELECA ::: ', status)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
        <h1 className="font-bold text-2xl">
          {status === 'sucesso' && '✅ Pagamento Confirmado!'}
          {status === 'falha' && '❌ Pagamento Falhou!'}
        </h1>

        <p className="mt-4 text-gray-600">
          {status === 'sucesso' &&
            'Obrigado por sua compra! Seu pagamento foi processado com sucesso.'}
          {status === 'falha' &&
            'O pagamento não foi concluído. Tente novamente ou escolha outra forma de pagamento.'}
        </p>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="mt-6 rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
        >
          Voltar para o início
        </button>
      </div>
    </div>
  )
}
