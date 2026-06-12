# Nuxt AI 开发约束

更新日期：2026-06-12

本文档只记录 Nuxt、Vue、Nitro、runtime config 和安全边界相关规则。通用代理行为、环境命令和完成汇报要求见 `AGENTS.md`。

## 总原则

1. 默认使用 Nuxt 4 的文件路由和 Nitro server routes。
2. 页面首屏数据优先通过 SSR 友好的 `useFetch` / `$fetch` 读取 Nitro API。
3. 只有确实需要浏览器交互、浏览器 API、客户端状态、客户端事件或客户端查询时，才在 `app/features` 中放交互组件。
4. 不允许为了消除报错而把服务端模块导入客户端。
5. 业务正确性优先于框架炫技，不为了展示 Nitro、middleware 或 Edge Runtime 引入额外复杂度。

## 数据与缓存

默认数据路径：

```text
首屏需要的数据 -> app/pages/useFetch -> server/api -> server/queries
用户交互后变化的数据 -> app/features + Vue Query -> server/api
```

规则：

- 页面不直接导入 `server/mocks/*`。
- 客户端模块不直接导入 `server/*`。
- 用户私有数据默认动态读取，相关 API 设置 `cache-control: no-store`。
- 公开商品、文章、营销内容可以考虑 prerender 或缓存，但必须说明缓存语义。
- 不允许在不了解业务实时性时随意添加缓存优化。
- 外部接口、CMS 或 mock 的原始 DTO 不直接进入页面；先在 query/mapper/API 边界转换为稳定 Model。
- 页面和组件不读取后端统一包装、原始业务码、内部错误文案或第三方状态值。
- 不在页面、组件或 composable 中散写请求 URL，也不重复实现 `$fetch` 错误归一化。
- 修改字段形状时，按 DTO/Model/schema -> mapper/query -> API schema -> mock/source -> 页面/feature -> 测试的顺序推进。

## Runtime Config

- 服务端私有配置放在 `runtimeConfig` 顶层，只能在 server 侧读取。
- 客户端可见配置放在 `runtimeConfig.public`，环境变量使用 `NUXT_PUBLIC_*`。
- 不要把服务端 secret 传入 `useState`、页面 payload、props 或 JSON 响应。
- `.env.example` 只放示例值，不放真实 token、密码或连接串。
- 新增配置时必须说明默认值、部署变量名、服务端/客户端可见性和测试方式。
- 服务端内部 base URL、带密钥后端和 CMS 管理接口不得放入 `runtimeConfig.public`。

## Server Routes

API route 必须：

- 校验请求参数。
- 在服务端检查权限。
- 对外部回调接口校验签名或来源。
- 不泄露内部错误堆栈给客户端。
- 返回前对响应 schema 做必要校验，避免 mock 或外部数据形状漂移。
- 错误响应使用稳定结构，避免让页面依赖内部异常文案。
- 区分 transport error、business error 和 contract error，并在边界层归一化。

## UI 与组件

- `app/components/ui` 是 shadcn-vue 源码区，不放业务逻辑。
- `app/screens` 是页面主体聚合和页面私有拆分区，不是 Nuxt 路由目录；组件由 Nuxt 自动导入，页面入口不需要手动 import screen。
- 业务页面优先使用 `app/components/common` 的项目级包装组件。
- 新增交互优先放在 `app/features/*`，避免让页面承载复杂浏览器状态。
- 组件数据流保持单向：父级组织请求和状态，子组件通过 props 接收数据，通过 emit 抛出用户意图。
- 单页面短生命周期共享状态优先使用页面状态或 provide/inject，不为了局部状态引入全局 store。
- 使用语义 token，不要在组件中散落硬编码品牌色。
- Tailwind CSS v4 是当前 UI 兼容瓶颈，浏览器下限为 Chrome 111、Edge 111、Safari 16.4、Firefox 128。
- shadcn-vue 组件维护细则见 `docs/shadcn-maintenance.md`。

## SEO 与 Head

- 页面标题、描述和 Open Graph 信息使用 `useSeoMeta` / `useHead`。
- 不要把 Next.js 的 `metadata`、`generateMetadata` 或 `generateStaticParams` 迁回项目。
- 动态 404 使用 `createError({ statusCode: 404 })`，不要返回半空页面假装成功。
- 页面应能在禁用客户端 JavaScript 的情况下呈现主要内容，除非该页面明确是纯交互工具。

## 测试边界

- API route 测试覆盖请求、响应、schema 和错误归一化。
- 共享工具优先用 Vitest 单测。
- 页面主流程和主题持久化用 Playwright E2E。
- 导入边界由 `scripts/check-ai-boundaries.mjs` 和 `tests/unit/ai-boundaries.test.ts` 保护。
- 新增边界规则时必须同时补合法和违规样例测试。

## 禁止清单

- 客户端组件导入 `server/*`。
- 页面直接导入 `server/mocks/*`。
- 客户端读取服务端密钥。
- 用客户端判断替代服务端权限校验。
- 无说明地修改部署配置、环境变量、缓存策略或鉴权逻辑。
- 为了让测试通过而删除测试、降低断言或绕过类型检查。
