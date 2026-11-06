import { isIP } from 'node:net'

export interface ServerConfig {
  nodeEnv: 'development' | 'test' | 'production'
  host: string
  port: number
  databaseUrl: string
  redisUrl: string
  redisKeyPrefix: string
  corsOrigins: string[]
  trustProxy: false | string[]
  demoEnabled: boolean
  sessionTtlSeconds: number
  bodyLimitBytes: number
  requestTimeoutMs: number
  rateLimitMax: number
  loginRateLimitMax: number
}

export function loadServerConfig(
  env: NodeJS.ProcessEnv = process.env,
): ServerConfig {
  const nodeEnv = env.NODE_ENV ?? 'development'

  if (!['development', 'test', 'production'].includes(nodeEnv)) {
    throw new Error('NODE_ENV must be development, test or production.')
  }

  const integer = (key: string, fallback: number, min: number, max: number) => {
    const input = env[key] ?? String(fallback)
    const value = Number(input)

    if (
      !/^\d+$/u.test(input) ||
      !Number.isSafeInteger(value) ||
      value < min ||
      value > max
    ) {
      throw new Error(`${key} must be an integer between ${min} and ${max}.`)
    }

    return value
  }
  const boolean = (key: string, fallback: boolean) => {
    const input = env[key]

    if (input === void 0) return fallback

    if (input === 'true') return true

    if (input === 'false') return false

    throw new Error(`${key} must be true or false.`)
  }
  const connection = (key: string, protocols: string[]) => {
    const value = env[key]

    try {
      const parsed = new URL(value ?? '')

      if (!protocols.includes(parsed.protocol) || !parsed.hostname)
        throw new Error()
    } catch {
      // 配置错误只报告字段名，连接串可能携带数据库或 Redis 密码。
      throw new Error(
        `${key} must be a valid ${protocols.join('/')} connection URL.`,
      )
    }

    return value!
  }
  const corsOrigins = (env.CORS_ORIGINS ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  if (corsOrigins.length > 16)
    throw new Error('CORS_ORIGINS accepts at most 16 origins.')

  for (const origin of corsOrigins) {
    try {
      const parsed = new URL(origin)

      if (
        !['https:', 'http:'].includes(parsed.protocol) ||
        parsed.origin !== origin
      )
        throw new Error()
    } catch {
      throw new Error(
        'CORS_ORIGINS must contain exact HTTP(S) origins without paths or wildcards.',
      )
    }
  }

  const proxyValue = env.TRUST_PROXY?.trim() || 'false'
  const trustProxy =
    proxyValue === 'false'
      ? false
      : proxyValue.split(',').map((item) => item.trim())

  if (trustProxy) {
    for (const entry of trustProxy) {
      const [address, mask, extra] = entry.split('/')
      const family = isIP(address)

      if (
        !family ||
        extra !== void 0 ||
        (mask !== void 0 &&
          (!/^\d+$/u.test(mask) ||
            Number(mask) < 1 ||
            Number(mask) > (family === 4 ? 32 : 128)))
      ) {
        throw new Error(
          'TRUST_PROXY must be false or a comma-separated list of trusted IP addresses/CIDRs.',
        )
      }
    }
  }

  const redisKeyPrefix = env.REDIS_KEY_PREFIX || `ray:${nodeEnv}`

  if (!/^[a-zA-Z0-9:_-]{1,80}$/u.test(redisKeyPrefix)) {
    throw new Error(
      'REDIS_KEY_PREFIX accepts 1–80 letters, digits, colons, underscores or hyphens.',
    )
  }

  return {
    nodeEnv: nodeEnv as ServerConfig['nodeEnv'],
    host: env.HOST || '127.0.0.1',
    port: integer('PORT', 3000, nodeEnv === 'test' ? 0 : 1, 65535),
    databaseUrl: connection('DATABASE_URL', ['postgres:', 'postgresql:']),
    redisUrl: connection('REDIS_URL', ['redis:', 'rediss:']),
    redisKeyPrefix,
    corsOrigins,
    trustProxy,
    demoEnabled: boolean('DEMO_ENABLED', nodeEnv !== 'production'),
    sessionTtlSeconds: integer('SESSION_TTL_SECONDS', 28800, 60, 604800),
    bodyLimitBytes: integer('BODY_LIMIT_BYTES', 262144, 1024, 1048576),
    requestTimeoutMs: integer('REQUEST_TIMEOUT_MS', 15000, 1000, 120000),
    rateLimitMax: integer('RATE_LIMIT_MAX', 300, 1, 100000),
    loginRateLimitMax: integer('LOGIN_RATE_LIMIT_MAX', 10, 1, 1000),
  }
}
