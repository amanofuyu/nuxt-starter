import { z } from 'zod'

export const supportedLocales = ['zh', 'en'] as const
export const defaultLocale = 'zh'

export const supportedLocaleSchema = z.enum(supportedLocales)

export type SupportedLocale = z.infer<typeof supportedLocaleSchema>
