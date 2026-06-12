# 文档总览

本目录按“入口、规则、专题、模板”的顺序组织文档。新增长期文档时放在 `docs/` 下，并在本文登记定位和适用场景。

## 阅读顺序

第一次接触项目时建议按下面顺序阅读：

1. `README.md`：了解项目目标、技术栈、启动命令和目录速览。
2. `AGENTS.md`：了解 AI 代理和协作者的仓库级规则。
3. `docs/repo-map.md`：定位常见任务的改动目录。
4. `docs/architecture.md`：理解 Nuxt、数据、runtime config、UI 和部署边界。
5. `docs/data-fetching.md`：理解 Nitro API、query、mock、DTO/Model/Mapper、错误处理和 SSR 请求边界。
6. `docs/frontend-component-guidelines.md`：理解 Vue 组件命名、单向数据流、provide/inject 和渲染态验证。
7. `docs/ui-guidelines.md`：理解视觉、样式和响应式规则。
8. `docs/quality-gates.md`：确认需要运行的验证命令。
9. `docs/codex-playbook.md`：使用 AI 代理执行任务时阅读。
10. `docs/adr/` 或 `DECISIONS.md`：需要追溯或记录长期技术决策时阅读。

## 按角色阅读

- 新加入开发者：先读 `README.md`、`docs/repo-map.md`、`docs/architecture.md`。
- 维护 AI 代理规则：先读 `AGENTS.md`、`docs/codex-playbook.md`、`docs/agents/`。
- 处理接口或状态问题：先读 `docs/data-fetching.md`，再读相关 `server/api`、`server/queries`、`shared/api`。
- 处理组件抽象、组件状态或样式命名：先读 `docs/frontend-component-guidelines.md`。
- 处理 UI 和响应式问题：先读 `docs/ui-guidelines.md`、`docs/ui-quality-checklist.md`。
- 处理发布或容器问题：先读 `docs/docker-deploy.md`。
- 做架构取舍：先读 `DECISIONS.md` 和 `docs/templates/adr.md`。

## 文档定位

| 文档 | 定位 | 主要读者 |
| --- | --- | --- |
| `README.md` | 项目入口、启动命令和目录速览 | 所有人 |
| `AGENTS.md` | 仓库级 AI 代理规则 | AI 代理、维护者 |
| `DECISIONS.md` | 简短决策索引 | 维护者、审查者 |
| `TODO.md` | 短期维护事项 | 维护者 |
| `docs/architecture.md` | 架构和关键边界说明 | 开发者、AI 代理 |
| `docs/repo-map.md` | 常见任务落点 | 开发者、AI 代理 |
| `docs/data-fetching.md` | 数据流、请求封装和接口契约 | 开发者、AI 代理 |
| `docs/frontend-component-guidelines.md` | 组件命名、数据流和共享状态规则 | 前端开发者、AI 代理 |
| `docs/ui-guidelines.md` | 视觉、样式和响应式规则 | 前端开发者 |
| `docs/ui-quality-checklist.md` | UI 交付前检查 | 前端开发者、审查者 |
| `docs/quality-gates.md` | 验证命令和完成标准 | 开发者、AI 代理 |
| `docs/docker-deploy.md` | Docker 部署说明 | 运维、开发者 |
| `docs/codex-playbook.md` | AI 执行任务的日常流程 | AI 代理、审查者 |
| `docs/agents/` | 诊断、TDD、原型验证流程 | AI 代理、开发者 |
| `docs/templates/` | 任务、bugfix、审查、变更报告模板 | 用户、AI 代理 |

## 命名规则

- 操作流程文档使用明确主题名，例如 `data-fetching.md`、`docker-deploy.md`。
- 检查清单使用 `*-checklist.md`。
- 架构决策优先记录到 `DECISIONS.md`；较长决策使用 `docs/templates/adr.md` 创建 `docs/adr/YYYY-MM-DD-决策标题.md`。
- 任务输入模板放入 `docs/templates/`。
- 根目录只保留项目入口、代理规则、决策索引、短期 TODO 和构建运行必要文件。
