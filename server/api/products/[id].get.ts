import { getProduct } from '#server/queries/products'
import { productResponseSchema } from '#shared/api/schemas'

interface ProductEvent {
  context?: {
    params?: {
      id?: string
    }
  }
}

export default async function productHandler(event: ProductEvent) {
  const id = event.context?.params?.id

  if (!id) {
    return productResponseSchema.parse(null)
  }

  const product = await getProduct(id)
  return productResponseSchema.parse(product)
}
