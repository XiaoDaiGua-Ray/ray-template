import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createHash, randomBytes } from 'node:crypto'
import { createServer } from 'node:net'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const suffix = randomBytes(5).toString('hex')
const project = `ray-smoke-${suffix}`
const password = randomBytes(18).toString('base64url')
const subnet = `10.219.${randomBytes(1)[0]}`
const ports = []

async function reservePort() {
  const server = createServer()

  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  ports.push(server)

  return server.address().port
}

const [postgresPort, redisPort, appPort] = await Promise.all([
  reservePort(),
  reservePort(),
  reservePort(),
])

for (const server of ports) server.close()

const origin = `http://127.0.0.1:${appPort}`
const env = {
  ...process.env,
  POSTGRES_USER: 'ray',
  POSTGRES_DB: 'ray_template',
  POSTGRES_PASSWORD: randomBytes(18).toString('base64url'),
  POSTGRES_PORT: String(postgresPort),
  REDIS_PASSWORD: randomBytes(18).toString('base64url'),
  REDIS_PORT: String(redisPort),
  ADMIN_USERNAME: 'smoke_admin',
  ADMIN_EMAIL: 'smoke-admin@example.test',
  ADMIN_PASSWORD: password,
  APP_PORT: String(appPort),
  APP_ORIGINS: '',
  APP_PROXY_NETWORK: subnet,
  APP_DEMO_ENABLED: 'false',
  APP_DATABASE_URL: '',
  APP_REDIS_URL: '',
  APP_LOGIN_RATE_LIMIT_MAX: '1',
}

function compose(args, capture = false) {
  const result = spawnSync(
    'docker',
    [
      'compose',
      '--project-name',
      project,
      '--profile',
      'app',
      '-f',
      'deploy/compose.yaml',
      ...args,
    ],
    { cwd: root, env, encoding: 'utf8', stdio: capture ? 'pipe' : 'inherit' },
  )

  if (result.error || result.status !== 0)
    throw new Error(`Docker Compose ${args[0]} failed.`, {
      cause: result.error,
    })

  return result.stdout
}

const api = (path, options) =>
  fetch(`${origin}/api/${path}`, {
    signal: AbortSignal.timeout(5000),
    ...options,
  })
const login = (username, forwarded) =>
  api('admin/auth/login', {
    method: 'POST',
    headers: {
      Origin: origin,
      'Content-Type': 'application/json',
      'X-Forwarded-For': forwarded,
    },
    body: JSON.stringify({ username, password }),
  })

compose(['config', '--quiet'])

try {
  compose(['up', '--build', '--detach', '--wait', '--wait-timeout', '150'])
  const entry = await fetch(origin, {
    redirect: 'manual',
    signal: AbortSignal.timeout(5000),
  })

  assert.equal(entry.status, 302)
  assert.equal(entry.headers.get('location'), '/ray-template/')
  const page = await fetch(`${origin}/ray-template/`, {
    signal: AbortSignal.timeout(5000),
  })

  assert.equal(page.status, 200)
  assert.match(await page.text(), /<script[^>]*src="\/ray-template\//u)
  assert.equal((await api('health/ready')).status, 200)
  assert.equal((await api('admin/demo/charts')).status, 404)
  const denied = await api('admin/route-config', {
    headers: { Origin: 'https://untrusted.example.test' },
  })

  assert.equal(denied.status, 403)
  const response = await login('smoke_admin', '198.51.100.10')

  assert.equal(response.status, 200)
  assert.equal(response.headers.get('access-control-allow-origin'), origin)
  const { data } = await response.json()

  assert.equal(
    (
      await api('admin/users', {
        headers: { Authorization: `Bearer ${data.accessToken}` },
      })
    ).status,
    200,
  )

  for (let attempt = 1; attempt <= 5; attempt++) {
    assert.equal(
      (await login(`unknown-${attempt}`, `198.51.100.${10 + attempt}`)).status,
      attempt < 5 ? 401 : 429,
    )
  }

  // 使用 Nginx 实际看到的地址验证限流键，确保没有退回代理自身的地址。
  const accessLog = compose(['logs', '--no-log-prefix', 'admin'], true)
  const clientIp = /^(\S+) - .*"POST \/api\/admin\/auth\/login /mu.exec(
    accessLog,
  )?.[1]

  assert.ok(clientIp, 'Expected a proxied login in the Nginx access log.')
  const digest = createHash('sha256').update(clientIp).digest('hex')
  const count = compose(
    [
      'exec',
      '-T',
      'redis',
      'redis-cli',
      'GET',
      `ray:production:limit:login-ip:${digest}`,
    ],
    true,
  )

  assert.equal(count.trim(), '6')
  console.log(
    'Compose smoke passed: initialized data, built admin, readiness, login, CORS, demo gating and forwarded client rate limits.',
  )
} catch (error) {
  try {
    compose(['logs', '--tail', '25', 'initialize', 'server'])
  } catch {
    // 可能在镜像构建阶段已失败，保留最初的错误。
  }

  throw error
} finally {
  compose(['down', '--volumes', '--remove-orphans'])
}
