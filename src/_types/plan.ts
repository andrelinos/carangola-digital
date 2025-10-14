export interface PlanProps {
  id: string
  name: string
  price: number
  period: string
  popular: boolean
  disable: boolean
  features: string[]
  buttonText: string
  buttonVariant: 'default' | 'outline' | 'secondary'
  cardClass: string
}
