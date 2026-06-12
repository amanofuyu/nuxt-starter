import process from 'node:process'

import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-06-12',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/i18n',
    'shadcn-nuxt',
  ],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
    {
      path: '~/features',
      pathPrefix: false,
    },
  ],
  shadcn: {
    prefix: '',
    componentDir: 'app/components/ui',
  },
  i18n: {
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    defaultLocale: 'zh',
    detectBrowserLanguage: false,
    langDir: 'locales',
    locales: [
      {
        code: 'zh',
        file: 'zh-CN.json',
        language: 'zh-CN',
        name: '中文',
      },
      {
        code: 'en',
        file: 'en-US.json',
        language: 'en-US',
        name: 'English',
      },
    ],
    strategy: 'prefix_except_default',
  },
  css: ['~/assets/css/tailwind.css'],
  runtimeConfig: {
    appApiBaseUrl: 'http://localhost:3000',
    serverOnlyExampleSecret: 'local-secret',
    public: {
      appName: 'Colorway Starter',
    },
  },
  nitro: {
    preset: 'node-server',
  },
  vite: {
    build: {
      target: ['chrome111', 'edge111', 'firefox128', 'safari16.4'],
      cssTarget: ['chrome111', 'edge111', 'firefox128', 'safari16.4'],
    },
    plugins: [
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@lucide/vue': '@lucide/vue/dist/esm/lucide-vue.mjs',
      },
    },
  },
  typescript: {
    strict: true,
    typeCheck: true,
  },
})
