import type { ApiError } from '#shared/api/errors'

import { afterEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

async function importApiFetcher() {
  vi.resetModules()
  return import('#server/utils/api-fetcher')
}

function stubJsonFetch(payload: unknown, init?: ResponseInit) {
  const fetchMock = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => Response.json(payload, init))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('apiFetch', () => {
  it('使用 appApiBaseUrl 拼接相对路径', async () => {
    const fetchMock = stubJsonFetch({ ok: true })
    const { apiFetch } = await importApiFetcher()

    await apiFetch('/health', {}, { appApiBaseUrl: 'https://api.example.com/root/' })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/health',
      expect.objectContaining({
        body: undefined,
        headers: expect.any(Headers),
      }),
    )
  })

  it('把普通对象 body 序列化为 JSON 并设置 content-type', async () => {
    const fetchMock = stubJsonFetch({ ok: true })
    const { apiFetch } = await importApiFetcher()

    await apiFetch('/submit', {
      body: { name: 'Colorway' },
      method: 'POST',
    }, { appApiBaseUrl: 'https://api.example.com' })

    const [, init] = fetchMock.mock.calls[0]
    expect(init?.body).toBe(JSON.stringify({ name: 'Colorway' }))
    expect((init?.headers as Headers).get('content-type')).toBe('application/json')
  })

  it('把非 2xx 响应转换为 ApiError', async () => {
    stubJsonFetch({ error: 'teapot' }, { status: 418 })
    const { apiFetch } = await importApiFetcher()

    await expect(apiFetch('/teapot', {}, { appApiBaseUrl: 'https://api.example.com' })).rejects.toMatchObject({
      code: 'UPSTREAM_ERROR',
      status: 418,
    } satisfies Partial<ApiError>)
  })

  it('提供 schema 时校验响应', async () => {
    stubJsonFetch({ ok: true })
    const { apiFetch } = await importApiFetcher()

    const result = await apiFetch('/health', {
      schema: z.object({ ok: z.literal(true) }),
    }, { appApiBaseUrl: 'https://api.example.com' })

    expect(result).toEqual({ ok: true })
  })
})
