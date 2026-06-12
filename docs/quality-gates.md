# 质量门禁

本文档定义修改项目后的验收方式。通用执行流程见 `docs/codex-playbook.md`，UI 细节见 `docs/ui-quality-checklist.md`。

## 命令前置

运行 Node 相关命令前必须加载 nvm：

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
nvm use
```

本仓库默认使用 pnpm，不要混用 npm、yarn 或 bun 修改锁文件。

首次在本机或 CI 环境运行 Playwright E2E 前，需要安装浏览器二进制和系统依赖：

```bash
corepack pnpm@11.6.0 exec playwright install --with-deps chromium
```

## 只改文档

至少运行：

```bash
rg -n "NEXTJS|React Hook Form|lucide-react|src/" AGENTS.md README.md NUXT_AI_CONSTRAINTS.md docs .github TODO.md
rg -n "docs/index.md|docs/data-fetching.md|docs/frontend-component-guidelines.md|docs/quality-gates.md|runtimeConfig|server/queries|ADR|DECISIONS" AGENTS.md README.md NUXT_AI_CONSTRAINTS.md docs .github TODO.md
```

第一条旧词扫描如果只命中文档中这条命令本身，不算旧技术栈残留。

如果当前目录是 Git 仓库，追加：

```bash
git diff --check
```

目的：

- 检查旧技术栈词是否误入 Nuxt 文档。
- 确认关键文档互相引用没有明显遗漏。
- 检查行尾空白和 patch 格式。

## 普通代码改动

至少运行：

```bash
corepack pnpm@11.6.0 verify
```

`verify` 当前包含：

- `pnpm check:boundaries`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## 触发额外验证

| 修改范围 | 追加验证 |
| --- | --- |
| 页面主流程、登录、主题、商品详情 | `corepack pnpm@11.6.0 test:e2e` |
| `nuxt.config.ts`、runtime config、Nitro、Docker | `corepack pnpm@11.6.0 verify` + Docker build / health smoke |
| `server/api`、`server/queries`、`server/utils/api-fetcher.ts` | 相关单测，必要时补 API route 测试 |
| `scripts/check-ai-boundaries.mjs` | `corepack pnpm@11.6.0 check:boundaries` + `tests/unit/ai-boundaries.test.ts` |
| UI、响应式、动效 | E2E 或浏览器真实渲染检查 |
| 依赖变更 | 联网查询最新稳定版本、兼容性和迁移说明 |

## 测试选择规则

- 改 mapper：必须补或更新 mapper 单测。
- 改 mock 分页、筛选、排序或状态流转：必须补或更新 mock/query 单测。
- 改 API 契约：必须覆盖 API 调用参数、错误归一化和响应 schema。
- 改 shared UI：必须补真实渲染或 E2E 覆盖。
- 改页面主流程：必须补或更新 E2E。
- 改 runtime config 或服务端 secret 边界：必须补 env/runtime config 测试。
- 纯文档改动：不强制运行完整 Node 验证，但要检查链接、命令和规则是否一致。

## 测试质量规则

- 测试必须描述外部可观察行为，避免只断言内部函数被调用、私有状态变化或 mock 调用次数。
- 优先从页面、API route、query、mapper、mock 数据源或 common UI 的公共接口进入，不为测试方便暴露内部实现。
- 每个测试覆盖一个明确行为，测试名应能说明业务预期和触发条件。
- 使用 mock 时只替代不可控边界，例如外部网络、浏览器 API、时间、随机数或真实存储。
- 新功能和 bug 修复优先按“一个失败测试、一个最小实现”的纵向切片推进。
- 回归测试必须覆盖真实失败模式；如果只能写过浅测试，应在最终回复中说明原因和剩余风险。

## 最终自检

- [ ] 目标行为已经实现。
- [ ] 影响范围已经说明。
- [ ] 验证命令已经运行，结果明确。
- [ ] 未覆盖的验证已说明原因。
- [ ] 不需要 ADR，或已经更新 `DECISIONS.md` / `docs/adr/`。
- [ ] 没有引入无关重构、临时代码或多余依赖。
- [ ] 没有违反页面、feature、common、ui、server 和 shared 的分层边界。

## 不接受的行为

- 声称通过但没有运行命令。
- 只运行 lint 就交付高风险接口、状态流转或部署改动。
- 依赖变更前不联网查询。
- 修改全局请求、SEO、环境变量或部署规则却不说明影响。
- 页面直接 import mock、DTO、server-only helper 或散写请求 URL。
- 为了通过测试而删除测试、放宽关键断言或只验证内部实现细节。
