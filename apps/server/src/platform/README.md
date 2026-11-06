# Server platform

`PlatformRuntime` owns the Redis connection, HTTP security middleware, request logs, rate limits, read-through cache, and health probes. Authentication and authorization remain in the business modules; permission decisions and sessions must never use the optional read-through cache.

Create the Nest application with `bodyParser: false`, install the runtime before `app.init()` or `app.listen()`, and await `runtime.close()` during application shutdown. The runtime installs its bounded JSON parser after logging and security headers, so malformed and oversized payloads also receive the standard error envelope and request ID. The API exception filter remains responsible for controller failures.

## Configuration

| Variable                | Default                                 | Meaning                                                                                             |
| ----------------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `NODE_ENV`              | `development`                           | `development`, `test`, or `production`                                                              |
| `HOST`                  | `127.0.0.1`                             | Listening interface; containers explicitly use `0.0.0.0`                                            |
| `PORT`                  | `3000`                                  | HTTP port; port zero is allowed only in tests                                                       |
| `DATABASE_URL`          | Required                                | PostgreSQL connection URL                                                                           |
| `REDIS_URL`             | Required                                | Redis connection URL; use `rediss:` for TLS                                                         |
| `JWT_SECRET`            | Required                                | 32 random bytes encoded as base64url, shared by replicas of this deployment                         |
| `SESSION_COOKIE_SECURE` | `true` in production, otherwise `false` | Secure host-only cookie for HTTPS; use `false` only with loopback HTTP                              |
| `REDIS_KEY_PREFIX`      | `ray:<NODE_ENV>`                        | Isolate applications and environments sharing Redis                                                 |
| `CORS_ORIGINS`          | Empty                                   | Comma-separated exact origins, including the web application's origin; no wildcard or paths         |
| `TRUST_PROXY`           | `false`                                 | Comma-separated trusted proxy IP addresses/CIDRs; unrestricted trust and hop counts are rejected    |
| `DEMO_ENABLED`          | `false` in production, otherwise `true` | Whether the host registers read-only demonstration endpoints                                        |
| `SESSION_TTL_SECONDS`   | `28800`                                 | Session expiry consumed by the authentication module                                                |
| `BODY_LIMIT_BYTES`      | `262144`                                | JSON payload limit, up to 1 MiB                                                                     |
| `REQUEST_TIMEOUT_MS`    | `15000`                                 | Node's request reception timeout, not a controller execution deadline                               |
| `RATE_LIMIT_MAX`        | `300`                                   | Requests per client IP per fixed 60-second window                                                   |
| `LOGIN_RATE_LIMIT_MAX`  | `10`                                    | Login attempts per normalized account per fixed 15-minute window; IP limit is five times this value |

Bearer requests can omit Origin. Browser cookie requests require `X-Ray-Session: cookie`; writes also require an exact allowlisted Origin. Cross-origin fetch metadata is rejected and credentialed CORS is disabled. Keep the bundled browser and API on the same origin.

Proxy trust defaults to the direct socket address. Configure only proxies that overwrite incoming forwarding headers; otherwise a caller may impersonate another IP. Exact CORS matching is a browser boundary, not authorization.

## Redis behavior

Rate counters use an atomic Lua increment/expiry operation. Account, session and IP identities are hashed before becoming Redis keys. Login and self password change limits run before password verification and cover case-insensitive paths. Limits count successful and unsuccessful attempts. Redis outages return HTTP 503 and fail readiness.

`runtime.cache.getOrLoad(key, ttlSeconds, loader, validator?)` is for reconstructible, non-sensitive reads such as demonstration chart data. Cache failures load the original data, while loader errors propagate. Validate cached payloads at the consuming contract when appropriate. `invalidate(key)` propagates Redis failures so callers cannot mistake failed invalidation for success.

The client disables offline command queues, bounds connection and command waits, reconnects after transient failures, and closes gracefully. A connection failure never prints the connection URL. Tests use a unique key prefix and TTL-bound keys; they must not flush a shared Redis database.

## HTTP observability and probes

Every response has `X-Request-Id`. A valid bounded incoming ID is reused; otherwise a random UUID is generated. Completion logs contain only timestamp, level, event, request ID, HTTP method, route template, status, and duration. Unmatched or rejected requests do not log raw paths. Request bodies, headers, query strings, resource IDs, and raw error messages are excluded. Dependency errors use a small allowlist of diagnostic codes.

- `GET /api/health/live` reports whether the process can answer HTTP.
- `GET /api/health/ready` checks the seeded PostgreSQL route record and Redis with a bounded read-only probe and returns 503 on failure. It exposes no connection details.

Node's request/header timeouts bound slow request reception. They do not race a transaction against an HTTP response: the database layer owns query and transaction timeouts. There is no attempt to report a timed-out mutation as cancelled while it continues committing.

Platform tests cover configuration, redaction, real HTTP security/CORS/body limits, forwarded-header spoofing, rate-limit denial, fail-closed Redis outages, readiness, and cache behavior. Set `TEST_REDIS_URL` to include the real Redis concurrency and expiry regression.
