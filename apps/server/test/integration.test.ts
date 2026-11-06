import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createHash, randomBytes } from 'node:crypto'
import {
  copyFile,
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, before, test } from 'node:test'
import {
  loginResultSchema,
  sessionSchema,
  userListSchema,
  userOptionsSchema,
  userSchema,
} from '@ray-template/api-contracts/admin'
import type {
  AdminUser,
  ApiResponse,
  LoginResult,
  UserInput,
} from '@ray-template/api-contracts/admin'
import {
  chartsSchema,
  ordersResultSchema,
  ownerOptionsSchema,
  peopleResultSchema,
  requestFixtureSchema,
  routeDemoPersonSchema,
  routePeopleResultSchema,
  searchOptionsSchema,
} from '@ray-template/api-contracts/demo'
import type { RouteConfig } from '@ray-template/api-contracts/routes'
import { parseApplicationRoutes } from '@ray-template/demo-data'
import { Pool } from 'pg'
import { createClient } from 'redis'
import * as v from 'valibot'
import { createApp } from '../src/app'
import { createDatabase } from '../src/infrastructure/database'
import { createToken, tokenHash } from '../src/modules/auth/password'
import { loadServerConfig } from '../src/platform/index'
import { seedDatabase, setPassword } from '../src/seed'

assert.ok(
  process.env.TEST_DATABASE_URL,
  'Set TEST_DATABASE_URL to a disposable PostgreSQL database before running server integration tests.',
)
assert.ok(
  process.env.TEST_REDIS_URL,
  'Set TEST_REDIS_URL to a disposable Redis instance before running server integration tests.',
)

const suffix = randomBytes(8).toString('hex')
const schema = `ray_test_${suffix}`
const databaseUrl = new URL(process.env.TEST_DATABASE_URL)

databaseUrl.searchParams.set('schema', schema)

const pool = new Pool({
  connectionString: process.env.TEST_DATABASE_URL,
  max: 1,
})
const database = createDatabase(databaseUrl.toString())
const password = `integration-${createToken()}`
const config = loadServerConfig({
  NODE_ENV: 'test',
  DATABASE_URL: databaseUrl.toString(),
  REDIS_URL: process.env.TEST_REDIS_URL,
  REDIS_KEY_PREFIX: `ray:test:${suffix}`,
  PORT: '0',
  SESSION_TTL_SECONDS: '3600',
  LOGIN_RATE_LIMIT_MAX: '100',
  RATE_LIMIT_MAX: '10000',
})
let app: Awaited<ReturnType<typeof createApp>> | null = null
let base = ''
let adminToken = ''
let adminId = ''

