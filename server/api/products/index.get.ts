import { getProducts } from '#server/queries/products'
import { productsResponseSchema } from '#shared/api/schemas'

export default async function productsHandler() {
  const products = await getProducts()
  return productsResponseSchema.parse(products)
}
