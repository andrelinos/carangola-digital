// Você pode criar um componente em /app/(site)/como-funciona/page.tsx

import { Building, Home, Search, UserCheck } from 'lucide-react'

export default function ComoFuncionaPage() {
  return (
    <div className="bg-white dark:bg-slate-900">
      {/* Seção Hero */}
      <div className="bg-blue-600 text-white">
        <div className="container mx-auto max-w-5xl px-4 py-16 text-center">
          <h1 className="mb-4 font-bold text-4xl md:text-5xl">
            Como o Carangola Digital funciona?
          </h1>
          <p className="mx-auto max-w-2xl text-blue-100 text-lg">
            Conectamos você aos melhores estabelecimentos, serviços e imóveis de
            Carangola e região. Veja como é simples usar nossa plataforma.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl divide-y divide-slate-200 px-4 py-12 md:py-20 dark:divide-slate-700">
        {/*
          =============================================
          SEÇÃO 1: PARA O VISITANTE (CONSUMIDOR)
          =============================================
        */}
        <section className="py-12 md:py-16">
          <h2 className="mb-3 text-center font-bold text-3xl text-blue-900 dark:text-blue-200">
            Para Você, Visitante
          </h2>
          <p className="mb-12 text-center text-lg text-slate-600 dark:text-slate-400">
            Encontre o que precisa de forma rápida e fácil.
          </p>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {/* Bloco 1.1: Encontrando Negócios */}
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                <Building className="h-6 w-6" />
              </div>
              <h3 className="mb-3 font-semibold text-slate-800 text-xl dark:text-slate-100">
                Encontrando Estabelecimentos e Serviços
              </h3>
              <ol className="list-inside list-decimal space-y-3 text-slate-700 dark:text-slate-300">
                <li>
                  <strong>Busque:</strong> Use nossa pesquisa na página
                  "Estabelecimentos" para encontrar o que procura (Ex:
                  "Pizzaria", "Oficina").
                </li>
                <li>
                  <strong>Descubra:</strong> Veja uma lista de negócios, com
                  informações úteis como horário de funcionamento
                  (Aberto/Fechado).
                </li>
                <li>
                  <strong>Conecte-se:</strong> Clique no perfil para ver
                  detalhes completos, como descrição, telefones, WhatsApp e a
                  rota exata via GPS.
                </li>
              </ol>
            </div>

            {/* Bloco 1.2: Encontrando Imóveis */}
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                <Home className="h-6 w-6" />
              </div>
              <h3 className="mb-3 font-semibold text-slate-800 text-xl dark:text-slate-100">
                Encontrando Imóveis
              </h3>
              <ol className="list-inside list-decimal space-y-3 text-slate-700 dark:text-slate-300">
                <li>
                  <strong>Explore:</strong> Acesse a página "Imóveis" e procure
                  por casas, apartamentos e lotes para alugar ou vender.
                </li>
                <li>
                  <strong>Analise:</strong> Veja os detalhes do imóvel, como
                  preço, fotos, características (quartos, área) e descrição.
                </li>
                <li>
                  <strong>Negocie:</strong> Gostou? Clique em "Entrar em
                  contato" para falar diretamente com o proprietário ou corretor
                  responsável.
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/*
          =============================================
          SEÇÃO 2: PARA O ANUNCIANTE (NEGÓCIO)
          =============================================
        */}
        <section className="py-12 md:py-16">
          <h2 className="mb-3 text-center font-bold text-3xl text-blue-900 dark:text-blue-200">
            Para o seu Negócio ou Imóvel
          </h2>
          <p className="mb-12 text-center text-lg text-slate-600 dark:text-slate-400">
            Destaque-se para milhares de clientes em potencial.
          </p>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {/* Bloco 2.1: Anunciando seu Negócio */}
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400">
                <UserCheck className="h-6 w-6" />
              </div>
              <h3 className="mb-3 font-semibold text-slate-800 text-xl dark:text-slate-100">
                Cadastrando seu Estabelecimento
              </h3>
              <ol className="list-inside list-decimal space-y-3 text-slate-700 dark:text-slate-300">
                <li>
                  <strong>Comece Gratuitamente:</strong> Clique em "Começar
                  Gratuitamente" e crie sua conta na plataforma em poucos
                  minutos.
                </li>
                <li>
                  <strong>Crie seu Perfil:</strong> Adicione todas as
                  informações do seu negócio: foto de capa, descrição, tags de
                  serviço, horários e contatos.
                </li>
                <li>
                  <strong>Atraia Clientes:</strong> Seu perfil fica disponível
                  na busca. Acompanhe visualizações e cliques através do nosso
                  Analytics Detalhado.
                </li>
              </ol>
            </div>

            {/* Bloco 2.2: Anunciando seu Imóvel */}
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="mb-3 font-semibold text-slate-800 text-xl dark:text-slate-100">
                Anunciando seu Imóvel
              </h3>
              <ol className="list-inside list-decimal space-y-3 text-slate-700 dark:text-slate-300">
                <li>
                  <strong>Crie sua Conta:</strong> Faça seu cadastro como
                  usuário na plataforma.
                </li>
                <li>
                  <strong>Anuncie seu Imóvel:</strong> Acesse seu painel e
                  clique em "Anunciar seu imóvel". Preencha os dados: título,
                  preço, fotos, endereço e características.
                </li>
                <li>
                  <strong>Receba Contatos:</strong> Seu imóvel aparecerá nas
                  listagens. Pessoas interessadas entrarão em contato
                  diretamente com você.
                </li>
              </ol>
            </div>
          </div>
        </section>
      </div>

      {/* Seção CTA Final */}
      <div className="bg-slate-50 dark:bg-slate-800/50">
        <div className="container mx-auto max-w-5xl px-4 py-16 text-center">
          <h2 className="mb-4 font-bold text-3xl text-slate-900 dark:text-slate-100">
            Pronto para começar?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-slate-600 dark:text-slate-400">
            Quer você esteja procurando ou anunciando, o Carangola Digital é a
            sua plataforma.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/business" // Link para a busca de negócios
              className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700"
            >
              Encontrar um Estabelecimento
            </a>
            <a
              href="/imoveis" // Link para a busca de imóveis
              className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 shadow-md ring-1 ring-slate-300 ring-inset transition hover:bg-slate-100 dark:bg-slate-700 dark:text-white dark:ring-slate-600 dark:hover:bg-slate-600"
            >
              Procurar um Imóvel
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
