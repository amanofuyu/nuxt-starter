import { expect, test } from '@playwright/test'

const corePages = ['/', '/login', '/profile', '/products/canvas-kit']

test.describe('核心页面', () => {
  for (const path of corePages) {
    test(`${path} 没有 critical console errors`, async ({ page }) => {
      const errors: string[] = []
      page.on('console', (message) => {
        if (message.type() === 'error') {
          errors.push(message.text())
        }
      })

      await page.goto(path)
      await expect(page.locator('body')).toBeVisible()

      expect(errors).toEqual([])
    })
  }

  test('首页渲染 Nuxt 商品入口', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: '为 C 端产品准备的 Nuxt 前端底座' })).toBeVisible()
    await expect(page.getByRole('link', { name: /Canvas Kit/ })).toBeVisible()
  })

  test('登录页展示表单校验', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: '模拟登录' }).click()

    await expect(page.getByText('请输入有效邮箱')).toBeVisible()
    await expect(page.getByText('密码至少 8 位')).toBeVisible()
  })

  test('登录表单支持键盘提交并展示校验', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('密码').press('Enter')

    await expect(page.getByText('请输入有效邮箱')).toBeVisible()
    await expect(page.getByText('密码至少 8 位')).toBeVisible()
  })

  test('商品详情页渲染 route params 对应商品', async ({ page }) => {
    await page.goto('/products/canvas-kit')

    await expect(page.getByRole('heading', { name: 'Canvas Kit' })).toBeVisible()
    await expect(page.getByText('服务端首屏渲染')).toBeVisible()
  })

  test('主题切换在刷新后保持', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: '切换主题' }).click()
    await expect(page.locator('html')).toHaveClass(/dark/)

    await page.reload()
    await expect(page.locator('html')).toHaveClass(/dark/)
  })
})
