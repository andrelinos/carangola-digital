import type { PlanProps } from '@/_types/plan'
import { auth } from '@/lib/auth'
import mpClient from '@/lib/mercado-pago'
import { Preference } from 'mercadopago'
import { type NextRequest, NextResponse } from 'next/server'

interface RequestProps {
  profileId: string
  userEmail: string | null | undefined
  plan: PlanProps
}

export async function POST(req: NextRequest) {
  const { profileId, userEmail, plan } = (await req.json()) as RequestProps
  const session = await auth()

  if (!session || !profileId || !userEmail || !plan) {
    return NextResponse.error()
  }

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
          planType: plan.id,
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
          // Des-comente para desativar métodos de pagamento
          //   excluded_payment_methods: [
          //     {
          //       id: "bolbradesco",
          //     },
          //     {
          //       id: "pec",
          //     },
          //   ],
          //   excluded_payment_types: [
          //     {
          //       id: "debit_card",
          //     },
          //     {
          //       id: "credit_card",
          //     },
          //   ],
          installments: 12, // Número máximo de parcelas permitidas - calculo feito automaticamente
        },
        auto_return: 'approved',
        back_urls: {
          success: `${req.headers.get('origin')}/compra?status=sucesso`,
          failure: `${req.headers.get('origin')}/compra?status=falha`,
          pending: `${req.headers.get('origin')}/api/mercado-pago/pending`, // Criamos uma rota para lidar com pagamentos pendentes
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
    console.error(err)
    return NextResponse.error()
  }
}
