import type { SupportedLocale } from '#shared/i18n/locales'

import { getMockProductById, listMockProducts } from '#server/mocks/products'

export async function getProducts(locale: SupportedLocale) {
  return listMockProducts(locale)
}

export async function getProduct(id: string, locale: SupportedLocale) {
  return getMockProductById(id, locale)
}
