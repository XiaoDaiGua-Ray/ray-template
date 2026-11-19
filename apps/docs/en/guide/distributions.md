# Source distributions and startup {#发行版本与快速启动}

The same frontend is available as a standalone source export. Admin, the docs, and shared packages keep their workspace dependency boundaries, and mocks and custom backends use the same API contract. The archives contain editable project files. Install dependencies and build before running a deployment.

## Frontend distribution {#纯前端发行包}

Run this command from the repository root.

```sh
pnpm dist:frontend
```

`dist/distributions/` contains `ray-template-frontend-<version>/` and a matching `.tar.gz`. After extracting the archive and entering the source directory, use Node.js 26.13.0 and pnpm 12.16.1.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open `/ray-template/` to try sign-in, user management, routes, and other examples through MSW. The frontend edition includes Admin, the docs, all 10 shared packages, and required tools. It runs and builds independently of the backend workspace, database drivers, Redis client, server launcher, and database configuration. Frontend development, builds, and docs run without Docker.

To connect your own backend, configure `VITE_API_BASE_URL` and `VITE_API_MOCK=false`. These values enter the browser bundle, so use them for public configuration only. [Backend integration](./backend)

## Distribution provenance {#发行物追溯}

`distribution.json` in the archive records the following.

- Edition and version.
- Source Git commit and whether the source had uncommitted changes. Exports without Git metadata keep known provenance.
- Included workspaces and source file count.
- SHA-256 digest of the exported content.

The exporter follows the dependency graph, prunes the lockfile, and removes commands and notes specific to omitted features. It excludes `.git`, `node_modules`, local environment files, credentials, build output, and temporary verification evidence. `pnpm dist:check` checks the export plan and dependency integrity. Installation, build, and runtime checks in a clean environment run separately.

Export commands create local source directories and archives.

<!-- fullstack:start -->

## Full-stack distribution {#全栈发行包}

Run this command in the complete repository.

```sh
pnpm dist:fullstack
```

The same output directory contains `ray-template-fullstack-<version>/` and a matching `.tar.gz`. It includes the frontend source plus `apps/server`, database migrations, Redis configuration, and startup tools. The backend uses NestJS 12.3.3, Prisma 7.10.1, PostgreSQL 18, and Redis client 6.3.1. Compose uses Redis 8.2.11. See the distribution manifest and lockfile for pinned versions.

### Local development {#本地开发}

Install dependencies and prepare Docker Compose, then run the following.

```sh
pnpm fullstack:setup
pnpm dev:full
```

The first setup creates private `apps/server/.env.local`, generates database and Redis configuration, a random admin password, and a JWT signing key, starts PostgreSQL and Redis, applies migrations, and initializes the administrator. Read the initial username and password locally and keep them out of Git, uploads, and frontend variables. `123456` is the frontend demo password.

Subsequent setup runs reuse configuration and preserve accounts and database contents. `dev:full` waits for backend readiness before starting the frontend. Vite proxies same-origin `/api/` requests and disables mocks. The default address is `http://127.0.0.1:9527/ray-template/`. Use `ADMIN_DEV_PORT` and `PORT` for frontend and backend ports. Ctrl+C stops the dev process. `pnpm fullstack:stop` stops Compose services and retains data volumes.

### Use existing PostgreSQL and Redis services {#使用已有数据库与-redis}

Provide `DATABASE_URL` and `REDIS_URL` in the process's secure environment, then run the following.

```sh
pnpm fullstack:setup --external
pnpm dev:full
```

`--external` skips starting Docker services and still runs migrations and initialization. It preserves an existing `apps/server/.env.local`. Process variables take precedence. Use a database dedicated to the project, since migration and initialization create or update its schema and data. Manage external services through their own deployment environment.

### Create a real sign-in account {#创建真实登录账号}

After adding a user in User Management, an administrator with `users:credentials` can choose **Set password** for the account. Signed-in users can change their own password from **Profile** in the avatar menu by entering their current password. Changing or resetting the password revokes all sessions for that account. Passwords must be 12–128 characters.

For credential recovery, an operator can supply `CREDENTIAL_USERNAME` and `CREDENTIAL_PASSWORD` in a secure environment and run `pnpm server:credential:set` from a trusted terminal with database access. Re-running setup preserves renamed accounts and existing passwords. Keep credentials out of command lines, terminal transcripts, and AI conversations.

### Service commands and checks {#服务与运行检查}

