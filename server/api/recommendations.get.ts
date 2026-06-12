import { recommendationsResponseSchema } from '#shared/api/schemas'

export default function recommendationsHandler() {
  const payload = {
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
  }

  return recommendationsResponseSchema.parse(payload)
}
