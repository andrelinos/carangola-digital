'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import clsx from 'clsx'
import { useState } from 'react'
// Importe o tipo do seu array de planos
import type { plansArray } from '../../page'

// Define o tipo de um único plano
export type PlanItemProps = (typeof plansArray)[number] & {
  price: string
  frequency: string
  features: string[]
}

interface ManagePlansProps {
  plans: PlanItemProps[]
}

export function ManagePlans({ plans }: ManagePlansProps) {
  // Armazena o plano selecionado para abrir o modal correto
  const [selectedPlan, setSelectedPlan] = useState<PlanItemProps | null>(null)

  function handleCloseModal() {
    setSelectedPlan(null)
  }

  function handleConfirmPlan() {
    if (selectedPlan) {
      // Lógica para confirmar o plano (ex: redirecionar para pagamento, API call)
      console.log(`Plano ${selectedPlan.title} confirmado!`)
      alert(`Você escolheu o plano: ${selectedPlan.title}! 🎉`)
      handleCloseModal() // Fecha o modal após a confirmação
    }
  }

  return (
    <>
      {/* Container principal com padding e layout responsivo */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        {/* Grid responsivo:
          - 1 coluna em telas pequenas (padrão)
          - 2 colunas em telas médias (md)
          - 3 colunas em telas grandes (lg)
        */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans?.map(plan => (
            <Card
              key={plan.name}
              className={clsx(
                'relative flex flex-col shadow-lg transition-all duration-300 hover:shadow-xl', // Adicionado flex-col
                {
                  'border-2 border-blue-600 bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-950':
                    plan?.popular,
                  border: !plan?.popular,
                }
              )}
            >
              {/* Badge de "Popular" */}
              {plan?.popular && (
                <span className="-top-3.5 -translate-x-1/2 absolute left-1/2 w-fit transform rounded-full bg-blue-600 px-4 py-1 font-bold text-sm text-white shadow-md">
                  Popular
                </span>
              )}

              <CardHeader className="pt-8">
                <CardTitle className="font-bold text-2xl">
                  {plan.title}
                </CardTitle>
                {/* Preço destacado */}
                <div className="flex items-baseline gap-1 pt-2">
                  <span className="font-extrabold text-4xl tracking-tight">
                    {plan.price}
                  </span>
                  <span className="font-medium text-muted-foreground text-sm">
                    {plan.frequency}
                  </span>
                </div>
                <CardDescription className="pt-1">
                  {/* Você pode usar a descrição do plano aqui, se houver */}
                  Escolha o plano de acordo com sua necessidade.
                </CardDescription>
              </CardHeader>

              {/* flex-grow força este conteúdo a empurrar o footer para baixo */}
              <CardContent className="grow">
                <p className="mb-4 font-medium text-sm">Incluso neste plano:</p>
                {/* Lista de Recursos (Features) */}
                <ul className="space-y-2 text-sm">
                  {/* Aqui, estou imaginando que você teria um array 'features' no seu plano.
                    Se preferir, pode voltar a listar manualmente como abaixo.
                  */}
                  <li className="flex items-center gap-2">
                    <span className="font-bold text-blue-500">✓</span>
                    <span className="text-muted-foreground">
                      {plan.addresses.quantity} Endereços
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="font-bold text-blue-500">✓</span>
                    <span className="text-muted-foreground">
                      {plan.businessPhones.quantity} Telefones
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="font-bold text-blue-500">✓</span>
                    <span className="text-muted-foreground">
                      {plan.activeSocialMedias
                        ? `${plan.activeSocialMedias} Links de Redes Sociais`
                        : 'Sem Redes Sociais'}
                    </span>
                  </li>
                  {/* Adicione mais recursos conforme necessário */}
                  {plan?.name !== 'free' && (
                    <li className="flex items-center justify-center gap-2">
                      <span className="font-bold text-blue-500">✓</span>
                      Galeria de fotos
                    </li>
                  )}
                </ul>
              </CardContent>

              {/* O Footer agora ficará sempre alinhado na parte inferior */}
              <CardFooter>
                <Button
                  onClick={() => setSelectedPlan(plan)} // Passa o plano selecionado
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  Escolher {plan.title}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* O Modal agora é controlado pela existência de 'selectedPlan'.
        O 'setIsOpen' é usado para fechar (definindo selectedPlan como null).
      */}
      <Dialog open={!!selectedPlan} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center font-bold text-2xl text-blue-700 dark:text-blue-400">
              Confirmar Escolha de Plano
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Você está prestes a escolher o plano:
            </DialogDescription>
          </DialogHeader>

          {selectedPlan && (
            <div className="py-4 text-center">
              <h2 className="font-extrabold text-4xl text-gray-900 dark:text-gray-100">
                {selectedPlan.title}
              </h2>
              <p className="mt-2 font-bold text-3xl text-blue-600 dark:text-blue-400">
                {selectedPlan.price}
                <span className="font-medium text-lg text-muted-foreground">
                  {selectedPlan.frequency}
                </span>
              </p>

              <div className="mt-6 border-t pt-4">
                <p className="font-semibold text-gray-700 dark:text-gray-300">
                  Benefícios Inclusos:
                </p>
                <ul className="mt-2 space-y-1 text-muted-foreground text-sm">
                  <li className="flex items-center justify-center gap-2">
                    <span className="font-bold text-blue-500">✓</span>
                    {selectedPlan?.addresses.quantity} Endereços
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <span className="font-bold text-blue-500">✓</span>
                    {selectedPlan?.businessPhones?.quantity} Telefones
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <span className="font-bold text-blue-500">✓</span>
                    {selectedPlan?.activeSocialMedias
                      ? `${selectedPlan?.activeSocialMedias} Links de redes sociais`
                      : 'Sem Redes Sociais'}
                  </li>
                  {selectedPlan?.name !== 'free' && (
                    <li className="flex items-center justify-center gap-2">
                      <span className="font-bold text-blue-500">✓</span>
                      Galeria de fotos
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              variant="outline"
              onClick={handleCloseModal}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmPlan}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 sm:w-auto"
            >
              Confirmar e Prosseguir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