async function request<T = unknown>(
  path: string,
  options: {
    method?: string
    body?: unknown
    token?: string
    origin?: string
  } = {},
) {
  const response = await fetch(`${options.origin ?? base}/api/${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body === void 0 ? void 0 : JSON.stringify(options.body),
  })

  return {
    status: response.status,
    headers: response.headers,
    body: (await response.json()) as ApiResponse<T>,
  }
}

async function login(username: string, supplied = password) {
  const result = await request<LoginResult>('admin/auth/login', {
    method: 'POST',
    body: { username, password: supplied },
  })

  assert.equal(result.status, 200)
  v.parse(loginResultSchema, result.body.data)

  return result.body.data
}

const input = (
  username: string,
  extra: Partial<UserInput> = {},
): UserInput => ({
  username,
  email: `${username}@example.com`,
  name: username,
  phone: '',
  departmentId: 'engineering',
  role: 'member',
  status: 'enabled',
  remark: '',
  ...extra,
})

async function create(username: string, extra: Partial<UserInput> = {}) {
  const result = await request<AdminUser>('admin/users', {
    method: 'POST',
    token: adminToken,
    body: input(username, extra),
  })

  assert.equal(result.status, 200)
  v.parse(userSchema, result.body.data)

  return result.body.data
}

before(async () => {
  await pool.query(`CREATE SCHEMA "${schema}"`)
  await pool.query(`SET search_path TO "${schema}"`)
  const directory = new URL('../prisma/migrations/', import.meta.url)
  const migrations = await readdir(directory, { withFileTypes: true })

  for (const migration of migrations
    .filter((entry) => entry.isDirectory())
    .sort((left, right) => left.name.localeCompare(right.name))) {
    await pool.query(
      await readFile(
        new URL(`${migration.name}/migration.sql`, directory),
        'utf8',
      ),
    )
  }

  const seeded = await seedDatabase(database, { username: 'admin', password })

  adminId = seeded.userId
  app = await createApp(config, { logSink: () => {} })
  await app.listen(0, '127.0.0.1')
  base = await app.getUrl()
  adminToken = (await login('admin')).accessToken
})

after(async () => {
  await app?.close()
  await database.$disconnect()
  await pool.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
  await pool.end()
  const redis = createClient({
    url: config.redisUrl,
    socket: { connectTimeout: 2000, reconnectStrategy: false },
  })

  redis.on('error', () => {})

  try {
    await redis.connect()
    const keys = await redis.keys(`${config.redisKeyPrefix}:*`)

    if (keys.length) await redis.del(keys)
  } finally {
    if (redis.isOpen) await redis.quit()
  }
})

test('public startup routes, authentication, envelope and current permissions match shared contracts', async () => {
  const routes = await request('admin/route-config')

  assert.equal(routes.status, 200)
  parseApplicationRoutes(JSON.stringify(routes.body.data))
  assert.equal((await request('admin/users')).status, 401)
  assert.equal((await request('admin/route-config?view=editor')).status, 401)
  assert.equal(
    (
      await request('admin/auth/login', {
        method: 'POST',
        body: { username: 'admin', password: 'wrong' },
      })
    ).status,
    401,
  )
  const session = await request('admin/auth/session', { token: adminToken })

  v.parse(sessionSchema, session.body.data)
  assert.ok(session.headers.get('x-request-id'))
  const stored = await database.session.findUnique({
    where: { tokenHash: tokenHash(adminToken) },
  })

  assert.ok(stored)
  assert.notEqual(stored.tokenHash, adminToken)
  const options = await request('admin/users/options', { token: adminToken })

  v.parse(userOptionsSchema, options.body.data)
})

test('the development launcher refuses a port already serving backend readiness', async () => {
  const fixture = await mkdtemp(join(tmpdir(), 'ray-launcher-'))

  try {
    await mkdir(join(fixture, 'scripts'))
    await mkdir(join(fixture, 'apps/server'), { recursive: true })
    await writeFile(join(fixture, 'apps/server/.env.local'), '')
    await copyFile(
      new URL('../../../scripts/fullstack.mjs', import.meta.url),
      join(fixture, 'scripts/fullstack.mjs'),
    )
    const port = new URL(base).port
    const result = spawnSync(
      process.execPath,
      ['scripts/fullstack.mjs', 'dev'],
      {
        cwd: fixture,
        env: {
          ...process.env,
          PORT: port,
          ADMIN_DEV_PORT: port === '9527' ? '9528' : '9527',
        },
        encoding: 'utf8',
        timeout: 5000,
      },
    )

    assert.equal(result.status, 1)
    assert.match(result.stderr, /Backend port \d+ is not available/u)
    assert.equal((await fetch(`${base}/api/health/ready`)).status, 200)
  } finally {
    await rm(fixture, { force: true, recursive: true })
  }
})

test('read-only and manager accounts cannot bypass endpoint or role authorization', async () => {
  const reader = await create('reader')
  const manager = await create('manager', { role: 'manager' })

  await setPassword(database, reader.username, password)
  await setPassword(database, manager.username, password)
  const memberToken = (await login('reader')).accessToken
  const managerToken = (await login('manager')).accessToken

  assert.equal(
    (await request('admin/route-config?view=editor', { token: memberToken }))
      .status,
    403,
  )

  assert.equal(
    (
      await request('admin/users', {
        method: 'POST',
        token: memberToken,
        body: input('no-create'),
      })
    ).status,
    403,
  )
  assert.equal(
    (
      await request('admin/users', {
        method: 'POST',
        token: managerToken,
        body: input('no-admin', { role: 'admin' }),
      })
    ).status,
    403,
  )
  assert.equal(
    (
      await request(`admin/users/${adminId}`, {
        method: 'PUT',
        token: managerToken,
        body: input('admin'),
      })
    ).status,
    403,
  )
  assert.equal(
    (
      await request('admin/route-config', {
        method: 'PUT',
        token: memberToken,
        body: { version: 1, routes: [] },
      })
    ).status,
    403,
  )
  const list = await request('admin/users?page=1&pageSize=10', {
    token: memberToken,
  })

  v.parse(userListSchema, list.body.data)
})

test('creation, case-insensitive uniqueness, filtering and serialization protect credentials', async () => {
  const user = await create('CaseAccount', { departmentId: 'platform' })
  const duplicate = await request('admin/users', {
    method: 'POST',
    token: adminToken,
    body: input('caseaccount'),
  })

  assert.equal(duplicate.status, 409)
  assert.equal(duplicate.body.error?.key, 'duplicateUsername')
  const duplicateEmail = await request('admin/users', {
    method: 'POST',
    token: adminToken,
    body: input('other-name', { email: 'CASEACCOUNT@EXAMPLE.COM' }),
  })

  assert.equal(duplicateEmail.status, 409)
  assert.equal(duplicateEmail.body.error?.key, 'duplicateEmail')
  assert.equal(
    (
      await request('admin/auth/login', {
        method: 'POST',
        body: { username: user.username, password },
      })
    ).status,
    401,
  )
  const listed = await request<{ items: AdminUser[]; total: number }>(
    'admin/users?departmentId=engineering&name=CaseAccount&page=1&pageSize=1',
    { token: adminToken },
  )

  assert.equal(listed.body.data.total, 1)
  assert.equal(listed.body.data.items[0].id, user.id)
  assert.equal(JSON.stringify(listed.body).includes('passwordHash'), false)
  assert.equal(JSON.stringify(listed.body).includes('usernameKey'), false)
  assert.equal(
    (await request('admin/users?page=1&page=2', { token: adminToken })).status,
    400,
  )
  assert.equal(
    (await request('admin/users?pageSize=101', { token: adminToken })).status,
    400,
  )
  assert.equal(
    (await request('admin/users?page=9007199254740992', { token: adminToken }))
      .status,
    400,
  )
})

test('batch changes are all-or-none and current account remains protected', async () => {
  const user = await create('batch-target')
  const failedStatus = await request('admin/users/status', {
    method: 'PATCH',
    token: adminToken,
    body: { ids: [user.id, adminId], status: 'disabled' },
  })

  assert.equal(failedStatus.status, 409)
  assert.equal(
    (await database.user.findUniqueOrThrow({ where: { id: user.id } })).status,
    'enabled',
  )
  const failedDelete = await request('admin/users/batch-delete', {
    method: 'POST',
    token: adminToken,
    body: { ids: [user.id, 'missing-user'] },
  })

  assert.equal(failedDelete.status, 404)
  assert.ok(await database.user.findUnique({ where: { id: user.id } }))
  assert.equal(
    (
      await request(`admin/users/${adminId}`, {
        method: 'PUT',
        token: adminToken,
        body: input('admin', { role: 'member' }),
      })
    ).status,
    409,
  )
  const deleted = await request<{ affected: number }>(
    'admin/users/batch-delete',
    { method: 'POST', token: adminToken, body: { ids: [user.id, user.id] } },
  )

  assert.equal(deleted.body.data.affected, 1)
})

test('logout, expiry, password reset and disabling an account revoke effective access', async () => {
  const user = await create('sessions-user')

  await setPassword(database, user.username, password)
  const first = await login(user.username)

  assert.equal(
    (
      await request('admin/auth/logout', {
        method: 'POST',
        token: first.accessToken,
      })
    ).status,
    200,
  )
  assert.equal(
    (await request('admin/auth/session', { token: first.accessToken })).status,
    401,
  )
  const expired = await login(user.username)

  await database.session.update({
    where: { tokenHash: tokenHash(expired.accessToken) },
    data: { expiresAt: new Date(Date.now() - 1000) },
  })
  assert.equal(
    (await request('admin/auth/session', { token: expired.accessToken }))
      .status,
    401,
  )
  const reset = await login(user.username)
  const nextPassword = `${password}x`

  await setPassword(database, user.username, nextPassword)
  assert.equal(
    (await request('admin/auth/session', { token: reset.accessToken })).status,
    401,
  )
  assert.equal(
    (
      await request('admin/auth/login', {
        method: 'POST',
        body: { username: user.username, password },
      })
    ).status,
    401,
  )
  const active = await login(user.username, nextPassword)

  assert.equal(
    (
      await request('admin/users/status', {
        method: 'PATCH',
        token: adminToken,
        body: { ids: [user.id], status: 'disabled' },
      })
    ).status,
    200,
  )
  assert.equal(
    (await request('admin/auth/session', { token: active.accessToken })).status,
    401,
  )
  await request('admin/users/status', {
    method: 'PATCH',
    token: adminToken,
    body: { ids: [user.id], status: 'enabled' },
  })
  assert.equal(
    (await request('admin/auth/session', { token: active.accessToken })).status,
    401,
  )
})

test('route validation prevents unusable startup data and valid changes survive application restart', async () => {
  const before = await request<{ version: number; routes: unknown[] }>(
    'admin/route-config',
  )
  const bad = await request('admin/route-config', {
    method: 'PUT',
    token: adminToken,
    body: {
      version: 1,
      routes: [{ path: '/unknown', component: 'unknown-view', meta: {} }],
    },
  })

  assert.equal(bad.status, 400)
  assert.deepEqual(
    (await request('admin/route-config')).body.data,
    before.body.data,
  )
  const valid = {
    version: 1,
    routes: [
      {
        path: '/dashboard',
        name: 'RDashboard',
        component: 'dashboard',
        meta: { keepAlive: true, noLocalTitle: 'Integration Dashboard' },
      },
    ],
  }

  assert.equal(
    (
      await request('admin/route-config', {
        method: 'PUT',
        token: adminToken,
        body: valid,
      })
    ).status,
    200,
  )
  await app!.close()
  app = await createApp(config, { logSink: () => {} })
  await app.listen(0, '127.0.0.1')
  base = await app.getUrl()
  assert.deepEqual((await request('admin/route-config')).body.data, valid)
  assert.equal(
    (await request('admin/auth/session', { token: adminToken })).status,
    200,
  )
  const seeded = await seedDatabase(database, { username: 'admin' })

  assert.equal(seeded.created, false)
  assert.deepEqual((await request('admin/route-config')).body.data, valid)
  await request('admin/route-config', {
    method: 'PUT',
    token: adminToken,
    body: before.body.data,
  })
  const audit = await database.auditLog.findMany({
    where: { action: 'routes.update' },
  })

  assert.ok(audit.length >= 2)
  assert.ok(
    audit.every((record) => record.actorId === adminId && record.requestId),
  )
  assert.equal(JSON.stringify(audit).includes(password), false)
})

test('enabled demos implement the shared API, cache fixed reads and validate input', async () => {
  const get = async <S extends v.GenericSchema>(path: string, schema: S) => {
    const result = await request(`admin/demo/${path}`)

    assert.equal(result.status, 200)

    return v.parse(schema, result.body.data)
  }
  const post = async <S extends v.GenericSchema>(
    path: string,
    schema: S,
    body: unknown,
  ) => {
    const result = await request(`admin/demo/${path}`, { method: 'POST', body })

    assert.equal(result.status, 200)

    return v.parse(schema, result.body.data)
  }

  await get('request', requestFixtureSchema)
  const charts = await get('charts', chartsSchema)
  const refreshed = await get('charts?refresh=true', chartsSchema)

  assert.deepEqual(charts.days, refreshed.days)
  assert.deepEqual(await get('charts?refresh=false', chartsSchema), charts)
  const people = await get(
    'people?page=2&pageSize=3&sortAge=ascend',
    peopleResultSchema,
  )

  assert.equal(people.items.length, 3)
  assert.ok(people.items[0].age <= people.items[2].age)
  const routePeople = await get(
    'route-people?page=2&pageSize=2',
    routePeopleResultSchema,
  )

  assert.deepEqual(
    routePeople.items.map(({ key }) => key),
    [2, 3],
  )
  assert.deepEqual(
    await get('route-people/2', routeDemoPersonSchema),
    routePeople.items[0],
  )
  const english = await get('search-options?locale=en-US', searchOptionsSchema)
  const chinese = await get('search-options', searchOptionsSchema)

  assert.equal(english.organizations[0].label, 'North')
  assert.equal(chinese.organizations[0].label, '北区')
  assert.deepEqual(
    await post('owners/search', ownerOptionsSchema, {
      orgId: 'north',
      keyword: 'chen',
      locale: 'en-US',
    }),
    [{ label: 'Chen', value: 'n1' }],
  )
  const orders = await post('orders/search', ordersResultSchema, {
    query: { ownerId: 'n1', page: 2, pageSize: 3 },
    locale: 'en-US',
  })

  assert.ok(orders.total > 3)
  assert.equal(orders.items.length, 3)
  assert.ok(orders.items.every(({ owner }) => owner === 'Chen'))
  assert.equal(
    (await request('admin/demo/people?fail=true')).body.error?.key,
    'requestFailed',
  )
  assert.equal((await request('admin/demo/people?fail=yes')).status, 400)
  assert.equal((await request('admin/demo/route-people/999')).status, 404)
  assert.equal(
    (
      await request('admin/demo/orders/search', {
        method: 'POST',
        body: { query: { pageSize: 101 }, locale: 'en-US' },
      })
    ).status,
    400,
  )

  const redis = createClient({ url: config.redisUrl })

  await redis.connect()

  try {
    const digest = createHash('sha256').update('demo:v1:charts').digest('hex')
    const key = `${config.redisKeyPrefix}:cache:${digest}`

    assert.deepEqual(JSON.parse((await redis.get(key))!), charts)
    assert.ok((await redis.ttl(key)) > 0)
  } finally {
    await redis.quit()
  }
})

test('disabling demos hides runtime routes and endpoints without dropping editable routes', async () => {
  const original = (await request<RouteConfig>('admin/route-config')).body.data
  const full: RouteConfig = {
    ...original,
    routes: [
      ...original.routes,
      {
        path: '/extra-demo',
        component: 'demo/form',
        alias: '/demo-alias',
        meta: {},
      },
      { path: '/go-demo', redirect: '/demo-alias', meta: {} },
      { path: '/go-home', redirect: '/dashboard', meta: {} },
    ],
  }

  assert.equal(
    (
      await request('admin/route-config', {
        method: 'PUT',
        token: adminToken,
        body: full,
      })
    ).status,
    200,
  )
  const disabled = await createApp(
    { ...config, demoEnabled: false },
    { logSink: () => {} },
  )

  try {
    await disabled.listen(0, '127.0.0.1')
    const origin = await disabled.getUrl()
    const runtime = await request<RouteConfig>('admin/route-config', { origin })

    assert.equal(runtime.status, 200)
    const effective = parseApplicationRoutes(JSON.stringify(runtime.body.data))

    assert.equal(JSON.stringify(effective).includes('demo/'), false)
    assert.deepEqual(
      effective.routes.map(({ path }) => path),
      ['/dashboard', '/system', '/go-home'],
    )
    assert.equal((await request('admin/demo/charts', { origin })).status, 404)
    assert.equal(
      (await request('admin/route-config?view=editor', { origin })).status,
      401,
    )
    assert.deepEqual(
      (
        await request('admin/route-config?view=editor', {
          origin,
          token: adminToken,
        })
      ).body.data,
      full,
    )
  } finally {
    await disabled.close()
    await request('admin/route-config', {
      method: 'PUT',
      token: adminToken,
      body: original,
    })
  }
})
