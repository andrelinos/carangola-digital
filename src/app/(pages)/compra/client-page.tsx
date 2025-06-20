'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

interface CompraClientProps {
  status?: string
}

export default function CompraClient({
  status: initialStatus,
}: CompraClientProps) {
  // Se você desejar que o valor venha tanto do servidor quanto do client,
  // pode combinar o prop inicial com o hook
  const searchParams = useSearchParams()
  const status = initialStatus || searchParams.get('status') || ['']

  const [success, approved] = status

  useEffect(() => {
    console.log('Client-side status:', status)
  }, [status])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
        <h1 className="font-bold text-2xl">
          {success === 'sucesso' && '✅ Pagamento Confirmado!'}
          {success === 'falha' && '❌ Pagamento Falhou!'}
        </h1>

        <p className="mt-4 text-gray-600">
          {success === 'sucesso'
            ? 'Obrigado por sua compra! Seu pagamento foi processado com sucesso.'
            : success === 'falha'
              ? 'O pagamento não foi concluído. Tente novamente ou escolha outra forma de pagamento.'
              : 'Status desconhecido.'}
        </p>
        <Link href="/">Voltar para o início</Link>
      </div>
    </div>
  )
}
