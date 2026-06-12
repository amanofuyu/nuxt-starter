import { getProducts } from '#server/queries/products'
import { getLocaleFromEvent } from '#server/utils/locale'
import { productsResponseSchema } from '#shared/api/schemas'

export default async function productsHandler(event: Parameters<typeof getLocaleFromEvent>[0]) {
  const locale = getLocaleFromEvent(event)
  const products = await getProducts(locale)
  return productsResponseSchema.parse(products)
}
