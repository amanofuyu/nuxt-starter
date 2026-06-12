# 数据获取说明

本文档只说明数据读取和 API 工具边界。Nuxt runtime config 与安全细则见 `NUXT_AI_CONSTRAINTS.md`。

## 默认规则

首屏、SEO 和页面级数据默认通过 Nitro API 读取。API route 调用 `server/queries/*`，页面不直接读取 mock 数据。

```text
首屏需要的数据 -> app/pages/useFetch -> server/api -> server/queries
用户交互后变化的数据 -> app/features + Vue Query -> server/api
```

选择规则：

- 页面首次渲染必须展示的数据：`useFetch` 调 Nitro API。
- 用户点击后才需要的数据：Vue Query 调 Nitro API。
- 只在服务端内部使用的数据：直接在 `server/queries` 或 server utils 内读取。
- 纯静态展示文案：留在页面或组件中，不需要 API。
- 页面、组件和 composable 不散写请求 URL，不重复实现 `$fetch` 错误处理。
- 修改全局请求、错误结构或 API 契约前，必须先用 `rg` 搜索调用方。

## 数据形状分层

真实项目接入后端、CMS 或第三方接口时，要区分三层数据形状：

| 层级 | 所在位置 | 用途 |
| --- | --- | --- |
| DTO | `server/queries` 附近或未来的 server adapter | 表达外部接口、CMS 或 mock 数据源的原始字段。 |
| Model | `shared/types/*` 或 feature 内稳定类型 | 表达页面和组件真正消费的领域字段。 |
| Mapper | `server/queries` 附近的纯函数 | 把 DTO 转成 Model，处理默认值、枚举、兼容字段和格式化边界。 |

当前 starter 的 mock 数据较简单，已经接近页面可用模型。未来如果替换为真实后端，不要让页面直接依赖后端字段名、`code/message/data` 包装或第三方状态值。应在 query 或 adapter 层完成映射，再把稳定 Model 返回给 API。

推荐路径：

```text
外部接口或 mock DTO
  -> mapper 校验和转换
  -> server/queries 返回 Model
  -> server/api 用 schema 校验响应
  -> app/pages 或 app/features 渲染 Model
```

字段变更顺序：

1. 更新 DTO、Model 或 Zod schema。
2. 更新 mapper 或 query，并补 mapper/query 单测。
3. 更新 API route 响应 schema 和错误测试。
4. 更新 mock 或外部数据适配。
5. 更新页面、feature 或展示组件。
6. 更新 E2E 或手工验证说明。

页面不得为了适配后端字段而写临时转换逻辑。只要字段来自远端契约，转换就应进入 mapper/query/API 边界。

## Query 层

`server/queries/*` 是服务端数据读取入口。真实项目可以在这里接数据库、后端接口或 CMS。

规则：

- 客户端模块不得导入 query 文件。
- 用户私有数据默认动态读取，不做公共缓存。
- 公开商品、文章、营销内容可以考虑缓存或 prerender，但必须说明缓存语义。
- 修改缓存、SSR、SSG 或 prerender 行为时，变更报告必须写清影响。
- Query 函数返回页面语义结果，不返回裸 `$fetch` 响应、后端统一包装或 transport 细节。
- 如果 query 需要调用外部 HTTP 服务，优先通过 `server/utils/api-fetcher.ts` 或明确的 server adapter 进入。

Query 函数应保持小而稳定。页面和 API 不应该关心真实数据来自哪里。替换数据源时，优先保持 query 函数签名不变。

## Mock 数据

`server/mocks/products.ts` 和 `server/mocks/user.ts` 只代表数据源。页面不得直接导入 mock 文件。

替换真实数据源时，优先保持 query 函数签名稳定，让页面层少改或不改。

mock 规则：

- mock 可以表达真实字段形状，但不要模拟复杂业务权限。
- mock 不要导出给客户端直接消费。
- 如果 mock 用来模拟外部接口，应返回 DTO，再由 mapper 转成 Model。
- mock 数据变化可能影响 API schema 测试，变更时要同步检查。

## API Fetcher

`server/utils/api-fetcher.ts` 是服务端 JSON fetch 的统一入口。它负责：

- 合并 base URL。
- 设置 JSON body 和请求头。
- 归一化 HTTP 错误。
- 使用 Zod schema 校验返回值。

不要在多个 query 里各自手写一套 fetch 错误处理。新增外部 API 时，优先复用 fetcher。

错误分类：

- transport error：网络失败、HTTP 非 2xx、请求超时或 fetch 抛错。
- business error：HTTP 成功，但外部接口业务码表示失败。
- contract error：返回 JSON 不符合预期 schema。

页面只处理已经归一化后的错误状态，不读取后端原始错误码、不匹配后端内部文案，也不把 unknown error 静默吞掉。

## Base URL 和 SSR

Nuxt 运行时有服务端和客户端两种上下文。新增 base URL 时先判断是否应暴露给浏览器：

- 服务端内部 API、带密钥的后端、CMS 管理接口：放在 `runtimeConfig` 顶层，只能 server 侧使用。
- 浏览器可直接访问的公开 API：放在 `runtimeConfig.public`，环境变量使用 `NUXT_PUBLIC_*`。
- 同一个业务 API 如果 SSR 和浏览器 base URL 不同，应封装在一处，不要让页面和组件自行判断环境。

新增长期 API 域名、认证头、代理策略或跨域策略时，更新 `.env.example`、`nuxt.config.ts`、`server/utils/env.ts`、测试和 `DECISIONS.md`。

## Vue Query

Vue Query 只用于客户端交互数据，例如：

- 用户触发刷新。
- 弹窗、抽屉或局部面板内的数据。
- 轮询、乐观更新、无限滚动。
- mutation 后的局部 refetch。

不要把首屏、SEO 或服务端可直接读取的数据无理由搬到客户端查询。

Vue Query 的 query function 仍应调用 Nitro API 或 shared API helper，不直接 import server query，也不重复实现 HTTP 错误归一化。

## 缓存和实时性

默认不要缓存用户私有数据。公开内容可以缓存，但必须写清：

- 缓存对象是什么。
- 缓存多久。
- 如何失效。
- 是否影响登录态或权限。
- E2E 或手工如何验证。

Nuxt/Nitro 的缓存能力要服务具体业务，不要为了性能指标提前加复杂缓存。

## 错误处理

API 对外错误应稳定：

- 404：资源不存在，例如商品 slug 不存在。
- 400：请求参数不合法。
- 500：服务端未知错误，但不要暴露内部堆栈。

页面应为 loading、empty、error 提供可见状态。不要只在控制台记录错误。

不接受的错误处理：

- `catch` 后只 `console.error`，继续渲染成功状态。
- 页面读取外部 API 的 `code/message/data` 并自行决定业务成功失败。
- 为了避免报错而返回空数组或空对象，且没有可见错误状态。
- 在客户端暴露服务端 secret、内部 base URL 或第三方 token。
