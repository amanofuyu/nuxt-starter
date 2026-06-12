import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['tests/unit/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': new URL('./app', import.meta.url).pathname,
      '~~': new URL('.', import.meta.url).pathname,
      '#shared': new URL('./shared', import.meta.url).pathname,
      '#server': new URL('./server', import.meta.url).pathname,
    },
  },
})
