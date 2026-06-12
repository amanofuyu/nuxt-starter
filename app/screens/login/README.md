# 登录 screen

## 功能概览

登录页演示 starter 的客户端表单边界。页面只提供 mock 登录体验，不接入真实认证，也不承担服务端权限判断。

表单校验由 `app/features/login/LoginForm.vue` 使用 vee-validate 和 Zod 完成。真实认证接入前，需要先确认认证方案，并把提交逻辑放到服务端安全边界。

## 代码组织结构

- `app/pages/login.vue`：Nuxt 路由入口，负责 `defineOptions` 和登录页 SEO。
- `LoginScreen.vue`：登录页主体聚合组件，负责页面说明、返回首页链接和表单卡片布局。
- `app/features/login/LoginForm.vue`：登录表单交互组件，负责字段状态、校验和 mock 成功提示。
- 本目录后续只放服务登录页的私有拆分组件和说明文档。

跨页面复用的组件不要留在本目录；需要复用时移动到 `app/components/common` 或更具体的 `app/features/*`。
