export interface PlanProps {
  id: string
  name: string
  price: number
  period: string
  popular: boolean
  features: string[]
  buttonText: string
  buttonVariant: 'default' | 'outline'
  cardClass: string
}
