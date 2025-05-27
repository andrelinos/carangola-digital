export interface UserProps {
  name: string
  email: string
  image: string
  emailVerified: string | Date | null
  favorites: string[]
}
