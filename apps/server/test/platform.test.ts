import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import type { AddressInfo } from 'node:net'
import { test } from 'node:test'
import { Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import type { Express, Request, Response } from 'express'
import { loadServerConfig } from '../src/platform/config.js'
import {
  requestIdFor,
  safeErrorCode,
  writeLog,
} from '../src/platform/logging.js'
import {
  RedisJsonCache,
  RedisRateLimiter,
  RedisStore,
} from '../src/platform/redis.js'
import type { RedisCommands } from '../src/platform/redis.js'
import { PlatformRuntime } from '../src/platform/runtime.js'

const config = (extra: NodeJS.ProcessEnv = {}) =>
  loadServerConfig({
    NODE_ENV: 'test',
    DATABASE_URL: 'postgresql://test:test@127.0.0.1:5432/test',
    REDIS_URL: process.env.TEST_REDIS_URL || 'redis://127.0.0.1:6379',
    CORS_ORIGINS: 'http://localhost:9527',
    REDIS_KEY_PREFIX: `ray:test:${randomUUID()}`,
    ...extra,
  })

class TestRedis implements RedisCommands {
  isReady = true
  readonly values = new Map<string, string>()
  readonly counters = new Map<string, number>()
  readonly consumedKeys: string[] = []

  async eval(
    _script: string,
    options: { keys: string[]; arguments: string[] },
  ) {
    const key = options.keys[0]
    const count = (this.counters.get(key) ?? 0) + 1

    this.counters.set(key, count)
    this.consumedKeys.push(key)

    return [count, Number(options.arguments[0])]
  }

  async get(key: string) {
    return this.values.get(key) ?? null
  }
  async set(key: string, value: string) {
    this.values.set(key, value)
  }
  async del(key: string) {
    this.values.delete(key)
  }
  async ping() {
    return 'PONG'
  }
}

class TestModule {}

Module({})(TestModule)

async function withHttp(
  options: {
    env?: NodeJS.ProcessEnv
    redis?: TestRedis
    checkDatabase?: () => Promise<unknown>
  },
  run: (input: {
    url: string
    logs: string[]
    redis: TestRedis
    calls: () => number
  }) => Promise<void>,
) {
  const redis = options.redis ?? new TestRedis()
  const logs: string[] = []
  const app = await NestFactory.create<NestExpressApplication>(TestModule, {
    logger: false,
    bodyParser: false,
  })
  const runtime = new PlatformRuntime(config(options.env), redis, {
    checkDatabase: options.checkDatabase ?? (async () => true),
    logSink: (line) => logs.push(line),
  })

  runtime.install(app)
  let calls = 0
  const handler = (_request: Request, response: Response) => {
    calls += 1
    response.json({ code: 200, msg: 'OK', data: null })
  }

  const express = app.getHttpAdapter().getInstance() as Express

  express.post('/api/admin/auth/login', handler)
  express.get('/api/admin/users/:id', handler)
  await app.listen(0, '127.0.0.1')
  const address = app.getHttpServer().address() as AddressInfo

  try {
    await run({
      url: `http://127.0.0.1:${address.port}`,
      logs,
      redis,
      calls: () => calls,
    })
  } finally {
    await app.close()
    await runtime.close()
  }
}

test('configuration rejects malformed and unsafe inputs without exposing secrets', () => {
  const value = config()

  assert.equal(value.trustProxy, false)
  assert.equal(value.demoEnabled, true)
  assert.equal(value.sessionTtlSeconds, 28800)
  assert.equal(config({ NODE_ENV: 'production' }).demoEnabled, false)
  assert.deepEqual(
    config({ TRUST_PROXY: '127.0.0.1,10.0.0.0/8,::1' }).trustProxy,
    ['127.0.0.1', '10.0.0.0/8', '::1'],
  )

  for (const env of [
    { CORS_ORIGINS: '*' },
    { CORS_ORIGINS: 'https://example.com/path' },
    { TRUST_PROXY: 'true' },
    { TRUST_PROXY: '1' },
    { TRUST_PROXY: '0.0.0.0/0' },
    { TRUST_PROXY: '::/0' },
    { TRUST_PROXY: '10.0.0.0/99' },
    { NODE_ENV: 'prod' },
    { RATE_LIMIT_MAX: 'Infinity' },
    { SESSION_TTL_SECONDS: '0' },
    { DEMO_ENABLED: 'yes' },
    { REDIS_KEY_PREFIX: 'space is forbidden' },
  ])
    assert.throws(() => config(env))

  assert.throws(
    () =>
      config({ DATABASE_URL: 'mysql://root:private-password@localhost/db' }),
    (error: unknown) =>
      error instanceof Error && !error.message.includes('private-password'),
  )
})

test('logs preserve diagnostic fields while omitting arbitrary secrets and error messages', () => {
  const lines: string[] = []

  writeLog((line) => lines.push(line), 'warn', 'dependency.failed', {
    requestId: 'request-1234',
    statusCode: 503,
    password: 'secret-password',
    accessToken: 'secret-token',
    body: { password: 'secret-body' },
  } as Parameters<typeof writeLog>[3])
  assert.equal(lines.length, 1)
  assert.equal(JSON.parse(lines[0]).requestId, 'request-1234')
  assert.doesNotMatch(lines[0], /secret|password|accessToken|body/u)
  assert.equal(
    safeErrorCode({ code: 'ECONNREFUSED', message: 'secret' }),
    'ECONNREFUSED',
  )
  assert.equal(safeErrorCode({ code: 'private-password' }), 'DEPENDENCY_ERROR')
  assert.equal(requestIdFor('valid-request-123'), 'valid-request-123')
  assert.notEqual(requestIdFor('line\nbreak'), 'line\nbreak')
})

test('HTTP security, CORS and JSON limits run before handlers', async () => {
  await withHttp(
    { env: { BODY_LIMIT_BYTES: '1024' } },
    async ({ url, calls }) => {
      const request = (body: string, origin = 'http://localhost:9527') =>
        fetch(`${url}/api/admin/auth/login`, {
          method: 'POST',
          headers: { 'content-type': 'application/json', origin },
          body,
        })
      const denied = await request(
        '{"username":"admin"}',
        'https://attacker.example',
      )

      assert.equal(denied.status, 403)
      assert.equal(calls(), 0)
      assert.equal(denied.headers.get('x-content-type-options'), 'nosniff')
      assert.equal(denied.headers.get('x-powered-by'), null)
      const malformed = await request('{invalid-secret')

      assert.equal(malformed.status, 400)
      assert.doesNotMatch(await malformed.text(), /invalid-secret/u)
      const oversized = await request(
        JSON.stringify({ password: 'x'.repeat(2048) }),
      )

      assert.equal(oversized.status, 413)
      assert.equal(calls(), 0)
      const allowed = await request('{"username":"admin"}')

      assert.equal(allowed.status, 200)
      assert.equal(
        allowed.headers.get('access-control-allow-origin'),
        'http://localhost:9527',
      )
      assert.ok(allowed.headers.get('x-request-id'))
      assert.equal(allowed.headers.get('cache-control'), 'no-store')
      assert.equal(calls(), 1)
    },
  )
})

test('login limit normalizes usernames, covers case-insensitive routes and ignores spoofed proxy headers', async () => {
  await withHttp(
    { env: { LOGIN_RATE_LIMIT_MAX: '1' } },
    async ({ url, redis, calls }) => {
      const request = (username: string, forwarded: string, path: string) =>
        fetch(`${url}${path}`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-forwarded-for': forwarded,
          },
          body: JSON.stringify({ username, password: 'secret-password' }),
        })
      const first = await request('Admin', '1.1.1.1', '/api/admin/auth/login')
      const second = await request(
        ' ADMIN ',
        '2.2.2.2',
        '/API/ADMIN/AUTH/LOGIN/',
      )

      assert.equal(first.status, 200)
      assert.equal(second.status, 429)
      assert.ok(Number(second.headers.get('retry-after')) > 0)
      assert.equal(
        ((await second.json()) as { error: { key: string } }).error.key,
        'tooManyRequests',
      )
      assert.equal(calls(), 1)
      const ipKeys = redis.consumedKeys.filter((key) =>
        key.includes(':limit:api:'),
      )

      assert.equal(ipKeys[0], ipKeys[1])
      assert.ok(
        redis.consumedKeys.every(
          (key) => !key.includes('Admin') && !key.includes('secret-password'),
        ),
      )
    },
  )
})

