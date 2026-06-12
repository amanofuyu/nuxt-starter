import { getProduct } from '#server/queries/products'
import { getLocaleFromEvent } from '#server/utils/locale'
import { productResponseSchema } from '#shared/api/schemas'

interface ProductEvent {
  context?: {
    params?: {
      id?: string
    }
  }
  node?: {
    req?: {
      url?: string
    }
  }
}

export default async function productHandler(event: ProductEvent) {
  const locale = getLocaleFromEvent(event)
  const id = event.context?.params?.id

  if (!id) {
    return productResponseSchema.parse(null)
  }

  const product = await getProduct(id, locale)
  return productResponseSchema.parse(product)
}
