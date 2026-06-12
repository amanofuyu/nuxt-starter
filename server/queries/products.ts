import { getMockProductById, listMockProducts } from '#server/mocks/products'

export async function getProducts() {
  return listMockProducts()
}

export async function getProduct(id: string) {
  return getMockProductById(id)
}