| Command or endpoint            | Purpose                                                                                  |
| ------------------------------ | ---------------------------------------------------------------------------------------- |
| `pnpm server:build`            | Generate Prisma Client and build the standalone server.                                  |
| `pnpm server:start`            | Start the built server.                                                                  |
| `pnpm server:check`            | Run server type checks and unit/platform tests, then build.                              |
| `pnpm server:test:integration` | Check real persistence and HTTP behavior using `TEST_DATABASE_URL` and `TEST_REDIS_URL`. |
| `GET /api/health/live`         | Process liveness.                                                                        |
| `GET /api/health/ready`        | PostgreSQL and Redis readiness.                                                          |

The full stack includes configuration validation, endpoint authorization, session revocation, Redis rate limits, security headers, CORS, request IDs, redacted logs, and audit records. When Redis is unavailable, management requests return 503. Only reconstructible demo reads are cached. Session and permission checks use the database each time.

Production disables demo endpoints by default and removes the corresponding demo routes from the runtime menu. Authorized editors can still manage the full route configuration. Production API failures surface as errors.

### Container startup {#容器启动}

Use Node.js 26.13.0 and a running Docker installation with the Compose v2 plugin. Verify `docker compose version` and `docker info`. From the extracted full-stack source or complete repository root, run the following.

```sh
node scripts/fullstack.mjs up
# With pnpm, you can also run pnpm fullstack:up
```

The command creates private configuration, builds Admin and the API, starts PostgreSQL and Redis, applies migrations and initialization, and prints the local entry point after readiness. The host can build without preinstalled frontend dependencies. The default address is `http://127.0.0.1:8080/ray-template/`. Change it with `APP_PORT`. Stop services with `node scripts/fullstack.mjs stop` to keep the data volumes. For several isolated instances, assign each a distinct `RAY_COMPOSE_PROJECT`, host port, and `APP_PROXY_NETWORK`.

Nginx proxies same-origin `/api/` to the backend. The host port listens on loopback by default. Production disables demo features unless `APP_DEMO_ENABLED=true`. For an external HTTPS entry point, set `APP_ORIGINS` to the actual browser origin and `APP_SESSION_COOKIE_SECURE=true`, and serve `/ray-template/` and `/api/` on the same origin. The example Nginx overwrites forwarded headers. With an outer proxy, configure Nginx real IP to trust only the immediately upstream proxy and check that client-supplied forwarding headers cannot falsify the rate-limit address. If proxy subnets conflict, change `APP_PROXY_NETWORK`, for example to `172.30.68`. For containers using external data services, set correctly encoded `APP_DATABASE_URL` and `APP_REDIS_URL`. For local development with existing services, use `setup --external`.

### Deployment verification for operators and agents {#给部署者和-ai-的验收清单}

1. Verify that the distribution includes `apps/server`, `deploy/compose.yaml`, and `scripts/fullstack.mjs`. Use the container workflow by default, or local development for hot reload. Use a dedicated database and Redis key prefix for existing services. Resolve port conflicts with `APP_PORT` for containers or `ADMIN_DEV_PORT` and `PORT` for local development. Database and Redis port mappings use `POSTGRES_PORT` and `REDIS_PORT`.
2. Prepare PostgreSQL migration permissions, a Redis connection, and private server configuration. Replicas share a `JWT_SECRET` consisting of 32 random bytes encoded as base64url. Use separate keys for different environments. For older workspaces, rerun `setup` or `up` to fill in missing keys. Back up PostgreSQL before migrating. Old tokens require users to sign in again. The initial password is used only when creating the initial account.
3. Check for 200 from `GET /api/health/live` and `GET /api/health/ready`, and for 401 from an unauthenticated `GET /api/admin/route-config`. After sign-in, check User Management, Profile, and Route Management. Set a password for a test account and confirm that a read-only account cannot write. An account with no menu entries should still be able to open Profile.
4. If only liveness passes, inspect Compose `ps -a` and `logs initialize server` for migration, initialization, and connection errors. Use `--env-file apps/server/.env.local -f deploy/compose.yaml --profile app -p <project-name>`. Read redacted logs and keep environment file values private. If the browser still gets 401 after sign-in, check the actual origin, same-origin proxy, and secure cookie setting. For external deployment, also verify HTTPS, backup and restore, and proxy rate limiting.

`node deploy/smoke.mjs` uses an isolated temporary Compose project to check migration, builds, sign-in, routing, CORS, the demo switch, and proxy rate limits. It cleans up only the test resources it creates.

### Generated branches and release assets {#生成分支与-release-资产}

Maintainers can run **Source distributions** manually from `main` in GitHub Actions. By default it verifies and uploads that run's archives. Select `sync_frontend` to rebuild the generated `frontend` branch from the mainline. To attach both source archives and the SHA-256 file to an existing release, supply `release_tag`. The workflow checks the tag version and commit, verifies the archives, and preserves existing assets with the same name.

<!-- fullstack:end -->
