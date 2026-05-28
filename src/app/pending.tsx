import { useRouter } from 'next/router'

export default function PendingPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-100">
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
        <h1 className="font-bold text-2xl text-green-600">
          Pagamento Pendente! 🎉
        </h1>
        <p className="mt-4 text-gray-600">
          Obrigado por sua compra! Seu pagamento está pendente de confirmação.
        </p>
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="mt-6 rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
        >
          Voltar para o painel de controle
        </button>
      </div>
    </div>
  )
}
