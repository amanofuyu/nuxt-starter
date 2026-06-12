import { z } from 'zod'

const envSchema = z.object({
  NUXT_APP_API_BASE_URL: z.url().default('http://localhost:3000'),
  NUXT_PUBLIC_APP_NAME: z.string().min(1).default('Colorway Starter'),
  NUXT_SERVER_ONLY_EXAMPLE_SECRET: z.string().min(1).default('local-secret'),
})

export type AppEnv = ReturnType<typeof parseEnv>

export function parseEnv(source: Record<string, string | undefined>) {
  const result = envSchema.safeParse(source)

  if (!result.success) {
    throw new Error(`环境变量校验失败：${z.prettifyError(result.error)}`)
  }

  return {
    appApiBaseUrl: result.data.NUXT_APP_API_BASE_URL,
    serverOnlyExampleSecret: result.data.NUXT_SERVER_ONLY_EXAMPLE_SECRET,
    public: {
      appName: result.data.NUXT_PUBLIC_APP_NAME,
    },
  }
}
