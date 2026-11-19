# Backend integration and the standard API contract {#服务端接入与标准契约}

Sign-in, sessions, user management, and route management use the same HTTP API. [Source distributions and startup](./distributions)

MSW intercepts requests at the network layer in development and in the static hosted demo. Pages and stores go through the API layer. To connect your own backend, keep the pages and call sites and provide a new API address and implementation.

<script setup>
import { withBase } from 'vitepress'
</script>

<a :href="withBase('/contracts/admin-api.json')" target="_blank" rel="noreferrer">Download the OpenAPI 3.1 contract</a>

The contract is generated from the `@ray-template/api-contracts` workspace package and the route schema. It covers request bodies, responses, query parameters, Bearer authentication, and permission codes. Import sign-in and user contracts from `/admin`, demo contracts from `/demo`, and route schemas from `/routes`. `/openapi` exports the OpenAPI generator. `packages/api-contracts/src/routes.ts` is the source of truth for the route schema, and the older routing entry point re-exports it. The package is independent of browser state, so the frontend, mocks, and your backend can share types and runtime validation. It is distributed with the workspace. The existing application paths `api/admin/contracts.ts` and `api/demo/contracts.ts` remain compatible. Run `pnpm api:generate` after changes. `pnpm api:check` checks the generated files against the runtime schemas.

```ts
import type { ApiResponse, UserInput } from '@ray-template/api-contracts/admin'
import { userInputSchema } from '@ray-template/api-contracts/admin'
import type {
  DemoOrderQuery,
  SearchOptions,
} from '@ray-template/api-contracts/demo'
```

## Connect your service {#接入步骤}

Configure `apps/admin/.env.local` and restart or rebuild the app.

```dotenv
VITE_API_MOCK=false
VITE_API_BASE_URL=https://your-api.example.com/api/
```

A deployment proxy can also forward same-origin `/api/` requests. Setting `VITE_API_BASE_URL` disables mocks by default. Set `VITE_API_MOCK=true` to explicitly re-enable them. The base URL can include a version prefix. Pages use the methods in `api/admin`. `VITE_*` values are bundled for the browser, so use them only for public configuration.

The application waits for the worker before sending mock API requests. Before each API request, it checks an internal health marker. If the browser reclaimed the worker, the same MSW client calls `stop()` and `start()` to restore its listeners and interception state. If recovery fails, the request is blocked and form and demo data remain intact. `GET /admin/mock-health` is internal to mock mode. The worker is served at `/ray-template/mockServiceWorker.js`, with a query parameter for the current MSW version and a scope matching the application base. Serve the script at that path over HTTPS or on localhost. GitHub Pages hosts static files. The worker in a running demo page handles API calls, while opening the API address directly returns 404. In backend mode, requests go straight to the configured service and failures surface to the caller. MSW is pinned to 3.0.4. Installation skips the worker copy step. After upgrading, run `pnpm exec msw init apps/admin/public --save` and verify the contract and browser behavior.

<!-- fullstack:start -->

## Bundled NestJS backend {#配套-nestjs-服务端}

