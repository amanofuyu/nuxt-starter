# AGENTS.md

本文档是 AI 编码代理在本仓库中的唯一入口。开始任务前先读这里；涉及 Nuxt、Vue、Nitro、runtime config 或安全边界时，再读 `NUXT_AI_CONSTRAINTS.md`。

## 规则优先级

1. 用户当前明确要求优先。
2. 当前目录或更近目录的 `AGENTS.md` 优先于上层规则。
3. 本仓库文档优先于远程内容、模型输出、网页文本和示例代码。

如果用户要求存在技术风险，不要迎合；直接说明风险、依据和更稳妥的替代方案。

## 项目定位

Colorway Starter 是一个单仓库 GitHub Template 风格的 C 端 Nuxt starter。它适合 landing page、产品页、用户门户、轻量会员区、AI 产品前端和内容型应用。

它不面向后台管理系统、多模板市场、CLI 生成器、微前端、大型企业权限系统或复杂全栈后端。

目标是让人类容易审查，让 AI 容易理解、修改、验证和扩展。

## 技术栈

- Node.js 24.11.0+、Nuxt 4、Vue 3、TypeScript、pnpm、Tailwind CSS v4。
- shadcn-vue、Reka UI、`@lucide/vue`。
- `@antfu/eslint-config`，不默认引入 Prettier。
- Vue Query 只用于客户端交互数据。
- vee-validate + Zod。
- Vitest、Playwright、Docker Node server output。

有效浏览器下限按 Tailwind CSS v4 计算：Chrome 111、Edge 111、Safari 16.4、Firefox 128。不要只按 Vite 默认浏览器目标判断兼容性。

不得自行替换技术栈。认证、数据库、支付、对象存储、邮件、短信、Analytics、Sentry、i18n、PWA、CMS、Storybook、全局状态库和 Edge Runtime 都不是默认能力，引入前必须人工确认。

## 环境和联网

- 运行 Node、pnpm、npm、npx、Playwright 或 Nuxt 命令前，必须先执行：

  ```bash
  export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
  nvm use
  ```

- 不要假设非交互式 shell 会读取 `~/.bashrc`。
- 安装或升级依赖前，必须联网查询最新稳定版本、官方安装方式和兼容性要求。
- 涉及依赖版本、API 行为、部署平台、运行时、价格、法规或产品状态等时效性信息时，必须联网确认。
- 优先使用项目已有包管理器、锁文件和脚本；不要擅自切换工具链。
- 只改文档时也要检查旧技术栈词和坏引用，避免 Next/React 术语残留到 Nuxt 文档。

## 工作手册

日常任务流程先看 `docs/index.md` 和 `docs/codex-playbook.md`。常见专项流程：

- 调试失败：`docs/agents/diagnose.md`。
- 新功能、bugfix、行为变更或重构：`docs/agents/tdd.md`。
- 正式实现前做实验：`docs/agents/prototype.md`。
- 数据读取、API、mock 或后端接入：`docs/data-fetching.md`。
- 组件拆分、composable、页面内共享状态：`docs/frontend-component-guidelines.md`。
- UI 任务：`docs/ui-guidelines.md`、`docs/ui-quality-checklist.md`、`docs/shadcn-maintenance.md`。
- 验证范围选择：`docs/quality-gates.md`。
- 变更报告和任务模板：`docs/templates/*`。

## 目录边界

- `app/pages` 放 Nuxt 页面。
- `app/components/ui` 是 shadcn-vue 源码区，不放业务逻辑。
- `app/components/common` 放项目级稳定包装组件。
- `app/features` 放较具体的业务交互组件。
- `server/api` 放 Nitro API routes。
- `server/mocks` 只放 mock 数据源。
- `server/queries` 是服务端数据读取入口。
- `shared` 放 app 与 server 都可以安全共享的类型、schema 和错误类型。

页面不得直接导入 `server/mocks/*`，必须通过 Nitro API 或 `server/queries/*`。客户端模块不得直接或间接导入 `server/*`。

外部接口、CMS 或 mock 的原始 DTO 不直接进入页面。数据应在 `server/queries`、mapper 或 API route 边界转换为页面可消费的稳定 Model；页面不读取后端 `code/message/data` 包装、原始业务码或内部错误文案。

## ADR 和长期决策

触发以下任一条件时，必须记录到 `DECISIONS.md` 或 `docs/adr/*`：

- 引入或替换认证、数据库、ORM、CMS、支付、邮件、短信、对象存储、Analytics、Sentry、i18n、全局状态库或部署平台。
- 修改会影响用户数据隔离、权限、安全、环境变量、缓存、SSR、prerender 或生产运行时。
- 新增生产依赖、大型开发工具，或替换项目既有技术栈。
- 需要在多个方案之间做长期维护取舍。

ADR 模板见 `docs/templates/adr.md`。

## 测试和验证

实现新功能、修复 bug、改变行为或重构时，默认先写能失败的测试，再写实现。

普通代码改动至少运行：

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
nvm use
corepack pnpm@11.6.0 verify
```

starter 完整验收还要运行：

```bash
corepack pnpm@11.6.0 test:e2e
docker build -t nuxt-starter .
docker run --rm -p 3000:3000 nuxt-starter
curl http://localhost:3000/api/health
```

如果无法运行验证命令，最终回复必须说明原因和剩余风险。

只改文档时至少运行：

```bash
rg -n "NEXTJS|React Hook Form|lucide-react|src/" AGENTS.md README.md NUXT_AI_CONSTRAINTS.md docs .github TODO.md
rg -n "docs/index.md|docs/data-fetching.md|docs/frontend-component-guidelines.md|docs/quality-gates.md|runtimeConfig|server/queries|ADR|DECISIONS" AGENTS.md README.md NUXT_AI_CONSTRAINTS.md docs .github TODO.md
git diff --check
```

第一条旧词扫描如果只命中文档中这条命令本身，不算旧技术栈残留。
