import { describe, expect, it } from 'vitest'

import { ApiError, normalizeApiError } from '#shared/api/errors'

describe('normalizeApiError', () => {
  it('保留已经标准化的 ApiError', () => {
    const error = new ApiError('请求失败', {
      status: 422,
      code: 'VALIDATION_ERROR',
    })

    expect(normalizeApiError(error)).toBe(error)
  })

  it('把未知错误归一化为内部错误', () => {
    const error = normalizeApiError(new Error('boom'))

    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(500)
    expect(error.code).toBe('INTERNAL_ERROR')
  })
})
