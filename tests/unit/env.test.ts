import { describe, expect, it } from 'vitest'

import { parseEnv } from '#server/utils/env'

describe('parseEnv', () => {
  it('校验服务端和客户端环境变量并返回类型化结果', () => {
    const env = parseEnv({
      NUXT_APP_API_BASE_URL: 'https://example.com',
      NUXT_PUBLIC_APP_NAME: 'Colorway Starter',
      NUXT_SERVER_ONLY_EXAMPLE_SECRET: 'secret',
    })

    expect(env.appApiBaseUrl).toBe('https://example.com')
    expect(env.public.appName).toBe('Colorway Starter')
  })

  it('拒绝无效的 base URL', () => {
    expect(() =>
      parseEnv({
        NUXT_APP_API_BASE_URL: 'not-a-url',
        NUXT_PUBLIC_APP_NAME: 'Colorway Starter',
        NUXT_SERVER_ONLY_EXAMPLE_SECRET: 'secret',
      }),
    ).toThrow(/环境变量校验失败/)
  })
})
