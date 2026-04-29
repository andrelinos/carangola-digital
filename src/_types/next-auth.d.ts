import 'next-auth'

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
  }

  interface Session {
    user: User
  }
}