test('Redis outage fails closed for API access but liveness remains healthy', async () => {
  const redis = new TestRedis()

  redis.isReady = false
  await withHttp({ redis }, async ({ url, calls }) => {
    const blocked = await fetch(
      `${url}/api/admin/users/secret-id?token=secret-query`,
      { headers: { authorization: 'Bearer secret-token' } },
    )

    assert.equal(blocked.status, 503)
    assert.equal(calls(), 0)
    assert.equal((await fetch(`${url}/api/health/live`)).status, 200)
    assert.equal((await fetch(`${url}/api/health/ready`)).status, 503)
  })
})

test('request logs use route templates and omit credentials, query strings and resource IDs', async () => {
  await withHttp({}, async ({ url, logs }) => {
    const response = await fetch(
      `${url}/api/admin/users/private-user-id?token=private-query`,
      {
        headers: {
          authorization: 'Bearer private-token',
          cookie: 'session=private-cookie',
        },
      },
    )

    await response.text()
    const requests = logs
      .map((line) => JSON.parse(line))
      .filter((entry) => entry.event === 'http.request')

    assert.equal(requests.length, 1)
    assert.equal(requests[0].route, '/api/admin/users/:id')
    assert.equal(requests[0].statusCode, 200)
    assert.doesNotMatch(logs.join('\n'), /private-|authorization|cookie/u)
  })
})

