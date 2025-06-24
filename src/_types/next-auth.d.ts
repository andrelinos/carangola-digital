import 'next-auth'

declare module 'next-auth' {
  interface User {
    hasProfileLink?: boolean
    emailVerified: string | Date | null
    favorites?: string[]
    myProfileLink?: string
    accountVerified?: boolean
    role?: 'admin' | 'user' | 'moderator'
  }

  interface Session {
    user: User
  }
}
