export interface Product {
  id: string
  name: string
  summary: string
  description: string
  price: string
  accent: 'teal' | 'coral' | 'violet' | 'lemon'
  features: string[]
}
