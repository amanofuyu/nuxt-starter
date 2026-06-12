import { describe, expect, it, vi } from 'vitest'

const mockProducts = vi.hoisted(() => [
  {
    id: 'canvas-kit',
    name: 'Canvas Kit',
    summary: '适合产品首页的图文模块和 CTA 示例。',
    description: 'Canvas Kit 展示 C 端首页常见的首屏、商品卡片和行动按钮组合。',
    price: '¥199',
    accent: 'teal',
    features: ['服务端首屏渲染'],
  },
])

const mockUser = vi.hoisted(() => ({
  id: 'user_demo_1',
  name: '林夏',
  email: 'linxia@example.com',
  plan: 'Starter Member',
  joinedAt: '2026-06-04',
  preferences: ['新品提醒'],
}))

const parseProduct = vi.hoisted(() => vi.fn((payload: unknown) => payload))
const parseProducts = vi.hoisted(() => vi.fn((payload: unknown) => payload))
const parseUserProfile = vi.hoisted(() => vi.fn((payload: unknown) => payload))

vi.mock('#server/queries/products', () => ({
  getProduct: vi.fn(async () => mockProducts[0]),
  getProducts: vi.fn(async () => mockProducts),
}))

vi.mock('#server/queries/user', () => ({
  getCurrentUserProfile: vi.fn(async () => mockUser),
}))

vi.mock('#shared/api/schemas', () => ({
  productResponseSchema: {
    parse: parseProduct,
  },
  productsResponseSchema: {
    parse: parseProducts,
  },
  userProfileResponseSchema: {
    parse: parseUserProfile,
  },
}))

async function importRoutes() {
  vi.resetModules()
  parseProduct.mockClear()
  parseProducts.mockClear()
  parseUserProfile.mockClear()

  const [productsRoute, productRoute, profileRoute] = await Promise.all([
    import('../../server/api/products/index.get'),
    import('../../server/api/products/[id].get'),
    import('../../server/api/profile.get'),
  ])

  return {
    productHandler: productRoute.default,
    productsHandler: productsRoute.default,
    profileHandler: profileRoute.default,
  }
}

describe('api routes', () => {
  it('商品列表返回前使用响应 schema 校验', async () => {
    const { productsHandler } = await importRoutes()

    const payload = await productsHandler()

    expect(parseProducts).toHaveBeenCalledWith(payload)
    expect(payload).toEqual(mockProducts)
  })

  it('商品详情返回前使用响应 schema 校验', async () => {
    const { productHandler } = await importRoutes()

    const payload = await productHandler({ context: { params: { id: 'canvas-kit' } } })

    expect(parseProduct).toHaveBeenCalledWith(payload)
    expect(payload).toEqual(mockProducts[0])
  })

  it('用户资料返回前使用响应 schema 校验', async () => {
    const { profileHandler } = await importRoutes()

    const payload = await profileHandler({ node: { res: { setHeader: vi.fn() } } })

    expect(parseUserProfile).toHaveBeenCalledWith(payload)
    expect(payload).toEqual(mockUser)
  })
})
