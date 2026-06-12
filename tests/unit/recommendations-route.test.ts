import { describe, expect, it, vi } from 'vitest'

const parseRecommendationsResponse = vi.hoisted(() => vi.fn((payload: unknown) => payload))

vi.mock('#shared/api/schemas', () => ({
  recommendationsResponseSchema: {
    parse: parseRecommendationsResponse,
  },
}))

async function importRecommendationsRoute() {
  vi.resetModules()
  parseRecommendationsResponse.mockClear()
  return import('../../server/api/recommendations.get')
}

describe('recommendations route', () => {
  it('返回前使用响应 schema 校验推荐数据', async () => {
    const { default: handler } = await importRecommendationsRoute()

    const payload = await handler({ node: { req: { url: '/api/recommendations' } } } as never)

    expect(parseRecommendationsResponse).toHaveBeenCalledTimes(1)
    expect(parseRecommendationsResponse).toHaveBeenCalledWith(payload)
    expect(payload).toEqual({
      items: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          reason: expect.any(String),
          title: expect.any(String),
        }),
      ]),
    })
  })

  it('支持英文 locale 查询参数', async () => {
    const { default: handler } = await importRecommendationsRoute()

    const payload = await handler({ node: { req: { url: '/api/recommendations?locale=en' } } } as never)

    expect(payload.items).toEqual([
      expect.objectContaining({
        title: 'Connect real APIs through server/queries',
      }),
      expect.objectContaining({
        title: 'Replace template branding and tokens',
      }),
    ])
  })
})
