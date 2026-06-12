# 架构说明

本文档说明项目结构和扩展点。AI 工作入口见 `AGENTS.md`。

## 总览

Colorway Starter 使用 Nuxt 4。页面通过 SSR 友好的 `useFetch` 读取 Nitro API，API 再进入 `server/queries`。

项目使用 Tailwind CSS v4，因此有效浏览器下限不是 Vite 默认值，而是 Chrome 111、Edge 111、Safari 16.4、Firefox 128。构建目标在 `nuxt.config.ts` 中显式对齐这组版本。

```text
app/pages             Nuxt 页面入口、SEO 和路由级数据编排
app/screens           页面级聚合组件和页面私有拆分组件
app/components/ui     shadcn-vue 源码区
app/components/common 项目级 UI 包装
app/features          具体业务交互组件
app/composables       客户端组合式函数
i18n/locales          中英文语言包
server/api            Nitro API routes
server/queries        服务端读取入口
server/mocks          mock 数据源
shared                app/server 共享类型和 schema
tests                 单元测试和 E2E 测试
```

## 数据流

公开商品数据和用户资料都从 `server/queries` 读取，内部再调用 mock 数据源。页面不直接导入 `server/mocks/*`，这样 clone 后替换真实 API 或数据库时，页面结构不用大改。

`app/pages` 只承担 Nuxt 文件路由入口、路由参数、页面级 SEO、`defineOptions` / `definePageMeta` 和必要的首屏数据读取。页面主体 UI 放在 `app/screens/<screen-name>`，由对应的 `*Screen.vue` 聚合。

`app/screens` 不参与 Nuxt 文件路由扫描，并已加入 Nuxt 组件自动导入。它用于存放只服务某个页面的聚合组件、页面私有拆分组件和页面级说明文档。页面入口可直接使用对应的 `*Screen` 组件，不需要手动 import。

每个 screen 目录应维护 `README.md`，至少包含：

- `## 功能概览`：说明当前页面的用户可见能力、数据来源、语言或权限边界。
- `## 代码组织结构`：说明页面入口、`*Screen.vue`、页面私有组件、相关 `features` 或 API 的分工。

screen 内组件默认不跨页面复用；一旦需要跨页面复用，应上移到 `app/components/common` 或更具体的 `app/features/*`。

默认读取路径：

```text
页面首屏数据
  -> app/pages 使用 useFetch
  -> server/api 返回稳定 JSON
  -> server/queries 读取数据
  -> server/mocks 或真实数据源

用户触发的局部刷新
  -> app/features 使用 Vue Query
  -> server/api
  -> server/queries
```

这样做的目的不是多套一层，而是让页面不关心数据来自 mock、数据库还是后端服务，并让客户端 bundle 永远不需要包含服务端实现。

## 国际化

项目使用 `@nuxtjs/i18n` 提供中英双语：

- 默认语言为中文，现有路径不加语言前缀。
- 英文路径使用 `/en` 前缀。
- 浏览器语言自动跳转关闭，避免 starter 在不同环境下路由表现不一致。
- 语言包放在 `i18n/locales/*`，中英文 key 必须保持一致。
- 组件内显式使用 `useI18n()`，不要使用模板实例上的 `$t`。
- 从 Nitro API 返回的 mock 展示数据通过 `locale` 查询参数选择语言。
- `NUXT_PUBLIC_SITE_URL` 用于生成 i18n canonical 和 alternate SEO 链接，本地默认值为 `http://localhost:3000`。

### 数据形状边界

真实业务接入后端、CMS 或第三方接口时，不要把外部响应结构直接推给页面。项目采用三层形状：

- DTO：外部接口、CMS 或 mock 数据源的原始字段。
- Model：页面和组件消费的稳定领域字段。
- Mapper：位于 query 或 server adapter 附近，把 DTO 转成 Model。

页面和 feature 不读取后端统一包装、原始业务码或第三方状态值；这些转换应在 `server/queries`、mapper 或 API route 边界完成。这样后端字段调整时，改动集中在 DTO、mapper、schema 和 query 测试里。

## 客户端边界

- 登录表单位于 `app/features/login/LoginForm.vue`，因为它承载表单状态。
- 推荐面板位于 `app/features/profile/RecommendationsPanel.vue`，因为它使用 Vue Query 和用户触发刷新。
- `app/components/ui` 只保留基础组件源码，不承载业务状态。
- 组件数据流保持单向：父级请求和整理状态，子组件通过 props 接收数据，通过 emit 抛出用户意图。

判断一个组件是否应该放到 `app/features`：

- 它是否使用浏览器事件、表单状态、localStorage、Vue Query 或用户触发刷新。
- 它是否只服务一个业务场景，而不是通用 UI 包装。
- 它是否需要从页面接收已经过服务端筛选的数据。

如果答案大多为是，放到 `app/features`。如果它只是按钮、容器、空状态或项目级视觉包装，放到 `app/components/common`。

## API 和错误

Nitro API route 是页面和数据源之间的稳定边界。API 应该：

- 校验 route params、query 和 body。
- 调用 `server/queries`，不直接散落读取逻辑。
- 返回前做必要 schema 校验。
- 对用户返回稳定错误结构，不暴露内部堆栈。

共享错误和 schema 放在 `shared/api/*`，让 app 和 server 能复用类型而不跨越 server 边界。

错误处理分三类：transport error、business error、contract error。页面只处理归一化后的错误状态，不匹配外部接口内部文案，也不把异常静默降级为成功空态。

## Runtime Config

Nuxt runtime config 分两层：

- `runtimeConfig` 顶层：只在服务端可见，例如服务端 secret、内部 API base URL。
- `runtimeConfig.public`：会暴露给客户端，例如公开 app name。

新增 runtime config 或环境变量时同步更新：

- `.env.example`
- `nuxt.config.ts`
- `server/utils/env.ts`
- 相关测试和文档

如果变量只供 Nuxt 模块在 `nuxt.config.ts` 配置阶段读取，也必须在文档中写清用途和默认值；其余 app/server 运行时会消费的变量应进入 `server/utils/env.ts` 做集中校验。

## UI 架构

`app/components/ui` 是 shadcn-vue 源码区，偏 vendored；`app/components/common` 是项目语义层；`app/features` 是业务交互层。

不要把业务语义塞进 ui 基础组件。比如不要让 `Button` 理解 `planId`，而是在 `AppButton` 或具体 feature 里表达业务含义。

## 扩展点

- 接真实商品接口：修改 `server/queries/products.ts`，必要时新增 DTO、mapper 和 query/API 测试。
- 接真实用户系统：先确认认证方案，再替换 `server/queries/user.ts`，不要让页面直接读取后端用户 DTO。
- 增加语言：先更新 i18n ADR，再补 `i18n/locales/*`、Nuxt i18n 配置、API locale 校验和 E2E。
- 扩展 UI：优先新增或复用 `app/components/common/*`。
- 增加 API Route：放在 `server/api/*`，并用 Zod 校验输入。
- 调整环境变量：修改 `.env.example` 和 `nuxt.config.ts`，保持 server-only 与 `NUXT_PUBLIC_*` 边界。

## 不默认引入的能力

以下能力不在 starter 默认范围内，不能为了“以后可能用”提前加入：

- 认证和权限系统。
- 数据库、ORM、迁移工具。
- 支付、订阅、发票。
- 对象存储、邮件、短信。
- CMS、PWA、Sentry、Analytics。
- Storybook、全局状态库、复杂队列或 Edge Runtime。

这些能力都需要先写清业务需求、备选方案、影响和 ADR。
