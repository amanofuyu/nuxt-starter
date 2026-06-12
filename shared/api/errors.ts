export type ApiErrorCode
  = | 'BAD_REQUEST'
    | 'NOT_FOUND'
    | 'VALIDATION_ERROR'
    | 'UPSTREAM_ERROR'
    | 'INTERNAL_ERROR'

export class ApiError extends Error {
  readonly status: number
  readonly code: ApiErrorCode
  override readonly cause?: unknown

  constructor(message: string, options: { status: number, code: ApiErrorCode, cause?: unknown }) {
    super(message)
    this.name = 'ApiError'
    this.status = options.status
    this.code = options.code
    this.cause = options.cause
  }
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  return new ApiError('服务暂时不可用，请稍后再试。', {
    status: 500,
    code: 'INTERNAL_ERROR',
    cause: error,
  })
}
