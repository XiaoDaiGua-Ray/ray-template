import { spawn } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:net'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import { parseEnv } from 'node:util'

const root = fileURLToPath(new URL('../', import.meta.url))
const envFile = new URL('../apps/server/.env.local', import.meta.url)
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
const [action, ...flags] = process.argv.slice(2)

if (
  !['setup', 'dev', 'stop'].includes(action) ||
  (flags.length > 0 && (action !== 'setup' || flags.join(' ') !== '--external'))
) {
  console.error(
    'Use pnpm fullstack:setup [--external], pnpm dev:full, or pnpm fullstack:stop.',
  )
  process.exit(1)
}

function run(command, args, env = process.env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      env,
      stdio: 'inherit',
      shell: process.platform === 'win32' && command === pnpm,
    })

    child.once('error', () =>
      reject(
        new Error(
          `${command} could not start. Install it or use pnpm fullstack:setup --external with existing PostgreSQL and Redis.`,
        ),
      ),
    )
    child.once('exit', (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`${command} exited with code ${code}.`)),
    )
  })
}

function configuration() {
  if (!existsSync(envFile))
    throw new Error(
      'Run pnpm fullstack:setup first (or pnpm fullstack:setup --external with DATABASE_URL and REDIS_URL).',
    )

  return { ...parseEnv(readFileSync(envFile, 'utf8')), ...process.env }
}

const compose = [
  'compose',
  '--project-name',
  'ray-template',
  '--env-file',
  fileURLToPath(envFile),
  '-f',
  'deploy/compose.yaml',
]

function portFrom(env, key, fallback) {
  const port = env[key] ?? fallback

  if (!/^\d{1,5}$/u.test(port) || Number(port) < 1 || Number(port) > 65535)
    throw new Error(`${key} must be a port between 1 and 65535.`)

  return String(Number(port))
}

const devOrigins = (port) => [
  new URL(`http://127.0.0.1:${port}`).origin,
  new URL(`http://localhost:${port}`).origin,
]

async function verifyBackendPort(port) {
  await new Promise((resolve, reject) => {
    const probe = createServer()

    probe.once('error', () =>
      reject(new Error(`Backend port ${port} is not available on 127.0.0.1.`)),
    )
    probe.listen(Number(port), '127.0.0.1', () => probe.close(resolve))
  })
}

async function dev(env) {
  const port = portFrom(env, 'PORT', '3000')
  const adminPort = portFrom(env, 'ADMIN_DEV_PORT', '9527')

  if (port === adminPort)
    throw new Error('PORT and ADMIN_DEV_PORT must differ.')

  await verifyBackendPort(port)

  const target = `http://127.0.0.1:${port}`
  const serverEnv = {
    ...env,
    HOST: '127.0.0.1',
    PORT: port,
    CORS_ORIGINS: [
      ...new Set([
        ...(env.CORS_ORIGINS?.split(',')
          .map((value) => value.trim())
          .filter(Boolean) ?? []),
        ...devOrigins(adminPort),
      ]),
    ].join(','),
  }
  const controller = new AbortController()
  const { signal } = controller
  const children = new Set()
  const windows = process.platform === 'win32'

  const terminate = (child, killSignal) => {
    if (!child.pid) return

    if (windows) {
      const killer = spawn(
        'taskkill',
        ['/pid', String(child.pid), '/t', '/f'],
        {
          stdio: 'ignore',
        },
      )

      killer.once('error', () => child.kill())

      return
    }

    try {
      process.kill(-child.pid, killSignal)
    } catch (error) {
      if (error.code !== 'ESRCH') throw error
    }
  }
  const stop = (reason) => {
    if (signal.aborted) return

    controller.abort()

    if (reason) {
      console.error(reason)
      process.exitCode = 1
    }

    const running = [...children]

    for (const child of running) terminate(child, 'SIGTERM')

    if (running.length && !windows) {
      setTimeout(() => {
        for (const child of running) terminate(child, 'SIGKILL')
      }, 6000).unref()
    }
  }
  const start = (label, args, processEnv, persistent = false) =>
    new Promise((resolve) => {
      // pnpm 会再启动脚本进程，退出时需要回收完整进程树。
      const child = spawn(pnpm, args, {
        cwd: root,
        env: processEnv,
        stdio: 'inherit',
        detached: !windows,
        shell: windows,
      })

      children.add(child)
      const finish = (code) => {
        if (!signal.aborted && (persistent || code !== 0))
          stop(`${label} stopped unexpectedly.`)

        children.delete(child)
        resolve()
      }

      child.once('error', () => finish(1))
      child.once('exit', finish)
    })
  const interrupt = () => stop()

  process.on('SIGINT', interrupt)
  process.on('SIGTERM', interrupt)

  try {
    await start(
      'Prisma generation',
      ['--filter', '@ray-template/server', 'db:generate'],
      serverEnv,
    )

    if (signal.aborted) return

    const backend = start('Backend', ['server:dev'], serverEnv, true)
    let ready = false
    const deadline = Date.now() + 30000

    while (!signal.aborted && Date.now() < deadline) {
      try {
        const response = await fetch(`${target}/api/health/ready`, {
          signal: AbortSignal.any([signal, AbortSignal.timeout(1000)]),
        })

        if (response.ok) {
          ready = true
          break
        }
      } catch {
        /* 启动时允许后端尚未监听。 */
      }

      await delay(300, void 0, { signal }).catch(() => {})
    }

    if (!ready || signal.aborted) {
      if (!signal.aborted)
        stop('Backend readiness timed out. Check PostgreSQL and Redis.')

      await backend

      return
    }

    await Promise.all([
      backend,
      start(
        'Admin',
        ['dev', '--port', adminPort, '--strictPort'],
        {
          ...process.env,
          VITE_API_MOCK: 'false',
          VITE_API_BASE_URL: '/api/',
          RAY_API_PROXY_TARGET: target,
        },
        true,
      ),
    ])
  } finally {
    process.off('SIGINT', interrupt)
    process.off('SIGTERM', interrupt)
  }
}

