# Docker 部署说明

Docker 镜像基于 Node.js `24.11-alpine`，与项目最低 Node.js `24.11.0` 要求保持一致。

## 构建

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
nvm use
corepack pnpm@11.6.0 build
docker build -t nuxt-starter .
```

## 运行

```bash
docker run --rm -p 3000:3000 nuxt-starter
```

容器使用 Nuxt Nitro Node server output，入口是：

```bash
node .output/server/index.mjs
```

不要在生产容器里运行 `pnpm dev`。

如果本机 3000 端口被占用，可以让 Docker 随机分配宿主端口：

```bash
docker run --rm -d -p 127.0.0.1::3000 --name nuxt-starter-smoke nuxt-starter
docker port nuxt-starter-smoke 3000/tcp
```

## Compose

```bash
docker compose up --build
```

## 健康检查

```bash
curl http://localhost:3000/api/health
```

预期返回：

```json
{ "ok": true }
```

## 环境变量

参考 `.env.example`。服务端变量不得暴露给浏览器，客户端可见变量必须使用 `NUXT_PUBLIC_*` 前缀。

生产部署时至少确认：

- `NUXT_PUBLIC_APP_NAME` 是否为真实产品名。
- `NUXT_APP_API_BASE_URL` 是否指向部署后的服务地址。
- `NUXT_SERVER_ONLY_EXAMPLE_SECRET` 是否已替换为真实 secret 或删除不用。

不要把服务端 secret 写入 `runtimeConfig.public` 或任何 `NUXT_PUBLIC_*` 变量。

## 构建产物

Nuxt build 输出 `.output`：

```text
.output/public            静态资源
.output/server            Nitro server
.output/server/index.mjs  生产入口
```

Docker runner 阶段只复制 `.output`，不需要带上源码、测试和开发依赖。

## 发布前检查

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
nvm use
corepack pnpm@11.6.0 verify
corepack pnpm@11.6.0 test:e2e
docker build -t nuxt-starter .
docker run --rm -d -p 127.0.0.1::3000 --name nuxt-starter-smoke nuxt-starter
PORT=$(docker port nuxt-starter-smoke 3000/tcp | sed 's/.*://')
curl "http://127.0.0.1:${PORT}/api/health"
docker stop nuxt-starter-smoke
```

如果目标平台不是 Node server，例如 Cloudflare、Vercel、Netlify 或静态托管，不要直接套用本 Dockerfile，应先确认 Nitro preset 和运行时限制。
