import type { SupportedLocale } from '#shared/i18n/locales'

import { getMockCurrentUser } from '#server/mocks/user'

export async function getCurrentUserProfile(locale: SupportedLocale) {
  return getMockCurrentUser(locale)
}
