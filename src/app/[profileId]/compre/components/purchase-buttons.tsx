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
          className={'w-full'}
          disabled={
            // plan.disable
            !['andrelinodev@gmail.com', 'andrelinoclientes@gmail.com'].includes(
              user?.email ?? ''
            )
          }
          variant={plan.buttonVariant}
          onClick={() =>
            createMercadoPagoCheckout({
              profileId: profileId,
              userEmail: user?.email,
              plan,
            })
          }
        >
          {plan.name === 'Grátis' ? plan.buttonText : plan?.buttonText}
        </Button>
      )}
    </div>
  )
}
