import type { SupportedLocale } from '#shared/i18n/locales'
import type { UserProfile } from '#shared/types/user'

const userByLocale: Record<SupportedLocale, UserProfile> = {
  zh: {
    id: 'user_demo_1',
    name: '林夏',
    email: 'linxia@example.com',
    plan: 'Starter Member',
    joinedAt: '2026-06-04',
    preferences: ['新品提醒', '轻量动效', '中文文档'],
  },
  en: {
    id: 'user_demo_1',
    name: 'Lin Xia',
    email: 'linxia@example.com',
    plan: 'Starter member',
    joinedAt: '2026-06-04',
    preferences: ['Product updates', 'Light motion', 'Chinese documentation'],
  },
}

export async function getMockCurrentUser(locale: SupportedLocale): Promise<UserProfile> {
  return userByLocale[locale]
}
