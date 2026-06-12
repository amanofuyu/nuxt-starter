# 首页 screen

## 功能概览

首页展示 starter 的产品定位、核心能力和验证基线。页面首屏通过 `app/pages/index.vue` 读取 `/api/products`，再把商品列表传给 `HomeScreen` 渲染工作台式商品入口。

首页保留中文默认路径和英文 `/en` 路径。所有用户可见文案来自 `i18n/locales/*`，商品展示数据由 Nitro API 按 `locale` 查询参数返回。

## 代码组织结构

- `app/pages/index.vue`：Nuxt 路由入口，负责 `defineOptions`、首页 SEO、首屏商品数据读取和传入 `HomeScreen`。
- `HomeScreen.vue`：首页主体聚合组件，负责 hero、能力区、验证区和商品入口布局。
- 本目录后续只放服务首页的私有拆分组件和说明文档。

跨页面复用的组件不要留在本目录；需要复用时移动到 `app/components/common` 或更具体的 `app/features/*`。
