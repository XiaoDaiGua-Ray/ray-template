# 发行版本与快速启动

同一套前端通过源码导出提供独立使用方式。Admin、文档和公共包之间保留明确依赖边界，Mock 与自有后端遵循同一套 API 契约。源码归档包含可编辑的工程文件，需要安装依赖并构建后运行。

## 纯前端发行包

在仓库根目录执行：

```sh
pnpm dist:frontend
```

输出目录为 `dist/distributions/`，包含 `ray-template-frontend-<version>/` 和同名 `.tar.gz`。解压后进入源码目录，使用仓库指定的 Node.js 26.13.0 与 pnpm 12.16.1：

```sh
pnpm install --frozen-lockfile
pnpm dev
```

默认打开 `/ray-template/`，通过 MSW 体验登录、用户管理、路由和其他示例。纯前端包保留 Admin、文档、10 个共享包及必要工具；不包含后端工作区、数据库驱动、Redis 客户端、服务端启动脚本或数据库配置。前端开发、构建和文档使用不需要 Docker。

接入自己的服务时配置 `VITE_API_BASE_URL`、`VITE_API_MOCK=false`，具体协议见[服务端接入](./backend)。这些前端变量会进入浏览器产物，只能放公开配置。

## 发行物追溯

归档内的 `distribution.json` 记录：

- 发行类型和版本。
- 来源 Git 提交及是否含未提交改动；没有 Git 信息时保留已知的来源信息。
- 实际包含的 workspace 清单和源码文件数量。
- 导出内容的 SHA-256 摘要。

导出会按依赖图保留所需工作区、裁剪锁文件、移除不可用命令与专属说明，并排除 `.git`、`node_modules`、本地环境配置、凭据、构建结果和临时验证资料。`pnpm dist:check` 检查导出计划和依赖完整性；干净环境中的安装、构建、运行需要另行验证。

导出命令只生成本地源码目录和归档。

<!-- fullstack:start -->

## 全栈发行包

在完整仓库运行：

```sh
pnpm dist:fullstack
```

同一目录会生成 `ray-template-fullstack-<version>/` 与同名 `.tar.gz`。它包含相同的前端源码以及 `apps/server`、数据库迁移、Redis 配置和启动工具。后端采用 NestJS 12.3.3、Prisma 7.10.1、PostgreSQL 18，Redis 客户端为 6.3.1；Compose 配置使用 Redis 8.2.11。具体锁定版本以发行包清单和锁文件为准。

### 本地开发

安装依赖并准备 Docker Compose，然后运行：

```sh
pnpm fullstack:setup
pnpm dev:full
```

`setup` 首次创建 `apps/server/.env.local`，生成数据库、Redis、管理员随机密码和 JWT 签名密钥，启动 PostgreSQL 与 Redis，执行迁移并初始化管理员。配置文件按私有文件创建；请在本机读取初始用户名和密码，勿提交、上传或放进前端变量。Mock 的 `123456` 只用于前端演示。

再次执行 `setup` 会复用配置、保留已有账号和数据库内容。`dev:full` 等待后端就绪后再启动前端，通过 Vite 将同源 `/api/` 请求代理给后端，并关闭 Mock。默认地址为 `http://127.0.0.1:9527/ray-template/`；可用 `ADMIN_DEV_PORT` 和 `PORT` 分别指定前端和后端端口。按 `Ctrl+C` 关闭开发进程；`pnpm fullstack:stop` 停止 Compose 服务并保留数据卷。

### 使用已有数据库与 Redis

将 `DATABASE_URL` 和 `REDIS_URL` 放入当前进程的安全环境中，然后执行：

```sh
pnpm fullstack:setup --external
pnpm dev:full
```

`--external` 跳过 Docker 服务启动，仍执行迁移和初始化。已有 `apps/server/.env.local` 时保留该文件，进程环境优先。应使用为本项目准备的数据库；迁移和初始化会创建或更新本项目的数据结构。停止外部数据服务由其部署环境负责。

### 创建真实登录账号

在用户管理新增资料后，有 `users:credentials` 权限的管理员可以为该账号点击 **设置密码**。已登录用户可在头像菜单的 **个人信息** 页面修改自己的密码，需要输入当前密码。改密或重设会撤销该账号的所有会话。密码要求 12–128 个字符。

无法登录时，运维可通过安全环境提供 `CREDENTIAL_USERNAME` 与 `CREDENTIAL_PASSWORD`，再执行 `pnpm server:credential:set`。该命令适用于直接访问项目数据库的运维终端。重复执行 `setup` 不会创建改名前的账号，也不会重置密码。不要把密码写进命令行、终端记录或 AI 对话。

### 服务与运行检查

