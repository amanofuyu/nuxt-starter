import type { z } from 'zod'

import { ApiError, normalizeApiError } from '#shared/api/errors'

type JsonBody = BodyInit | Record<string, unknown> | null

export interface ApiRequestOptions<TSchema extends z.ZodType | undefined = undefined>
  extends Omit<RequestInit, 'body'> {
  body?: JsonBody
  schema?: TSchema
}

interface ApiFetchRuntimeConfig {
  appApiBaseUrl: string
}

function getRuntimeBaseUrl(config?: ApiFetchRuntimeConfig) {
  if (config) {
    return config.appApiBaseUrl
  }

  return useRuntimeConfig().appApiBaseUrl
}

export async function apiFetch<TSchema extends z.ZodType | undefined = undefined>(
  path: string,
  options: ApiRequestOptions<TSchema> = {},
  config?: ApiFetchRuntimeConfig,
): Promise<TSchema extends z.ZodType ? z.infer<TSchema> : unknown> {
  try {
    const url = path.startsWith('http') ? path : new URL(path, getRuntimeBaseUrl(config)).toString()
    const headers = new Headers(options.headers)
    let body = options.body

    if (body && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof URLSearchParams)) {
      headers.set('content-type', 'application/json')
      body = JSON.stringify(body)
    }

    const response = await fetch(url, {
      ...options,
      headers,
      body: body as BodyInit | null | undefined,
    })

    const contentType = response.headers.get('content-type')
    const payload = contentType?.includes('application/json') ? await response.json() : await response.text()

    if (!response.ok) {
      throw new ApiError('接口请求失败', {
        status: response.status,
        code: response.status === 404 ? 'NOT_FOUND' : 'UPSTREAM_ERROR',
        cause: payload,
      })
    }

    if (options.schema) {
      return options.schema.parse(payload) as TSchema extends z.ZodType ? z.infer<TSchema> : unknown
    }

    return payload as TSchema extends z.ZodType ? z.infer<TSchema> : unknown
  }
  catch (error) {
    throw normalizeApiError(error)
  }
}
