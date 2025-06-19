'use client'

import { useMercadoPago } from '@/hooks/use-mercado-pago'
import type { Session } from 'next-auth'

interface Props {
  profileId: string
  user: Session['user'] | undefined
}

export function PurchaseButtons({ profileId, user }: Props) {
  const { createMercadoPagoCheckout } = useMercadoPago()

  return (
    <div className="flex">
      <button
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
      </button>
    </div>
  )
}
