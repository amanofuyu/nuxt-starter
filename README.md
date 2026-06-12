# Colorway Starter

Colorway Starter 是一个面向 C 端应用的 Nuxt 4 starter。它适合作为 GitHub Template 使用，clone 后替换品牌、内容、数据源和业务集成。

这个模板默认假设 AI 会参与主要开发，因此仓库内置了清晰的目录边界、中文约束文档、验证脚本、CI 和轻量架构边界检查。

## 适用范围

适合：

- landing page、产品页、内容型网站。
- 用户门户、轻量会员区。
- AI 产品前端和需要安全处理模型输出的 C 端应用。

不默认支持：

- 后台管理系统。
- 多模板市场或 CLI 生成器。
- 数据库、认证、支付、对象存储、邮件、短信、Analytics、Sentry、PWA、CMS、Storybook 或大型全局状态库。

这些能力应在具体项目中先确认方案，再单独引入。

## 技术栈

- Nuxt 4 + Vue 3 + TypeScript
- Nitro server routes
- @nuxtjs/i18n 中英双语路由
- Tailwind CSS v4 + shadcn-vue + Reka UI
- Vue Query 仅用于客户端交互数据
- vee-validate + Zod
- Vitest + Playwright
- Docker Node server output

## 运行环境

- Node.js：最低 `24.11.0`。
- 浏览器：有效下限按 Tailwind CSS v4 计算，最低为 Chrome 111、Edge 111、Safari 16.4、Firefox 128。
- 这组浏览器下限里最晚发布的是 Firefox 128，发布时间是 2024-07-09。

## 架构边界

项目刻意把页面、客户端交互、服务端数据读取和 mock 数据拆开：

```text
app/pages             Nuxt 页面、SEO、路由级数据编排
app/features          需要浏览器状态的业务交互组件
app/components/common 项目级稳定包装组件
app/components/ui     shadcn-vue 基础组件源码区
server/api            Nitro API routes
server/queries        服务端数据读取入口
server/mocks          可替换 mock 数据源
shared                app/server 共享类型、schema 和错误类型
i18n/locales          中英文语言包
```

页面默认通过 Nitro API 读取数据；API 再进入 `server/queries/*`。页面不要直接导入 `server/mocks/*`，客户端组件不要导入 `server/*`。

i18n 默认使用中文无前缀路径，英文使用 `/en` 前缀。用户可见 mock 数据通过 API 的 `locale` 查询参数返回对应语言。

## AI 文档入口

- `docs/index.md`：文档总入口，说明不同任务应阅读哪些文档。
- `AGENTS.md`：AI 代理工作入口，包含规则优先级、环境、目录、验证和安全要求。
- `NUXT_AI_CONSTRAINTS.md`：Nuxt、Vue、Nitro、runtime config 和安全边界细则。
- `docs/codex-playbook.md`：日常任务流程、ADR、验证矩阵和文档维护规则。
- `docs/repo-map.md`：常见需求应该修改的位置。
- `docs/architecture.md`：项目结构、数据形状分层和扩展点。
- `docs/data-fetching.md`：数据读取、DTO/Model/Mapper、API 工具和错误边界。
- `docs/frontend-component-guidelines.md`：Vue 组件命名、单向数据流、composable 和渲染态验证。
- `docs/quality-gates.md`：按变更类型选择验证命令和测试范围。
- `docs/ui-guidelines.md`：视觉方向、主题 token 和组件使用规范。
- `docs/ui-quality-checklist.md`：UI 交付前检查清单。
- `docs/shadcn-maintenance.md`：shadcn-vue 组件维护规则。

## 工程脚本

| 命令 | 用途 |
| --- | --- |
| `pnpm dev` | 本地开发，脚本会把临时目录固定到 `/tmp`，避免 WSL 下 Vite socket 卡住。 |
| `pnpm build` | 构建 Nuxt `.output`。 |
| `pnpm preview` | 预览构建产物。 |
| `pnpm check:boundaries` | 检查 AI/架构导入边界。 |
| `pnpm lint` | ESLint 检查。 |
| `pnpm typecheck` | Nuxt/Vue 类型检查。 |
| `pnpm test` | Vitest 单元测试。 |
| `pnpm test:e2e` | Playwright 端到端测试。 |
| `pnpm verify` | 边界、lint、typecheck、单元测试和 build。 |

所有 Node 相关命令都应先加载 nvm，见“本地开发”。

## Clone 后 TODO

- [ ] 替换 `package.json` 的 `name`、页面 metadata 和文案。
- [ ] 替换 `NUXT_PUBLIC_APP_NAME`、`NUXT_PUBLIC_SITE_URL`、导航项、语言包、品牌色 token 和 favicon；品牌色优先集中改 `app/assets/css/tailwind.css` 的语义变量。
- [ ] 用真实业务数据替换 `server/mocks/*`，但保留 `server/queries/*` 作为服务端读取入口。
- [ ] 选择认证、数据库、支付、Analytics、Sentry 等方案前先做人工确认，不要直接引入。
- [ ] 根据真实浏览器支持要求确认是否接受 Tailwind v4 的 Firefox 128+ 基线。
- [ ] 根据目标部署平台调整 Docker、环境变量和 CI。
- [ ] 运行 `pnpm verify`、`pnpm test:e2e` 和 Docker 烟测。

## 本地开发

项目最低 Node.js 版本是 `24.11.0`，由 `package.json` 的 `engines.node` 声明；`.nvmrc` 选择 Node 24 版本线。

在 WSL/nvm 环境中运行 Node 相关命令前，先执行：

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
nvm use
```

然后安装依赖并启动：

```bash
corepack pnpm@11.6.0 install
corepack pnpm@11.6.0 dev
```

## 验证

```bash
corepack pnpm@11.6.0 check:boundaries
corepack pnpm@11.6.0 verify
corepack pnpm@11.6.0 test:e2e
docker build -t nuxt-starter .
docker run --rm -p 3000:3000 nuxt-starter
curl http://localhost:3000/api/health
```
