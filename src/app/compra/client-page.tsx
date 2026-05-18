'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface CompraClientProps {
  status?: string
}

export default function CompraClient({
  status: initialStatus,
}: CompraClientProps) {
  const searchParams = useSearchParams()

  // Pegamos a string limpa diretamente (ex: "sucesso" ou "cancelado")
  const currentStatus = initialStatus || searchParams.get('status') || ''

  // Pegamos o gateway também (opcional, mas legal para usar na interface)
  const gateway = searchParams.get('gateway')

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <div className='w-full max-w-md space-y-6 rounded-[2.5rem] border border-slate-100 bg-white p-8 text-center shadow-slate-200/50 shadow-xl'>
        {currentStatus === 'sucesso' ? (
          <>
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-green-100">
              <span className="text-4xl">✅</span>
            </div>
            <h1 className='font-black text-2xl text-slate-900 uppercase tracking-tight'>
              Assinatura Confirmada!
            </h1>
            <p className="font-medium text-slate-500">
              Obrigado por escolher nosso serviço! Seu pagamento foi processado
              com sucesso pelo
              <span className="font-bold text-slate-700 capitalize">
                {' '}
                {gateway || 'nosso sistema'}
              </span>
              .
            </p>
          </>
        ) : currentStatus === 'cancelado' || currentStatus === 'falha' ? (
          <>
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-red-100">
              <span className="text-4xl">❌</span>
            </div>
            <h1 className='font-black text-2xl text-slate-900 uppercase tracking-tight'>
              Pagamento Não Concluído
            </h1>
            <p className="font-medium text-slate-500">
              A transação foi cancelada ou ocorreu um erro no processamento.
              Você pode voltar e tentar novamente.
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-slate-100">
              <span className="text-4xl">⚠️</span>
            </div>
            <h1 className='font-black text-2xl text-slate-900 uppercase tracking-tight'>
              Status Desconhecido
            </h1>
            <p className="font-medium text-slate-500">
              Não conseguimos identificar o status da sua compra agora. Caso
              tenha feito o pagamento, verifique seu email.
            </p>
          </>
        )}

        <div className="pt-6">
          <Link href="/">
            <button type='button' className='h-14 w-full rounded-2xl bg-primary font-black text-white text-xs uppercase tracking-widest transition-all hover:scale-[1.02] hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30'>
              Voltar para o Início
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
