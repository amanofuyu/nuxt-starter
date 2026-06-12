# shadcn-vue 维护说明

## 源码归属

`app/components/ui` 是 shadcn-vue vendored 源码区。它不是普通业务组件目录。

规则：

- 不放业务逻辑。
- 不导入 `app/features/*`、`server/*` 或 `server/mocks/*`。
- 不为了单个页面需求修改底层组件。
- 不一次性安装完整组件库。
- 需要稳定业务用法时，在 `app/components/common` 包装。

这些边界由 `pnpm check:boundaries` 做轻量检查。

## Tailwind v4 基线

当前项目使用 Tailwind CSS v4、`@tailwindcss/vite` 和 `tw-animate-css`。shadcn-vue 新项目默认按 Tailwind v4 生成组件样式。

有效浏览器下限按 Tailwind v4 计算：

- Chrome 111+
- Edge 111+
- Safari 16.4+
- Firefox 128+

如果项目需要支持更旧浏览器，不要尝试靠改 Vite `build.target` 解决。应先讨论是否降级 Tailwind v3.4、拆分兼容 CSS，或放弃旧浏览器支持。

## 新增组件

新增前先联网查询 shadcn-vue 官方文档和当前 CLI 用法。新增后检查：

- 依赖是否显式写入 `package.json`。
- 文件是否进入 `app/components/ui`。
- 是否需要 common 包装。
- 是否引入了 Tailwind v4 新 utility 或新的 runtime 依赖。
- lint、typecheck 是否通过。

推荐命令：

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
nvm use
corepack pnpm@11.6.0 dlx shadcn-vue@latest add button
corepack pnpm@11.6.0 check:boundaries
corepack pnpm@11.6.0 typecheck
```

实际新增组件时把 `button` 替换成目标组件名称。

## 更新组件

更新 shadcn 组件应单独成一次变更。更新前后要检查 diff，避免覆盖本地必要调整。

流程：

1. 联网查询 shadcn-vue、shadcn-nuxt、Tailwind 和 Reka UI 的当前版本和迁移说明。
2. 只更新目标组件，不做无关重排。
3. 对比 `app/components/ui` diff，确认没有把业务逻辑写进基础组件。
4. 运行 `pnpm check:boundaries`、`pnpm typecheck`，涉及 UI 时运行 E2E。

## common 包装

当一个基础组件被多个页面以同一业务语义使用时，优先在 `app/components/common` 新增包装。例如：

- `AppButton`：统一按钮尺寸、loading、图标位置。
- `EmptyState`：统一空状态文案结构。
- `PageContainer`：统一页面宽度和间距。

不要在 `app/components/ui` 里加入业务 props，例如 `productId`、`userPlan`、`marketingVariant`。

## ESLint 和自动导入

Nuxt 会自动导入 `app/components` 下组件。命名冲突时优先显式导入或调整 common 包装名称，不要移动 shadcn 源码来绕过冲突。

shadcn-vue 文件常导出 variants 或组合式结构。如果 lint 规则误伤 vendored 代码，应在 `eslint.config.mjs` 做窄范围例外，不要全局关闭规则。
