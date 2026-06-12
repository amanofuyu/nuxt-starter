import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const repoRoot = path.resolve(fileURLToPath(import.meta.url), '../../..')

const screenRoutes = [
  {
    page: 'app/pages/index.vue',
    readmeFile: 'app/screens/home/README.md',
    screenComponent: 'HomeScreen',
    screenFile: 'app/screens/home/HomeScreen.vue',
  },
  {
    page: 'app/pages/login.vue',
    readmeFile: 'app/screens/login/README.md',
    screenComponent: 'LoginScreen',
    screenFile: 'app/screens/login/LoginScreen.vue',
  },
  {
    page: 'app/pages/products/[id].vue',
    readmeFile: 'app/screens/product-detail/README.md',
    screenComponent: 'ProductDetailScreen',
    screenFile: 'app/screens/product-detail/ProductDetailScreen.vue',
  },
  {
    page: 'app/pages/profile.vue',
    readmeFile: 'app/screens/profile/README.md',
    screenComponent: 'ProfileScreen',
    screenFile: 'app/screens/profile/ProfileScreen.vue',
  },
]

function normalizeWhitespace(content: string) {
  return content.replace(/\s+/g, ' ').trim()
}

describe('page screen structure', () => {
  it('screens 目录由 Nuxt 组件自动导入', async () => {
    const configContent = await readFile(path.join(repoRoot, 'nuxt.config.ts'), 'utf8')
    const normalized = normalizeWhitespace(configContent)

    expect(normalized).toContain('path: \'~/screens\'')
    expect(normalized).toMatch(/path: '~\/screens'.*?pathPrefix: false/)
  })

  it('pages 只渲染对应 screen 聚合组件', async () => {
    for (const route of screenRoutes) {
      const pageContent = await readFile(path.join(repoRoot, route.page), 'utf8')
      const normalized = normalizeWhitespace(pageContent)

      expect(normalized).toContain(`<${route.screenComponent}`)
      expect(normalized).not.toContain(`import ${route.screenComponent}`)
      expect(normalized).not.toContain('<section')
    }
  })

  it('每个页面入口都有对应的 screen 文件', async () => {
    await Promise.all(screenRoutes.map(route =>
      access(path.join(repoRoot, route.screenFile)),
    ))
  })

  it('每个 screen 文档说明整体功能和代码组织结构', async () => {
    for (const route of screenRoutes) {
      const readmeContent = await readFile(path.join(repoRoot, route.readmeFile), 'utf8')

      expect(readmeContent).toContain('## 功能概览')
      expect(readmeContent).toContain('## 代码组织结构')
    }
  })
})