test('readiness checks database as well as Redis without exposing connection errors', async () => {
  await withHttp(
    {
      checkDatabase: async () => {
        throw new Error('postgresql://private-secret')
      },
    },
    async ({ url }) => {
      const response = await fetch(`${url}/api/health/ready`)

      assert.equal(response.status, 503)
      assert.doesNotMatch(await response.text(), /postgresql|private-secret/u)
    },
  )
})

test('cache TTL, hits, invalid data and outages preserve loader failures and fresh results', async () => {
  const redis = new TestRedis()
  const cache = new RedisJsonCache(redis, 'test', () => {})
  let calls = 0
  const loader = async () => ({ value: ++calls })
  const valid = (value: unknown): value is { value: number } =>
    typeof value === 'object' &&
    value !== null &&
    'value' in value &&
    typeof value.value === 'number'

  assert.deepEqual(await cache.getOrLoad('key', 30, loader, valid), {
    value: 1,
  })
  assert.deepEqual(await cache.getOrLoad('key', 30, loader, valid), {
    value: 1,
  })

  for (const key of redis.values.keys()) redis.values.set(key, '{broken')

  assert.deepEqual(await cache.getOrLoad('key', 30, loader, valid), {
    value: 2,
  })
  await cache.invalidate('key')
  assert.deepEqual(await cache.getOrLoad('key', 30, loader, valid), {
    value: 3,
  })
  redis.isReady = false
  assert.deepEqual(await cache.getOrLoad('key', 30, loader, valid), {
    value: 4,
  })
  await assert.rejects(
    () =>
      cache.getOrLoad('bad', 30, async () => {
        throw new Error('loader failed')
      }),
    /loader failed/u,
  )
  await assert.rejects(() => cache.getOrLoad('bad', 0, loader), /TTL/u)
})

test('Redis limiter rejects malformed counters and dependency failures', async () => {
  const redis = new TestRedis()
  const limiter = new RedisRateLimiter(redis, 'test')

  redis.eval = async () => [1, -1]
  await assert.rejects(
    () => limiter.consume('login', 'admin', 1, 60000),
    /invalid/u,
  )
  redis.isReady = false
  await assert.rejects(
    () => limiter.consume('login', 'admin', 1, 60000),
    /unavailable/u,
  )
})

test(
  'real Redis rate limits atomically across concurrent callers and expires the bucket',
  { skip: !process.env.TEST_REDIS_URL },
  async () => {
    const value = config()
    const store = new RedisStore(value, () => {})

    await store.connect()

    try {
      const limiter = new RedisRateLimiter(store.commands, value.redisKeyPrefix)
      const outcomes = await Promise.all(
        Array.from({ length: 25 }, () =>
          limiter.consume('login', 'test-user', 10, 10000),
        ),
      )

      assert.equal(outcomes.filter((item) => item.allowed).length, 10)
      assert.equal(
        (await limiter.consume('expiry', 'test-user', 1, 100)).allowed,
        true,
      )
      assert.equal(
        (await limiter.consume('expiry', 'test-user', 1, 100)).allowed,
        false,
      )
      await new Promise((resolve) => setTimeout(resolve, 140))
      assert.equal(
        (await limiter.consume('expiry', 'test-user', 1, 100)).allowed,
        true,
      )
      const cache = new RedisJsonCache(
        store.commands,
        value.redisKeyPrefix,
        () => {},
      )

      assert.deepEqual(
        await cache.getOrLoad('sample', 1, async () => ({ test: true })),
        { test: true },
      )
      assert.deepEqual(
        await cache.getOrLoad('sample', 1, async () => ({ test: false })),
        { test: true },
      )
      await cache.invalidate('sample')
    } finally {
      await store.close()
    }
  },
)
