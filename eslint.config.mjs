import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  vue: true,
  stylistic: {
    indent: 2,
    semi: false,
    quotes: 'single',
  },
  ignores: [
    '.nuxt',
    '.output',
    'node_modules',
    'playwright-report',
    'test-results',
  ],
})
