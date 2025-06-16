export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h1 className="mb-4 font-bold text-9xl text-gray-800">404</h1>
      <h2 className="mb-6 font-semibold text-2xl">Página não encontrada</h2>
      <p className="mb-6 text-gray-500">
        Parece que você chegou a um lugar que não existe.
      </p>
      <a
        href="/"
        className="transform rounded-md bg-blue-500 px-4 py-2 font-semibold text-gray-100 transition hover:scale-105 hover:bg-blue-600"
      >
        Voltar para a Home
      </a>
    </div>
  )
}
