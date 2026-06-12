import type { Product } from '#shared/types/product'

const products: Product[] = [
  {
    id: 'canvas-kit',
    name: 'Canvas Kit',
    summary: '适合产品首页的图文模块和 CTA 示例。',
    description: 'Canvas Kit 展示 C 端首页常见的首屏、商品卡片和行动按钮组合，方便 clone 后替换成真实业务内容。',
    price: '¥199',
    accent: 'teal',
    features: ['服务端首屏渲染', '响应式商品卡片', '语义化主题 token'],
  },
  {
    id: 'member-flow',
    name: 'Member Flow',
    summary: '模拟会员资料、空状态和错误状态。',
    description: 'Member Flow 用 mock 用户资料演示“看起来像登录后”的页面，但不绑定任何认证 provider。',
    price: '¥299',
    accent: 'coral',
    features: ['用户私有数据默认动态', '统一状态组件', '无真实鉴权依赖'],
  },
  {
    id: 'motion-panel',
    name: 'Motion Panel',
    summary: '小范围动效交互，不扩大客户端边界。',
    description: 'Motion Panel 演示如何把动效限制在客户端交互小组件中，避免整页依赖浏览器状态。',
    price: '¥149',
    accent: 'violet',
    features: ['Vue Query 示例', '局部 transition 小组件', '首屏 SEO 数据服务端读取'],
  },
]

export async function listMockProducts(): Promise<Product[]> {
  return products
}

export async function getMockProductById(id: string): Promise<Product | null> {
  return products.find(product => product.id === id) ?? null
}
