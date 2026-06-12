import { z } from 'zod'

export const healthResponseSchema = z.object({
  ok: z.literal(true),
})

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  summary: z.string(),
  description: z.string(),
  price: z.string(),
  accent: z.enum(['teal', 'coral', 'violet', 'lemon']),
  features: z.array(z.string()),
})

export const productsResponseSchema = z.array(productSchema)
export const productResponseSchema = productSchema.nullable()

export const userProfileResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  plan: z.string(),
  joinedAt: z.string(),
  preferences: z.array(z.string()),
})

export const recommendationSchema = z.object({
  id: z.string(),
  title: z.string(),
  reason: z.string(),
})

export const recommendationsResponseSchema = z.object({
  items: z.array(recommendationSchema),
})
