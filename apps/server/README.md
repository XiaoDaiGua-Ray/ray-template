# Ray Template server

An optional NestJS application implementing the shared admin HTTP contract. It owns PostgreSQL persistence and API authorization. Browser applications consume the contract package, not this application or Prisma models.

## Runtime and configuration

Use the repository's pinned Node.js and pnpm versions. PostgreSQL and Redis must be reachable before starting the server. Configuration is loaded from `apps/server/.env.local` by the development, start and credential scripts. The Prisma config loads the same file for migrations. The root fullstack setup command prepares local development configuration.

Required connection fields are `DATABASE_URL` and `REDIS_URL`. Keep credentials in local environment files or a deployment secret store; never in `VITE_*` variables. See [platform configuration](src/platform/README.md) for exact origin allowlists, trusted proxies, rate limits, logging and readiness settings.

```sh
pnpm --filter @ray-template/server db:migrate
pnpm --filter @ray-template/server db:seed
pnpm --filter @ray-template/server dev
```

Initialization requires `ADMIN_PASSWORD` (12–128 characters) when creating the first account. `ADMIN_USERNAME` defaults to `admin`; `ADMIN_EMAIL` is optional. There is no built-in login password and no HTTP database reset endpoint. Re-running the seed preserves existing users, credentials, role assignments, permission assignments and route configuration.

## API and ownership

The API prefix is `/api`. Controllers provide `/admin/auth/login`, `/admin/auth/session`, `/admin/auth/logout`, `/admin/users`, user options/status/batch deletion, and `/admin/route-config`. Success responses use `{ code: 200, msg: 'OK', data }`; failures return the corresponding HTTP status with `data: null` and a stable `error.key`.

The startup route configuration is public because the admin application needs it before login. `GET /admin/route-config?view=editor` and route writes require `routes:write`; writes use the same semantic validator and generated view/icon catalog as the frontend. Protected core endpoints require an active server session. The global guard enforces endpoint permissions; mutation services recheck the actor and targets inside serializable transactions.

When `DEMO_ENABLED=true`, the public `/admin/demo/*` endpoints use the same fixture queries as Mock. Redis caches only the fixed request and chart fixtures and the two search-option locales for five minutes. In production demos default to off: these endpoints are absent and the public route configuration omits demo views, empty groups and redirects that would point to hidden views. The authorized editor still receives the complete saved configuration.

Usernames and email addresses have normalized unique database keys. Department queries include descendants. Bulk updates and deletion are atomic, deduplicate IDs, and reject changes to missing/protected targets. A user cannot delete or disable their own account or change their own role. Non-admin actors cannot manage roles with permissions they do not hold.

Authentication uses random opaque bearer tokens. Only SHA-256 token digests are stored; authorization reads current account status and role permissions from PostgreSQL on every request. Passwords use salted Node.js scrypt. Expired sessions are rejected; logout, credential reset, account disabling and role changes revoke effective access. Mutations and authentication changes write audit records without passwords, tokens or request bodies.

New users created through the profile API have no password. Set or reset one explicitly through the credential command using environment variables, not command-line password arguments:

```sh
pnpm --filter @ray-template/server credential:set
```

This command reads `CREDENTIAL_USERNAME` and `CREDENTIAL_PASSWORD`, preserves account status/role, and revokes all sessions for that user. Remove temporary credential variables from local files after use. Expired sessions can be pruned with `node --env-file-if-exists=.env.local dist/cli.mjs cleanup-sessions` from this application directory.

The initial browser integration preserves the existing Bearer contract. Moving browser credentials to HttpOnly cookies requires a coordinated login-contract, request-client and CSRF change; it is not implied by enabling the backend.

## Build and checks

```sh
pnpm --filter @ray-template/server check
pnpm --filter @ray-template/server test:integration
```

`check` generates the Prisma client, type-checks, runs unit/platform tests, and bundles production entry points. The bundler includes workspace TypeScript source; npm runtime dependencies remain external. Production runs `dist/main.mjs` with this application's installed dependencies.

Integration tests require `TEST_DATABASE_URL` and `TEST_REDIS_URL` pointing to disposable services. They create an isolated random PostgreSQL schema, apply the checked-in migration SQL, exercise HTTP requests against Nest, and drop only that schema afterward. Redis counters use a unique test prefix and expire. Tests never reset the configured database. They cover authorization, uniqueness, transaction atomicity, credential/session invalidation, route validation, restart persistence and repeatable initialization. The unit command does not claim that PostgreSQL integration passed.

Database migrations are explicit deployment operations; starting the HTTP server does not migrate or reseed data. Deployments must provide TLS at the proxy, database backups, bounded log retention and reviewed trusted proxy settings. Readiness depends on both PostgreSQL and Redis; rate-limit failures deny protected API traffic rather than bypassing throttling.
