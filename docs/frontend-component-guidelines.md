# 前端组件规范

本文记录 Vue 组件工程规则，覆盖组件命名、数据流、共享状态、composable 和渲染态验证。视觉、响应式和可访问性规则仍见 `docs/ui-guidelines.md`。

## 组件文件命名

- 新增或重构 Vue 组件文件名优先使用 PascalCase，保持 Nuxt 组件自动导入和现有项目风格一致。
- 组件名应表达业务语义，不用过宽泛的 `Card.vue`、`List.vue` 作为跨目录可复用组件名。
- 业务目录内的一次性子组件可在清晰父目录下使用短名；跨目录复用组件必须用明确名称。

推荐：

```text
app/components/common/PageContainer.vue
app/components/common/EmptyState.vue
app/features/profile/RecommendationsPanel.vue
```

不推荐：

```text
app/components/common/Card.vue
app/features/profile/List.vue
app/components/ui/ProductPlanCard.vue
```

`app/components/ui` 是 shadcn-vue 源码区，命名和结构优先遵循 shadcn-vue 本身。

## 单向数据流

- 组件数据流优先保持单向：父级负责请求、状态整理和事件处理，子组件通过 `props` 接收渲染数据，通过 `emit` 抛出用户意图。
- 子组件不要直接改写父组件传入的对象、数组或全局状态；需要变更时抛出事件，由父级统一更新。
- 页面根组件或业务容器应承担接口编排和状态归一化，展示组件应尽量保持纯渲染。

推荐：

```vue
<script setup lang="ts">
defineProps<{
  title: string
  active: boolean
}>()

const emit = defineEmits<{
  select: []
}>()
</script>

<template>
  <button type="button" @click="emit('select')">
    {{ title }}
  </button>
</template>
```

不推荐：

```ts
const props = defineProps<{ item: { checked: boolean } }>()
props.item.checked = true
```

## 数据编排位置

- 页面负责路由参数、SEO 和首屏数据编排。
- `app/screens/*` 负责页面主体 UI 聚合、页面私有拆分组件和页面级说明文档，不是第二套路由目录。该目录已加入 Nuxt 组件自动导入，`app/pages/*` 可直接使用对应 `*Screen` 组件。
- `app/features/*` 负责浏览器交互状态、局部刷新、表单状态和用户触发动作。
- `app/components/common/*` 负责项目级 UI 包装，不做接口请求。
- `app/components/ui/*` 只放 shadcn-vue 基础组件，不做业务请求、不读 runtime config。

推荐：

```text
app/pages/products/[id].vue
app/screens/product-detail/ProductDetailScreen.vue
app/screens/product-detail/ProductFeatureList.vue
app/screens/product-detail/README.md
```

`app/pages/products/[id].vue` 保留 Nuxt 路由语义和页面级配置；`app/screens/product-detail/*` 聚合并拆分页面主体。screen 内组件如果开始被其他页面依赖，应移动到 `app/components/common` 或 `app/features`，不要让 `screens` 变成隐式全局组件库。

每个 screen 目录的 `README.md` 必须记录：

- `## 功能概览`：当前页面的整体功能、用户流程、数据来源、语言、权限或缓存边界。
- `## 代码组织结构`：`app/pages/*`、`*Screen.vue`、页面私有组件、相关 `app/features/*`、API 或 query 的职责分工。

如果一个组件同时包含请求、表单、弹窗和多段业务状态，优先拆成业务容器和展示组件，而不是让单个 Vue 文件继续膨胀。

## composable 规则

- `app/composables` 放客户端可用的组合式函数，不导入 `server/*`。
- 远端接口、埋点、语言参数、站点配置等跨组件能力，应通过 typed API、业务 composable 或页面级 provider 收敛，不要散落在模板和子组件里。
- 浏览器 API 必须考虑 SSR，必要时用 `import.meta.client` 或 Nuxt 客户端插件隔离。
- 不要为了单页面短生命周期状态创建全局 store；优先用页面内状态或 provide/inject。

## 页面内共享状态

页面内多个组件共享同一份短生命周期状态时，优先使用 `provide/inject`，不要为了单页面共享创建全局状态库。

provider 应放在页面根组件或业务容器中，并尽量暴露只读状态和明确动作。injection key 应集中定义，避免散落字符串 key。

示例：

```ts
import type { InjectionKey, Readonly, Ref } from 'vue'

export const productSelectionKey = Symbol('product-selection') as InjectionKey<{
  selectedId: Readonly<Ref<string | null>>
  selectProduct: (id: string) => void
}>
```

```ts
const selectedId = ref<string | null>(null)

provide(productSelectionKey, {
  selectedId: readonly(selectedId),
  selectProduct: (id) => {
    selectedId.value = id
  },
})
```

## 文案和多语言

当前 starter 已引入 `@nuxtjs/i18n`。新增用户可见文案时：

- 先补 `i18n/locales/zh-CN.json` 和 `i18n/locales/en-US.json`，保持 key 完全一致。
- 组件内显式使用 `useI18n()`，不要使用模板实例上的 `$t`。
- 如果新增语言或改变路由策略，应先更新 ADR。
- 不要在组件中把远端 HTML 当作可信文案直接渲染。

## 渲染态验证

UI 修改必须按 rendered state 验证，而不是只看 computed state、响应式变量或单元测试结果。

至少确认真实 DOM 尺寸、可见性、截图或浏览器渲染结果。涉及 hover、active、loading、异步数据、移动端断点时，应验证触发后的实际画面。

示例：

```ts
await expect(page.getByTestId('product-card')).toBeVisible()
const box = await page.getByTestId('product-card').boundingBox()
expect(box?.width).toBeGreaterThan(0)
```

如果组件没有 `data-testid`，优先使用用户可见文本、role 和 label 查询，不要为了测试暴露内部实现细节。
