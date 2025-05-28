import 'next-auth'

declare module 'next-auth' {
  interface User {
    hasProfileLink: boolean
    emailVerified: string | Date | null
    favorites: string[]
    myProfileLink?: string
    accountVerified: boolean
  }

  interface Session {
    user: User
  }
}
