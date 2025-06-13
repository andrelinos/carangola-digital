import { Link } from '@/components/ui/link'

export default function AboutUs() {
  return (
    <section className="mx-auto flex max-w-4xl flex-col px-4 py-12">
      <h1 className="mb-6 font-semibold text-4xl">
        Sobre o Carangola Digital🌟
      </h1>

      <p className="mb-4 text-lg">
        Bem-vindo ao <span className="font-semibold">Carangola Digital</span>, a
        plataforma criada para aproximar o
        <strong> comércio de Carangola/MG </strong>da população. Nossa missão é
        dar
        <span className="font-semibold"> visibilidade</span>,{' '}
        <span className="font-semibold">conveniência</span> e
        <span className="font-semibold"> fortalecer a economia local</span>.
      </p>

      <h2 className="mt-6 mb-4 font-semibold text-2xl">Como funciona?</h2>

      <ul className="mb-4 list-inside list-none space-y-2">
        <li>
          ✅ Com o Carangola Digital, os estabelecimentos da cidade podem se{' '}
          <strong>cadastrar gratuitamente</strong>.
        </li>
        <li>
          ✅ Eles recebem uma <strong>página de perfil personalizada</strong>,
          como:
          <br />
          <code className="pl-6">
            https://carangoladigital.com.br/nome-estabelecimento
          </code>
          <br />{' '}
          <p
            className="bg-zinc-100 pl-6"
            title="Exemplo de link de um estabelecimento"
          >
            Exemplo:
            <Link variant="ghost" href="/andrelino">
              https://carangoladigital.com.br/andrelino
            </Link>
          </p>
        </li>
        <li>
          ✅ A partir dessa página, o negócio consegue exibir:
          <ul className="mt-2 ml-6 list-inside list-decimal space-y-1">
            <li>Foto do estabelecimento</li>
            <li>Horário de funcionamento</li>
            <li>Telefone de contato</li>
            <li>WhatsApp</li>
            <li>Redes Sociais</li>
            <li>Endereço</li>
            <li>Uma descrição detalhada</li>
          </ul>
        </li>
      </ul>

      <p className="mb-4">
        Assim, moradores e visitantes da cidade têm acesso a uma{' '}
        <strong>lista organizada e cheia de informações</strong>, que fortalece
        o <strong>comércio local</strong> e fortalece nossa comunidade.
      </p>

      <h2 className="mt-6 mb-4 font-semibold text-2xl">Uma nova jornada</h2>

      <p className="mb-4">
        Atualmente o serviço é gratuito para todos, porém algumas{' '}
        <strong>funcionalidades especiais</strong> serão implementadas no futuro
        como parte de um <strong>plano pago</strong>, destinado às empresas que
        desejarem dar um <strong>destaque maior ao seu negócio</strong>.
      </p>

      <p>
        Dessa forma, o <strong>Carangola Digital</strong> consegue continuar
        melhorando, compartilhando ainda mais valor para todos.
      </p>

      <Link
        variant="default"
        href="/"
        className="mt-6 ml-auto max-w-xs rounded-md px-6 text-white"
      >
        Voltar para a página inicial
      </Link>
    </section>
  )
}