try {
  if (action === 'setup') {
    const external = flags.includes('--external')

    if (!existsSync(envFile)) {
      if (external && (!process.env.DATABASE_URL || !process.env.REDIS_URL))
        throw new Error('External setup requires DATABASE_URL and REDIS_URL.')

      const password = randomBytes(24).toString('base64url')
      const redisPassword = randomBytes(24).toString('base64url')
      const postgresPort = portFrom(process.env, 'POSTGRES_PORT', '5432')
      const redisPort = portFrom(process.env, 'REDIS_PORT', '6379')
      const adminPort = portFrom(process.env, 'ADMIN_DEV_PORT', '9527')
      const values = {
        NODE_ENV: 'development',
        HOST: '127.0.0.1',
        PORT: portFrom(process.env, 'PORT', '3000'),
        ADMIN_DEV_PORT: adminPort,
        POSTGRES_USER: 'ray',
        POSTGRES_DB: 'ray_template',
        POSTGRES_PASSWORD: password,
        POSTGRES_PORT: postgresPort,
        REDIS_PASSWORD: redisPassword,
        REDIS_PORT: redisPort,
        DATABASE_URL: external
          ? process.env.DATABASE_URL
          : `postgresql://ray:${password}@127.0.0.1:${postgresPort}/ray_template`,
        REDIS_URL: external
          ? process.env.REDIS_URL
          : `redis://:${redisPassword}@127.0.0.1:${redisPort}`,
        ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
        ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@example.com',
        ADMIN_PASSWORD:
          process.env.ADMIN_PASSWORD || randomBytes(18).toString('base64url'),
        CORS_ORIGINS: devOrigins(adminPort).join(','),
        TRUST_PROXY: 'false',
        DEMO_ENABLED: 'true',
      }

      // 配置只创建一次，避免重复初始化覆盖用户配置和已修改的凭据。
      writeFileSync(
        envFile,
        Object.entries(values)
          .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
          .join('\n') + '\n',
        { flag: 'wx', mode: 0o600 },
      )
      console.log(
        'Created apps/server/.env.local. Initial administrator credentials are stored there; keep this file private.',
      )
    }

    const env = configuration()

    if (!external)
      await run(
        'docker',
        [...compose, 'up', '-d', '--wait', 'postgres', 'redis'],
        env,
      )

    await run(pnpm, ['server:db:migrate'], env)
    await run(pnpm, ['server:db:seed'], env)
    console.log(
      'Fullstack setup complete. Run pnpm dev:full; use the administrator account from apps/server/.env.local.',
    )
  } else if (action === 'stop') {
    await run(
      'docker',
      [...compose, '--profile', 'app', 'stop'],
      configuration(),
    )
  } else {
    await dev(configuration())
  }
} catch (error) {
  console.error(
    error instanceof Error ? error.message : 'Fullstack command failed.',
  )
  process.exitCode = 1
}
