# 决策记录

本文档记录会影响长期维护的轻量决策。较大的决策应使用 `docs/templates/adr.md` 创建 `docs/adr/YYYY-MM-DD-决策标题.md`，并在这里建立索引。

## 2026-06-12：从 Next Starter 迁移到 Nuxt 4

- 采用 Nuxt 4、Vue 3、Nitro、Tailwind CSS v4 和 shadcn-vue。
- 使用 Nitro API 作为页面与 server query 层之间的边界，避免客户端 bundle 导入 `server/*`。
- `lucide-vue-next` 已废弃，实际采用 npm 当前推荐的 `@lucide/vue`。
- 不默认引入认证、数据库、支付、CMS、Sentry、i18n、PWA 或大型全局状态库。

## 2026-06-12：Node 和浏览器兼容基线

- Node.js 使用 24 版本线，最低运行版本为 `24.11.0`，因为当前 Nuxt/Nitro/Babel/CSS 压缩相关依赖在 Node 24 分支要求 `24.11.0+`。
- `.nvmrc` 保持 `24`，便于开发机和 CI 选择已安装的 Node 24 小版本；真实最低版本由 `package.json` 的 `engines.node` 声明。
- Docker 镜像使用 `node:24.11-alpine`，和最低运行要求保持一致。
- 浏览器有效下限按 Tailwind CSS v4 计算，而不是按 Vite 默认值计算：Chrome 111、Edge 111、Safari 16.4、Firefox 128。
- 如果未来需要支持更旧浏览器，应先讨论 Tailwind v3.4、兼容 CSS 或放弃旧浏览器支持，不应只修改 Vite `build.target`。

## 2026-06-12：吸收 Vue/Nuxt 参考项目文档规则

- 从现有 Vue/Nuxt 项目文档中吸收数据流、组件数据流和质量门禁规则，补充 `docs/data-fetching.md`、`docs/frontend-component-guidelines.md`、`docs/quality-gates.md` 和 `docs/index.md`。
- 保留适合 C 端 starter 的部分：DTO/Model/Mapper 分层、请求封装、SSR/client base URL 边界、单向组件数据流、provide/inject 局部共享状态、按变更类型选择验证命令。
- 不照搬后台管理系统专属规则，例如 POST-only API 约束、模块生成器和管理端权限模型。
- 不照搬具体业务项目的支付、订单、i18n、PWA 或全局请求插件复杂度；这些能力仍需在真实项目中按 ADR 单独确认。

## 2026-06-12：引入 Nuxt i18n

- 决策详见 `docs/adr/2026-06-12-nuxt-i18n.md`。
- 使用 `@nuxtjs/i18n` 支持中英双语。
- 中文保留无前缀默认路径，英文使用 `/en` 前缀。
- 禁用浏览器语言自动跳转，避免 starter 路由在不同浏览器环境下不稳定。
- 组件内使用 `useI18n()`，不使用模板实例上的 `$t`。
