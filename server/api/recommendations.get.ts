import type { SupportedLocale } from '#shared/i18n/locales'

import { getLocaleFromEvent } from '#server/utils/locale'
import { recommendationsResponseSchema } from '#shared/api/schemas'

const recommendationsByLocale: Record<SupportedLocale, ReturnType<typeof recommendationsResponseSchema.parse>> = {
  zh: {
    items: [
      {
        id: 'rec-1',
        title: '把真实接口接到 server/queries',
        reason: '页面首屏数据通过 Nitro API 触达服务端边界，客户端只处理用户触发的刷新。',
      },
      {
        id: 'rec-2',
        title: '替换模板名称和品牌 token',
        reason: 'clone 后先改 metadata、导航、mock 数据和 README TODO。',
      },
    ],
  },
  en: {
    items: [
      {
        id: 'rec-1',
        title: 'Connect real APIs through server/queries',
        reason: 'First-screen page data reaches the server boundary through Nitro APIs, while the client only handles user-triggered refreshes.',
      },
      {
        id: 'rec-2',
        title: 'Replace template branding and tokens',
        reason: 'After cloning, update metadata, navigation, mock data, and README TODOs first.',
      },
    ],
  },
}

export default function recommendationsHandler(event: Parameters<typeof getLocaleFromEvent>[0]) {
  const locale = getLocaleFromEvent(event)
  const payload = recommendationsByLocale[locale]
  return recommendationsResponseSchema.parse(payload)
}
