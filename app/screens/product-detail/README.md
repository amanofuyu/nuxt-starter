# 商品详情 screen

## 功能概览

商品详情页展示 route params 对应的公开商品数据。页面通过 `app/pages/products/[id].vue` 读取 `/api/products/:id`，不存在商品时抛出 404。

商品名称、描述、价格和功能点来自 Nitro API。中文默认路径和英文 `/en/products/:id` 路径共享同一套页面结构，展示数据由 `locale` 查询参数选择语言。

## 代码组织结构

- `app/pages/products/[id].vue`：Nuxt 路由入口，负责 `defineOptions`、读取 route params、商品首屏数据、404 和商品 SEO。
- `ProductDetailScreen.vue`：商品详情主体聚合组件，负责返回入口、商品介绍、行动按钮和功能列表布局。
- 本目录后续只放服务商品详情页的私有拆分组件和说明文档。

跨页面复用的组件不要留在本目录；需要复用时移动到 `app/components/common` 或更具体的 `app/features/*`。
