# 仓库地图

本文档帮助 AI 和人类快速定位常见改动位置。规则入口仍然是 `AGENTS.md`。

| 任务 | 优先修改位置 | 注意事项 |
| --- | --- | --- |
| 改首页内容 | `app/pages/index.vue`、`app/screens/home/*` | 页面通过 API 读取数据，不直接导入 mock；主体 UI 放在 screen。 |
| 改商品详情 | `app/pages/products/[id].vue`、`app/screens/product-detail/*`、`server/queries/products.ts` | 保持 route params 与 API 行为一致。 |
| 拆分页面主体 UI | `app/pages/*`、`app/screens/<screen-name>/*` | `pages` 保留路由入口和页面级配置，`screens` 自动导入并放页面聚合、私有组件和 README。 |
| 接真实商品数据 | `server/queries/products.ts`、必要时新增 mapper/schema 测试 | DTO 不直接进入页面，先读 `docs/data-fetching.md`。 |
| 接真实用户数据 | `server/queries/user.ts`、认证相关 ADR | 先确认认证和权限方案，页面不要读取后端用户 DTO。 |
| 改登录表单 | `app/features/login/LoginForm.vue` | 表单可用客户端状态，校验继续用 Zod。 |
| 改中英文文案 | `i18n/locales/*`、相关页面或组件 | 语言包 key 必须保持一致，组件内用 `useI18n()`，不要使用 `$t`。 |
| 改本地化 mock 数据 | `server/mocks/*`、`server/queries/*`、相关 API route 测试 | API 用 `locale` 查询参数选择语言，页面仍通过 Nitro API 读取。 |
| 增加客户端交互面板 | `app/features/*` | 不要导入 `server/*`。 |
| 调整组件数据流或 composable | `app/features/*`、`app/composables/*`、`docs/frontend-component-guidelines.md` | 保持 props/emit 单向数据流，局部共享状态优先页面状态或 provide/inject。 |
| 增加通用按钮或状态包装 | `app/components/common/*` | 优先复用 shadcn-vue 基础组件。 |
| 新增 shadcn-vue 基础组件 | `app/components/ui/*` | 不放业务逻辑。 |
| 新增 API Route | `server/api/*` | 必须校验输入，避免泄露内部错误。 |
| 改 API fetch 行为 | `server/utils/api-fetcher.ts`、`shared/api/*`、`docs/data-fetching.md` | 区分 transport、business、contract error，先搜索所有调用方。 |
| 改环境变量 | `.env.example`、`nuxt.config.ts`、`server/utils/env.ts` | 区分 server-only 和 `NUXT_PUBLIC_*`。 |
| 改主题 token | `app/assets/css/tailwind.css` | 业务组件不要散落硬编码品牌色。 |
| 改 Docker 部署 | `Dockerfile`、`docker-compose.yml`、`docs/docker-deploy.md` | Nuxt Node server 使用 `.output/server/index.mjs`。 |
| 改 CI | `.github/workflows/ci.yml`、`package.json` | 保持 nvm、pnpm 和验证矩阵一致。 |
| 改 AI 边界规则 | `scripts/check-ai-boundaries.mjs`、`tests/unit/ai-boundaries.test.ts` | 同时覆盖违规和合法样例。 |
| 改 UI 规范 | `docs/ui-guidelines.md`、`docs/ui-quality-checklist.md`、`docs/shadcn-maintenance.md` | Nuxt 版使用 `@lucide/vue`、vee-validate、Tailwind v4。 |
| 改验证规则 | `docs/quality-gates.md`、`docs/codex-playbook.md`、`.github/pull_request_template.md` | 让本地、CI 和 PR 模板说法一致。 |
| 新增 ADR | `DECISIONS.md` 或 `docs/adr/*` | 先用 `docs/templates/adr.md`，再在决策记录里索引。 |
| 写任务说明 | `docs/templates/ai-task.md`、`bugfix-task.md`、`review-task.md` | 用于把需求写清楚后再交给 AI 执行。 |
| 查文档入口 | `docs/index.md` | 不确定读哪个文档时先看这里。 |
| 查日常流程 | `docs/codex-playbook.md` | 包含验证矩阵、ADR、文档同步规则。 |

## 快速判断

- 如果文件会被浏览器打包，不能导入 `server/*`。
- 如果文件在 `app/pages`，不能直接导入 `server/mocks/*`。
- 如果文件在 `app/components/ui`，不能导入业务、server 或 mock。
- 如果页面要处理远端字段名、后端业务码或统一响应包装，说明转换位置错了，应前移到 query/mapper/API。
- 如果要接真实外部能力，先看是否触发 ADR。
- 如果只改文档，也要检查关键引用和坏引用。
