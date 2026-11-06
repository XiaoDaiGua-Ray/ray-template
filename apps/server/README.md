# Ray Template server

An optional NestJS application implementing the shared admin HTTP contract. It owns PostgreSQL persistence and API authorization. Browser applications consume the contract package, not this application or Prisma models.

## Runtime and configuration

Use the repository's pinned Node.js and pnpm versions. PostgreSQL and Redis must be reachable before starting the server. Configuration is loaded from `apps/server/.env.local` by the development, start and credential scripts. The Prisma config loads the same file for migrations. The root fullstack setup command prepares local development configuration.

Required fields are `DATABASE_URL`, `REDIS_URL`, and `JWT_SECRET` (32 random bytes encoded as base64url). The launcher generates the key once; replicas of the same environment must share it. Store secrets in private configuration. See [platform configuration](src/platform/README.md) for origins, limits and readiness, and the [deployment runbook](../docs/guide/distributions.md) for Compose and external services.

```sh
pnpm --filter @ray-template/server db:migrate
pnpm --filter @ray-template/server db:seed
pnpm --filter @ray-template/server dev
```

Initialization requires `ADMIN_PASSWORD` (12–128 characters) when creating the first administrator. `ADMIN_USERNAME` defaults to `admin`; `ADMIN_EMAIL` is optional. Re-running the seed preserves existing users, credentials, grants and route configuration even after the administrator is renamed. There is no HTTP database reset endpoint.

## API and ownership

The API prefix is `/api`. It covers login, session, logout, self profile and password, user and credential management, and route configuration. Success uses `{ code: 200, msg: 'OK', data }`; errors return the matching HTTP status, `data: null`, and a stable `error.key`. See the [HTTP contract](../docs/guide/backend.md).

The runtime route configuration requires an active session and filters by `routes:read`, ancestor and leaf roles, view grants, and the demo flag. It removes empty groups and unusable redirects. No accessible routes yields `{ version: 1, routes: [] }`. The complete editor view and route writes require `routes:write`. The global guard enforces endpoint permissions and mutations recheck them in serializable transactions.

When `DEMO_ENABLED=true`, public `/admin/demo/*` endpoints use the same fixtures as Mock. Redis caches only fixed request and chart fixtures and the two search-option locales for five minutes. Demos default to off in production.

Usernames and email addresses have normalized unique database keys. Department queries include descendants. Bulk updates and deletion are atomic, deduplicate IDs, and reject changes to missing/protected targets. A user cannot delete or disable their own account or change their own role. Non-admin actors cannot manage roles with permissions they do not hold.

Authentication verifies the JWT signature, issuer, audience and expiry, then checks the token digest and live account grants in PostgreSQL. Passwords use salted scrypt. Logout revokes the current session; password changes, credential reset, account disabling and role changes revoke all affected sessions. The upgrade requires existing opaque-token clients to sign in again. Audits omit passwords, tokens and request bodies.

Users can edit their own name and phone and change their password by proving the current password. An authorized administrator can set another user's password from User Management. Operators can recover a credential from a trusted terminal using private environment variables:

```sh
pnpm --filter @ray-template/server credential:set
```

This command reads `CREDENTIAL_USERNAME` and `CREDENTIAL_PASSWORD`, preserves account status/role, and revokes all sessions for that user. Remove temporary credential variables from local files after use. Expired sessions can be pruned with `node --env-file-if-exists=.env.local dist/cli.mjs cleanup-sessions` from this application directory.

The bundled same-origin Admin uses an HttpOnly, SameSite=Strict cookie with `X-Ray-Session: cookie`; login does not return the token in JSON in this mode. Use Secure host-only cookies over HTTPS. Explicit Bearer login remains available to API clients.

## Build and checks

```sh
pnpm --filter @ray-template/server check
pnpm --filter @ray-template/server test:integration
```

`check` generates the Prisma client, type-checks, runs unit/platform tests, and bundles production entry points. The bundler includes workspace TypeScript source; npm runtime dependencies remain external. Production runs `dist/main.mjs` with this application's installed dependencies.

Integration tests require `TEST_DATABASE_URL` and `TEST_REDIS_URL` pointing to disposable services. They create an isolated random PostgreSQL schema, apply the checked-in migration SQL, exercise HTTP requests against Nest, and drop only that schema afterward. Redis counters use a unique test prefix and expire. Tests never reset the configured database. They cover authorization, uniqueness, transaction atomicity, credential/session invalidation, route validation, restart persistence and repeatable initialization. The unit command does not claim that PostgreSQL integration passed.

Database migrations are explicit deployment operations; starting the HTTP server does not migrate or reseed data. Deployments must provide TLS at the proxy, database backups, bounded log retention and reviewed trusted proxy settings. Readiness depends on both PostgreSQL and Redis; rate-limit failures deny protected API traffic rather than bypassing throttling.
