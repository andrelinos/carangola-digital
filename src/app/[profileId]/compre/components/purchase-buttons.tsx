'use client'

import type { Session } from 'next-auth'

import type { PlanProps } from '@/_types/plan'

import { Button } from '@/components/ui/button'
import { Link } from '@/components/ui/link'
import { useMercadoPago } from '@/hooks/use-mercado-pago'

interface Props {
  profileId: string | undefined
  user: Session['user'] | undefined
  plan?: PlanProps
}

export function PurchaseButtons({
  profileId,
  user,
  plan = {} as PlanProps,
}: Props) {
  const { createMercadoPagoCheckout } = useMercadoPago()

  return (
    <div className="flex">
      {plan.name === 'Grátis' ? (
        <Link
          href="/criar"
          className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-gray-800"
        >
          Começar Grátis
        </Link>
      ) : (
        <Button
          className={`w-full ${
            plan.name === 'Grátis'
              ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-gray-800'
              : plan.name === 'Pro'
                ? 'bg-white text-gray-900 hover:bg-gray-100'
                : 'bg-primary text-white hover:bg-blue-700'
          }`}
          disabled={
            !['andrelinodev@gmail.com', 'andrelinoclientes@gmail.com'].includes(
              user?.email ?? ''
            )
          }
          variant={plan.buttonVariant}
          onClick={() =>
            createMercadoPagoCheckout({
              testeId: { profileId },
              userEmail: user?.email,
              plan,
            })
          }
        >
          {plan.name === 'Grátis' ? plan.buttonText : 'Em breve...'}
        </Button>
      )}
      {/* <button
        type="button"
        onClick={() =>
          createMercadoPagoCheckout({
            testeId: { profileId },
            userEmail: user?.email,
          })
        }
        className="rounded-md bg-blue-500 px-4 py-2 text-white"
      >
        Comprar 1
      </button> */}
    </div>
  )
}
