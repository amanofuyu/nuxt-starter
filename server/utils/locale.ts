import type { SupportedLocale } from '#shared/i18n/locales'

import { defaultLocale, supportedLocaleSchema } from '#shared/i18n/locales'

interface LocaleEvent {
  node?: {
    req?: {
      url?: string
    }
  }
}

export function getLocaleFromEvent(event: LocaleEvent): SupportedLocale {
  const requestUrl = new URL(event.node?.req?.url ?? '/', 'http://localhost')
  const locale = requestUrl.searchParams.get('locale') ?? defaultLocale
  const result = supportedLocaleSchema.safeParse(locale)

  if (!result.success) {
    const error = new Error('不支持的语言参数') as Error & {
      statusCode: number
      statusMessage: string
    }
    error.statusCode = 400
    error.statusMessage = '不支持的语言参数'
    throw error
  }

  return result.data
}
