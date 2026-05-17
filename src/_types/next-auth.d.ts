import type { AsaasSubscriptionStatus } from './asaas'

declare module 'next-auth' {
  interface User {
    id: string
    email: string
    emailVerified: string | Date | null
    hasProfileLink?: boolean
    favorites?: string[]
    myProfileLink?: string
    accountVerified?: boolean
    role?: 'admin' | 'user' | 'moderator'
    planActive?: {
      profiles?: {
        expiresAt: number | null
        type: string
        status: string
        planDetails: {
          name: string
          period: string
          price: number
        }
      }
      properties?: {
        expiresAt: number | null
        type: string
        status: string
        planDetails: {
          name: string
          period: string
          price: number
        }
      }
    }
    // Campos Asaas
    asaasCustomerId?: string | null
    asaasSubscriptionId?: string | null
    asaasSubscriptionStatus?: AsaasSubscriptionStatus | null
    planExpiresAt?: number | null
  }

  interface Session {
    user: User
  }
}
