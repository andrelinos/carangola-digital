import { Preference } from 'mercadopago'
import { type NextRequest, NextResponse } from 'next/server'

import type { PlanProps } from '@/_types/plan'
import { authOptions } from '@/lib/auth'
import mpClient from '@/lib/mercado-pago'
import { getServerSession } from 'next-auth/next'

interface RequestProps {
  profileId: string
  userEmail: string | null | undefined
  plan: PlanProps
}

export async function POST(req: NextRequest) {
  const { profileId, userEmail, plan } = (await req.json()) as RequestProps
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!session || !profileId || !userEmail || !plan) {
    return NextResponse.error()
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const userId = session.user.id

  try {
    const preference = new Preference(mpClient)

    const createdPreference = await preference.create({
      body: {
        external_reference: profileId,
        metadata: {
          profileId,
          userEmail,
          userId,

          plan: {
            type: plan.id,
            name: plan.name,
            period: plan.period,
            price: plan.price,
          },

          //etc
        },
        ...(userEmail && {
          payer: {
            email: userEmail,
          },
        }),

        items: [
          {
            id: plan.id,
            title: plan.name,
            quantity: 1,
            unit_price: plan.price,
            currency_id: 'BRL',
            category_id: 'digital_product',
            // Recomendado inserir, mesmo que não tenha categoria - Aumenta a pontuação da sua integração com o Mercado Pago
          },
        ],
        payment_methods: {
          installments: 3,
        },
        auto_return: 'approved',
        back_urls: {
          success: `${siteUrl}/compra?status=sucesso`,
          failure: `${siteUrl}/compra?status=falha`,
          pending: `${siteUrl}/compra?status=pendente`,
        },
      },
    })

    if (!createdPreference.id) {
      throw new Error('No preferenceID')
    }

    return NextResponse.json({
      preferenceId: createdPreference.id,
      initPoint: createdPreference.init_point,
    })
  } catch (err) {
    console.error('ERROR :: ', err)
    return NextResponse.error()
  }
}
