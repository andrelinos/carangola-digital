import { EmailDev } from '@/assets/email-dev'

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-6 font-semibold text-4xl">Fale Conosco</h1>

      <p className="mb-4 text-lg">
        Quer entrar em contato conosco? Envie uma mensagem usando nossas
        alternativas de contato. Estamos prontos para atender você!
      </p>

      <div className="mb-6 rounded-md bg-gray-100 p-4">
        <h2 className="mb-2 font-semibold text-2xl">
          Nossas informações de contato
        </h2>

        <ul className="list-none space-y-2">
          <li>
            📍 <strong>Cidade:</strong> Carangola/MG
          </li>
          <li>
            📸 <strong>Instagram Carangola Digital:</strong>{' '}
            <a
              className="text-blue-500 hover:underline"
              href="https://instagram.com/carangoladigital"
              target="_blank"
              rel="noreferrer"
            >
              @carangoladigital
            </a>
          </li>
          <p className="mt-8 font-bold text-xl">Desenvolvedor </p>
          <li>
            📧 <strong>E-mail:</strong> <EmailDev />
          </li>
          <li>
            📸 <strong>Instagram:</strong>{' '}
            <a
              className="text-blue-500 hover:underline"
              href="https://instagram.com/andrelinossilva"
              target="_blank"
              rel="noreferrer"
            >
              @andrelinossilva
            </a>
          </li>

          <li>
            🔗 <strong>Linkedin:</strong>{' '}
            <a
              className="text-blue-500 hover:underline"
              href="https://www.linkedin.com/in/andrelinosilva"
              target="_blank"
              rel="noreferrer"
            >
              in/andrelinosilva
            </a>
          </li>
          <li>
            🐙 <strong>Github:</strong>{' '}
            <a
              className="text-blue-500 hover:underline"
              href="https://github.com/andrelinos"
              target="_blank"
              rel="noreferrer"
            >
              andrelinos
            </a>
          </li>
          <li>
            🌐 <strong>Site:</strong>{' '}
            <a
              className="text-blue-500 hover:underline"
              href="https://andrelino.dev"
              target="_blank"
              rel="noreferrer"
            >
              andrelino.dev
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}
