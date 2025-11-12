// --- Definições de Tipo (Opcional, mas recomendado) ---
// Você pode colocar isso em um arquivo .d.ts ou no topo do seu .ts

interface PlanActive {
  id: number
  type: string
  expiresAt: number // Timestamp em milissegundos
  transactionAmount: number
  currency: string
  // ...outras propriedades do plano
}

interface UserData {
  name?: string | null
  email?: string | null
  image?: string | null
  id?: string
  planActive: PlanActive
  accountVerified: boolean
  hasProfileLink: boolean
  role?: string // pode ser undefined
  myProfileLink: string
  favorites: string[]
}

interface PlanStatus {
  planType: string
  expiresIn: string // Tempo restante formatado (ex: "em 10 dias")
  status: boolean // true = ativo, false = expirado
  transactionAmount: number
  currency: string
  hasProfileLink: boolean
  role: string | undefined
  myProfileLink: string
}

// --- A Função Principal ---

/**
 * Processa os dados de um usuário para retornar o status do seu plano.
 * @param user Os dados completos do usuário.
 * @returns Um objeto com o status do plano formatado.
 */
export function getPlanStatus(user: UserData): PlanStatus {
  const { planActive, hasProfileLink, role, myProfileLink } = user
  const now = Date.now()

  // --- Valores Padrão (Caso o usuário não tenha plano / seja 'free') ---
  let planType = 'free'
  let expiresIn = 'N/A'
  let status = false // Status do plano *pago*
  let transactionAmount = 0
  let currency = 'BRL' // Moeda padrão

  // --- Se o usuário tiver um registro de plano ativo ---
  if (planActive) {
    const expiresAt = planActive.expiresAt

    // 1. Calcula o status (true se a data de expiração for no futuro)
    const isActive = expiresAt > now

    // 2. Preenche os dados com base no planActive
    planType = planActive.type || 'free'
    transactionAmount = planActive.transactionAmount || 0
    currency = planActive.currency || 'BRL'
    status = isActive

    // 3. Calcula o tempo restante (expiresIn)
    if (isActive) {
      const remainingMilliseconds = expiresAt - now
      const remainingDays = Math.round(
        remainingMilliseconds / (1000 * 60 * 60 * 24)
      )

      // Usamos Intl.RelativeTimeFormat para formatar ("em 5 dias", "amanhã", etc.)
      const rtf = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })

      if (remainingDays > 0) {
        expiresIn = rtf.format(remainingDays, 'day')
      } else {
        // Menos de um dia, mostrar em horas
        const remainingHours = Math.round(
          remainingMilliseconds / (1000 * 60 * 60)
        )
        if (remainingHours > 0) {
          expiresIn = rtf.format(remainingHours, 'hour')
        } else {
          // Menos de uma hora, mostrar em minutos
          const remainingMinutes = Math.round(
            remainingMilliseconds / (1000 * 60)
          )
          expiresIn = rtf.format(remainingMinutes, 'minute')
        }
      }
    } else {
      expiresIn = 'Expirado'
    }
  }

  // --- Retorna o objeto final ---
  return {
    planType,
    expiresIn,
    status,
    transactionAmount,
    currency,
    hasProfileLink,
    role,
    myProfileLink,
  }
}