| 命令或接口                     | 用途                                                                |
| ------------------------------ | ------------------------------------------------------------------- |
| `pnpm server:build`            | 生成 Prisma Client 并构建独立服务端产物                             |
| `pnpm server:start`            | 从服务端构建产物启动                                                |
| `pnpm server:check`            | 服务端类型、单元/平台测试和构建                                     |
| `pnpm server:test:integration` | 使用 `TEST_DATABASE_URL`、`TEST_REDIS_URL` 验证真实存储与 HTTP 行为 |
| `GET /api/health/live`         | 进程存活检查                                                        |
| `GET /api/health/ready`        | PostgreSQL 与 Redis 就绪检查                                        |

全栈包含配置校验、接口授权、会话撤销、Redis 限流、安全响应头、CORS、请求 ID、脱敏日志和操作审计。Redis 不可用时管理接口返回 503，不切换到每进程的临时认证或限流数据。缓存只用于可重建的演示读取结果，权限和会话每次从数据库核验。

生产模式默认关闭演示接口，并从后端提供的运行菜单中移除演示页面。路由编辑器仍可维护完整配置。真实后端请求失败不会回退到 Mock。

### 容器启动

准备仓库指定的 Node.js 26.13.0，以及已启动的 Docker 和 Compose v2 插件（`docker compose version`、`docker info` 均应成功）。从解压后的全栈源码或完整仓库根目录运行：

```sh
node scripts/fullstack.mjs up
# 使用 pnpm 时，也可以运行 pnpm fullstack:up
```

此命令创建私有配置、构建 Admin 和 API、启动 PostgreSQL 与 Redis、执行迁移和初始化，等服务就绪后打印本机入口。宿主机无需预先安装前端依赖。默认入口为 `http://127.0.0.1:8080/ray-template/`，可通过 `APP_PORT` 改端口。使用 `node scripts/fullstack.mjs stop` 停止服务，数据卷保留。多个隔离实例要为每份配置指定不同的 `RAY_COMPOSE_PROJECT`、宿主机端口和 `APP_PROXY_NETWORK`。

Nginx 将同源 `/api/` 转发给后端。默认只在回环地址暴露宿主机端口，生产模式关闭演示（可用 `APP_DEMO_ENABLED=true` 显式开启）。外部 HTTPS 入口设置 `APP_ORIGINS` 为实际浏览器来源、`APP_SESSION_COOKIE_SECURE=true`，保留同源的 `/ray-template/` 和 `/api/`。示例 Nginx 会覆盖转发头；如再接外层反代，应在 Nginx 的 real IP 设置中只信任实际上一跳，并验证转发头无法伪造限流地址。代理网段冲突时，修改 `APP_PROXY_NETWORK`（例如 `172.30.68`）。容器连接外部数据库或 Redis 时，用正确编码的 `APP_DATABASE_URL`、`APP_REDIS_URL` 指定目标；已有服务的本机开发走 `setup --external`。

### 给部署者和 AI 的验收清单

1. 先确认发行物含 `apps/server`、`deploy/compose.yaml` 和 `scripts/fullstack.mjs`。默认选容器方式；需要热更新时走本地开发；已有 PostgreSQL、Redis 时用专用数据库和 Redis 前缀。端口占用就换 `APP_PORT`（容器）或 `PORT`、`ADMIN_DEV_PORT`（本机开发）；数据库和 Redis 映射分别用 `POSTGRES_PORT`、`REDIS_PORT`。
2. 准备 PostgreSQL 迁移权限、Redis 连接以及服务端私有配置。部署副本共享同一个 `JWT_SECRET`（32 个随机字节的 base64url 编码），不同环境使用不同密钥。升级旧工作区可重跑 `setup` 或 `up` 补齐缺少的密钥；先备份 PostgreSQL，再应用迁移，旧令牌需重新登录。初始化配置中的密码只用于第一次建号。
3. 验证 `GET /api/health/live`、`GET /api/health/ready` 均返回 200，匿名 `GET /api/admin/route-config` 返回 401。登录后检查用户管理、个人信息和路由管理；为测试账号设置密码，并确认只读账号不能调用写接口。空菜单账号仍应能打开个人信息。
4. 如只有存活检查通过，用 Compose 的 `ps -a`、`logs initialize server` 检查迁移、初始化与连接。命令需使用 `--env-file apps/server/.env.local -f deploy/compose.yaml --profile app -p <项目名>`。只看脱敏日志，不回显环境文件。若浏览器登录后仍返回 401，检查实际访问源、同源代理和 Cookie 的 Secure 设置。对外部署还要验证目标环境的 HTTPS、备份恢复与代理限流。

`node deploy/smoke.mjs` 使用独立的临时 Compose 项目检查迁移、构建、登录、路由、CORS、演示开关和代理限流，并只清理它创建的测试资源。

### 生成分支与 Release 资产

维护者在 GitHub Actions 从 `main` 手动运行 **Source distributions**。默认只验证并上传本次运行的归档。要更新生成的 `frontend` 分支，选择 `sync_frontend`；该分支从主线导出，不用于独立开发。要给已有 Release 附加两个源码包及 SHA-256 校验文件，另行填写 `release_tag`。工作流检查标签版本及提交、验证归档，并保留已上传的同名资产。

<!-- fullstack:end -->
