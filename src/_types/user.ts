export interface UserProps {
  name: string
  email: string
  image: string
  emailVerified: string | Date | null
  favorites: string[]
  plan?: typeProps
}

export type typeProps = 'free' | 'basic' | 'pro' | 'master'
