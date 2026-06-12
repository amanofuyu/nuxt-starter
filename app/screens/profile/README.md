# 资料 screen

## 功能概览

资料页展示 mock 用户资料和客户端推荐面板。页面通过 `app/pages/profile.vue` 读取 `/api/profile`，用户私有数据默认使用动态读取并保持 `cache-control: no-store`。

当前页面不绑定真实登录态，只演示“看起来像登录后”的页面结构。真实用户系统接入前，需要先确认认证、权限和用户数据隔离方案。

## 代码组织结构

- `app/pages/profile.vue`：Nuxt 路由入口，负责 `defineOptions`、资料页 SEO、首屏用户资料读取和加载失败边界。
- `ProfileScreen.vue`：资料页主体聚合组件，负责用户卡片、状态卡片和推荐面板布局。
- `app/features/profile/RecommendationsPanel.vue`：客户端交互面板，使用 Vue Query 在用户点击后读取推荐数据。
- 本目录后续只放服务资料页的私有拆分组件和说明文档。

跨页面复用的组件不要留在本目录；需要复用时移动到 `app/components/common` 或更具体的 `app/features/*`。
