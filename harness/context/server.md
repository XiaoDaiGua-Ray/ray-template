# Optional NestJS server

Use this topic for the fullstack distribution, database persistence, authentication, permissions, Redis limits/cache, security, logs, and server startup.

Read the [server guide](../../apps/server/README.md), [platform contract](../../apps/server/src/platform/README.md), [shared contracts](../../packages/api-contracts/README.md), and [source distribution guide](../../apps/docs/guide/distributions.md). The [PC acceptance plan](../fullstack-acceptance.md) covers authentication, navigation, and setup from a clean environment.

- [Bootstrap](../../apps/server/src/app.ts) owns Nest modules and platform lifecycle. [Platform](../../apps/server/src/platform/index.ts) owns environment validation, Redis, request logging, security headers, CORS, limits, and health checks.
- [Database](../../apps/server/src/infrastructure/database.ts) owns Prisma lifetime and transaction retries. [Schema](../../apps/server/prisma/schema.prisma) and migrations are server-only. [Seed](../../apps/server/src/seed.ts) must preserve existing data.
- [Authentication](../../apps/server/src/modules/auth/auth.service.ts) checks signed JWTs against live sessions and permission grants. Credential/session state must not use the reusable data cache.
- [Users](../../apps/server/src/modules/users/users.service.ts) validates and authorizes writes inside transactions. [Routes](../../apps/server/src/modules/routes/routes.controller.ts) use the shared route parser and generated catalog.
- [Fullstack launcher](../../scripts/fullstack.mjs) creates local configuration and orchestrates services. [Distribution exporter](../../scripts/distributions.mjs) projects independent frontend/fullstack workspaces; it never publishes branches or releases.

`pnpm harness verify server` runs type checks, unit/platform tests, and the backend build without requiring PostgreSQL. Real HTTP integration is explicit: set `TEST_DATABASE_URL` and `TEST_REDIS_URL`, then run `pnpm server:test:integration`. Tests own random schemas/prefixes and clean only those resources. Run the full Harness at integration completion and browser verification for the affected login, user and routing flows. Container builds and remote publication require independent evidence.
