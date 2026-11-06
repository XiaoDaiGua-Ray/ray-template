import { createHash } from 'node:crypto'
import { createClient } from 'redis'
import type { ServerConfig } from './config.js'
import { safeErrorCode, standardLogSink, writeLog } from './logging.js'
import type { LogSink } from './logging.js'

const windowScript = `
local count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end
local remaining = redis.call('PTTL', KEYS[1])
return {count, remaining}
`

export interface RedisCommands {
  isReady: boolean
  eval(
    script: string,
    options: { keys: string[]; arguments: string[] },
  ): Promise<unknown>
  get(key: string): Promise<string | null>
  set(key: string, value: string, options: { EX: number }): Promise<unknown>
  del(key: string): Promise<unknown>
  ping(): Promise<string>
}

function within<T>(operation: Promise<T>, milliseconds = 2000): Promise<T> {
  let timeout: ReturnType<typeof setTimeout>

  return Promise.race([
    operation,
    new Promise<never>((_, reject) => {
      timeout = setTimeout(
        () => reject(new Error('Redis command timed out.')),
        milliseconds,
      )
      timeout.unref()
    }),
  ]).finally(() => clearTimeout(timeout))
}

export class RedisStore {
  private client: ReturnType<typeof createClient>
  private closing = false
  private closePromise?: Promise<void>

  constructor(
    config: ServerConfig,
    private readonly sink: LogSink = standardLogSink,
  ) {
    this.client = createClient({
      url: config.redisUrl,
      disableOfflineQueue: true,
      socket: {
        connectTimeout: 3000,
        reconnectStrategy: (retries) => Math.min(100 * 2 ** retries, 3000),
      },
    })
    this.client.on('error', (error: unknown) => {
      if (!this.closing)
        writeLog(this.sink, 'error', 'redis.error', {
          code: safeErrorCode(error),
        })
    })
  }

  async connect(): Promise<void> {
    try {
      await within(this.client.connect(), 5000)
    } catch {
      if (this.client.isOpen) this.client.destroy()

      throw new Error(
        'Redis is unavailable. Check REDIS_URL and service readiness.',
      )
    }
  }

  get commands(): RedisCommands {
    return this.client
  }

  close(): Promise<void> {
    this.closePromise ??= this.closeClient()

    return this.closePromise
  }

  private async closeClient(): Promise<void> {
    this.closing = true

    if (!this.client.isOpen) return

    try {
      await within(this.client.close())
    } catch {
      if (this.client.isOpen) this.client.destroy()
    }
  }
}

export class RedisRateLimiter {
  constructor(
    private readonly client: RedisCommands,
    private readonly prefix: string,
  ) {}

  async consume(
    bucket: string,
    identity: string,
    limit: number,
    windowMs: number,
  ): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
    if (!this.client.isReady) throw new Error('Redis is unavailable.')

    const digest = createHash('sha256').update(identity).digest('hex')
    const result = await within(
      this.client.eval(windowScript, {
        keys: [`${this.prefix}:limit:${bucket}:${digest}`],
        arguments: [String(windowMs)],
      }),
    )

    if (
      !Array.isArray(result) ||
      typeof result[0] !== 'number' ||
      typeof result[1] !== 'number' ||
      result[1] < 0
    ) {
      throw new Error('Redis returned an invalid rate limit result.')
    }

    return {
      allowed: result[0] <= limit,
      retryAfterSeconds: Math.max(1, Math.ceil(result[1] / 1000)),
    }
  }
}

export class RedisJsonCache {
  constructor(
    private readonly client: RedisCommands,
    private readonly prefix: string,
    private readonly sink: LogSink = standardLogSink,
  ) {}

  private key(key: string) {
    return `${this.prefix}:cache:${createHash('sha256').update(key).digest('hex')}`
  }

  async getOrLoad<T>(
    key: string,
    ttlSeconds: number,
    load: () => Promise<T>,
    validate?: (value: unknown) => value is T,
  ): Promise<T> {
    if (!Number.isInteger(ttlSeconds) || ttlSeconds < 1 || ttlSeconds > 86400)
      throw new Error('Cache TTL must be between 1 and 86400 seconds.')

    try {
      if (this.client.isReady) {
        const cached = await within(this.client.get(this.key(key)))

        if (cached !== null) {
          const value: unknown = JSON.parse(cached)

          if (!validate || validate(value)) return value as T
        }
      }
    } catch (error) {
      writeLog(this.sink, 'warn', 'cache.read_failed', {
        code: safeErrorCode(error),
      })
    }

    const value = await load()

    try {
      if (this.client.isReady)
        await within(
          this.client.set(this.key(key), JSON.stringify(value), {
            EX: ttlSeconds,
          }),
        )
    } catch (error) {
      // 缓存只供可重建的读取结果使用，权限和会话从不经过此降级路径。
      writeLog(this.sink, 'warn', 'cache.write_failed', {
        code: safeErrorCode(error),
      })
    }

    return value
  }

  async invalidate(key: string): Promise<void> {
    await within(this.client.del(this.key(key)))
  }
}