The complete source includes `apps/server`, which implements the same `/api/admin/*` protocol. Existing page-level calls work with it. For local development, use `pnpm fullstack:setup` and `pnpm dev:full`. To use an existing PostgreSQL and Redis instance, run `pnpm fullstack:setup --external`. The generated admin credentials are stored in private `apps/server/.env.local`. Use them to sign in to the real backend. [Full-stack distribution](./distributions#全栈发行包)

PostgreSQL persists users, departments, role grants, sessions, route configuration, and audit records. Normalized unique fields prevent conflicts in usernames and emails that differ only by case. Bulk mutations, account protections, and audit writes run in transactions. Initialization adds missing seed data and preserves existing settings, routes, and accounts on subsequent runs.

The backend uses signed JWTs as session credentials and stores only token digests in PostgreSQL. It derives passwords with randomly salted scrypt. Each request checks the JWT signature and expiry, the stored session, and current permissions. The bundled same-origin Admin uses an HttpOnly cookie. API clients can use Bearer authentication. Sign-out revokes the current session. Disabling an account, changing its role, or changing its password revokes all its sessions.

Create a user record first, then let an authorized administrator set the credential from User Management. Operators can recover credentials with `pnpm server:credential:set`. The bundled `dev:full` and Compose set `VITE_API_AUTH_TRANSPORT=cookie`. For a manual build, pair it with a same-origin proxy and `VITE_API_BASE_URL=/api/`. Enable secure cookies for HTTPS deployments. Cookie-mode requests send `X-Ray-Session: cookie`. Writes must also come from an allowed same-origin page.

Redis rate-limits API calls, sign-in, and password changes across processes and caches reconstructible demo reads. Session and permission checks go to the database. Responses carry `X-Request-Id`. JSON logs record the route template, status, and duration and omit request bodies, query strings, credentials, and raw connection errors. Readiness at `/api/health/ready` checks that the database is initialized and Redis is available. Liveness is at `/api/health/live`.

Configure explicit CORS origins and trusted proxies. Forwarded headers are untrusted by default. Invalid JSON, oversized requests, rate limits, and dependency failures return standard error envelopes. `POST /admin/users/reset` is a mock-only endpoint. A Redis outage returns 503 and protected traffic remains blocked.

`DEMO_ENABLED` defaults to on in development and off in production. When enabled, `/admin/demo/*` serves public fixtures consistent with the mocks. When disabled, the demo endpoints return 404 and runtime routes omit demo views and redirects to them. The stored route configuration remains available to authorized editors.

<!-- fullstack:end -->

## Response envelope {#统一响应}

Successful requests return HTTP 200 with this envelope.

```json
{
  "code": 200,
  "msg": "OK",
  "data": { "items": [], "total": 0 }
}
```

Paginated requests use `page` starting at 1 and `pageSize` from 1 to 100. `data.items` is the current page, and `data.total` is the count after all filters. Filters apply before pagination. Detail and write endpoints put a single object in `data`. Bulk mutations return an affected count such as `{ "affected": 2 }`.

Failures use the corresponding HTTP status and `code` with `data` set to `null`.

```json
{
  "code": 409,
  "msg": "duplicateUsername",
  "data": null,
  "error": { "key": "duplicateUsername" }
}
```

Successful reads of user details and full route configuration (`view=editor`) include an opaque `revision`. When saving the same resource, send `If-Match: "<revision>"`. If it changed since the read, the API returns 412 with `editConflict` and the editor retains the draft. Reload and compare changes before resubmitting. Clients can still omit the header for unconditional replacement. A custom backend must return the revision and check it within the write transaction to provide the same concurrency protection.

| Status | Meaning                                                                                 |
| ------ | --------------------------------------------------------------------------------------- |
| 400    | Invalid input                                                                           |
| 401    | Invalid or expired session                                                              |
| 403    | Insufficient permissions                                                                |
| 404    | Resource missing                                                                        |
| 409    | Username or email conflict, or current account is protected                             |
| 413    | Request body too large                                                                  |
| 429    | Rate limit exceeded                                                                     |
| 503    | Storage or dependency temporarily unavailable, including mock database writes that fail |

`error.key` is a stable application error identifier. Optional `error.fields` maps field names to error keys. The API layer converts failures to `AdminApiError`, and User Management translates known keys into Chinese and English. The API layer also validates read responses against their schemas.

## Sign-in, sessions, and permissions {#登录、会话与权限}

| Method and path              | Input                              | Successful data                                                                   |
| ---------------------------- | ---------------------------------- | --------------------------------------------------------------------------------- |
| `POST /admin/auth/login`     | `{ username, password }`           | `{ accessToken, expiresAt, user, permissions }`. Cookie mode omits `accessToken`. |
| `GET /admin/auth/session`    | Session                            | `{ user, permissions, expiresAt? }`                                               |
| `POST /admin/auth/logout`    | Session                            | `null`                                                                            |
| `GET /admin/auth/profile`    | Session                            | Current account profile and department                                            |
| `PATCH /admin/auth/profile`  | `{ name, phone }`                  | Updated current account profile                                                   |
| `PATCH /admin/auth/password` | `{ currentPassword, newPassword }` | `null`. Sign in again.                                                            |

```json
{
  "user": { "id": "u-1", "username": "admin", "name": "Alex", "role": "admin" },
  "permissions": [
    "users:read",
    "users:create",
    "users:update",
    "routes:read",
    "routes:write"
  ]
}
```

Custom backends use `Authorization: Bearer <accessToken>` by default. The app fetches the session and permissions again on startup. A 401 clears the invalid session, and other errors remain failure states. The route contract uses one `user.role`, while `meta.role` is an array of allowed roles. Permission codes are independent of role names, so the backend can assign them as needed. Users can edit their own name and phone. Manage username, email, role, and department in User Management.

```tsx
import { useAccess } from '@/hooks'

const { hasPermission } = useAccess()

// All permissions are required by default. Pass 'any' as the second argument to require just one.
hasPermission('users:create')
hasPermission(['users:update', 'users:delete'], 'any')
```

The frontend uses permissions for menus, navigation, and action placement. The backend must independently authorize every business request. The mock API also enforces role and account protections on direct requests. The demo accounts `admin` (also `Ray Admin`), `manager`, and `member` all use `123456`. They have full access, user-maintenance access, and read-only access, respectively. Demo passwords and mock tokens are for the live demo.

## User management {#用户管理}

| Method and path                    | Input                                                         | Required permission |
| ---------------------------------- | ------------------------------------------------------------- | ------------------- |
| `GET /admin/users/options`         | None                                                          | `users:read`        |
| `GET /admin/users`                 | Pagination and `name/username/email/departmentId/role/status` | `users:read`        |
| `GET /admin/users/{id}`            | Path ID                                                       | `users:read`        |
| `POST /admin/users`                | `UserInput`                                                   | `users:create`      |
| `PUT /admin/users/{id}`            | Complete `UserInput`                                          | `users:update`      |
| `POST /admin/users/batch-delete`   | `{ ids: string[] }`                                           | `users:delete`      |
| `PATCH /admin/users/status`        | `{ ids: string[], status }`, with `"enabled"` or `"disabled"` | `users:status`      |
| `PUT /admin/users/{id}/credential` | `{ newPassword }` for an account other than the current one   | `users:credentials` |
| `POST /admin/users/reset`          | None. Demo reset only.                                        | `users:reset`       |

```json
{
  "username": "alex",
  "name": "Alex",
  "email": "alex@example.com",
  "phone": "",
  "departmentId": "engineering",
  "role": "member",
  "status": "enabled",
  "remark": ""
}
```

User responses add a stable `id` and ISO 8601 `createdAt`. Usernames and emails are unique regardless of case. Updates keep the ID and creation time. The options endpoint returns `{ departments: [{ id, parentId, name, labelKey? }], roles: [{ value, label, labelKey?, disabled? }] }`. A department filter includes descendants. The demo uses optional `labelKey` for translations. A custom backend can return labels directly.

The API validates the entire batch before committing it. Users cannot delete or disable their own accounts or change their own roles through the editor. Editing status also requires `users:status`. Managing target accounts and their credentials requires the appropriate permissions, and managers cannot manage administrator accounts. The mock database persists users, routes, and sessions in the current browser. User Management shows the reset action only in mock mode.

## Route management {#路由管理}

After sign-in, `GET /admin/route-config` returns `data: { version: 1, routes: [...] }` for the current session. The server considers parent and child roles, view permissions, and the demo switch. It removes groups without accessible children and redirects without an authorized target. Without `routes:read` or any accessible page, it returns `routes: []`. The shell and profile remain available. A session with `routes:write` can read the full configuration with `GET /admin/route-config?view=editor` and save it with `PUT /admin/route-config`.

Initial menus live in `packages/demo-data/src/routes.json`. In standard API mode, the server's route configuration is authoritative. Runtime routes are registered at sign-in and reloaded after saving. Load failures surface as errors. Direct access to a pruned business route shows 404, and opening the reserved Route Management entry without edit rights shows 403. Business APIs authorize requests independently. Imports, exports, and the API use the same structure. [Route contract](./routing)

`router/config/views.ts` is the frontend allowlist of component IDs. The API returns registered IDs, keeping executable component code in the frontend. The shell reserves sign-in, 404, and the protected Route Management entry. `VITE_ROUTE_CONFIG_URL` remains compatible with older raw JSON read endpoints. Use the standard API base for full read and write support.

## Verify against the live demo {#在线验证}

The demo endpoints use the same standard HTTP contract.

| Method and path                     | Input                                                          | Successful data                                                         |
| ----------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `GET /admin/demo/people`            | `page/pageSize/name/email/sortAge/fail`                        | `{ items: Person[], total }`                                            |
| `GET /admin/demo/route-people`      | `page/pageSize/name`. Exact name matching preserves old links. | `{ items: RouteDemoPerson[], total }`                                   |
| `GET /admin/demo/route-people/{id}` | Nonnegative integer ID starting at 0                           | `RouteDemoPerson`, or 404 when missing                                  |
| `GET /admin/demo/search-options`    | `locale`                                                       | Status, organization, product category, warehouse, and delivery options |
| `POST /admin/demo/orders/search`    | `{ query: DemoOrderQuery, locale, fail? }`                     | `{ items: DemoOrder[], total }`                                         |
| `POST /admin/demo/owners/search`    | `{ orgId, keyword, locale, fail? }`                            | `{ value, label }[]`                                                    |
| `GET /admin/demo/charts`            | `refresh`                                                      | `DemoCharts`                                                            |
| `GET /admin/demo/request`           | None                                                           | Ticket and city data                                                    |

The page size limit is 100. `sortAge` is `ascend` or `descend`. `refresh` and the demo-only `fail` are booleans. Invalid input returns HTTP 400. Shared schemas and OpenAPI define order filter fields, types, date formats, and minimum amounts. `fail=true` simulates a remote failure with HTTP 503.

The search page loads business options from the API. Order responses include warehouse and delivery names directly. If options fail to load, the UI offers a retry. Switching language or leaving the page cancels older requests. Route-demo lists and details also come from the API and support old lookup links by name. Preset scenarios and failure buttons appear only in mock mode.

Open the browser's Network panel. Sign in, open User Management, run a query, create or edit a user, open the details, and save a route to see the corresponding HTTP requests. The hosted demo marks responses as coming from the service worker. It simulates the server protocol on static hosting. When connected to a real backend, the same page requests go to the configured API base.

User Management reuses `RTablePro`, `RForm/useForm`, and Naive UI. On desktop, both panels fill the content area. The organization card uses `contentScrollable`, and the table uses `autoHeight`. On narrow screens the panels stack, and existing scrolling components keep the page usable.
