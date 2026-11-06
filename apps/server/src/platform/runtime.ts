import type { Server } from 'node:http'
import type { NestExpressApplication } from '@nestjs/platform-express'
import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express'
import type { ServerConfig } from './config.js'
import {
  requestIdFor,
  requestRoute,
  safeErrorCode,
  standardLogSink,
  writeLog,
} from './logging.js'
import type { LogSink } from './logging.js'
import { RedisJsonCache, RedisRateLimiter, RedisStore } from './redis.js'
import type { RedisCommands } from './redis.js'

interface RuntimeOptions {
  checkDatabase: () => Promise<unknown>
  logSink?: LogSink
}

function failure(response: Response, status: number, key: string) {
  response
    .status(status)
    .json({ code: status, msg: key, data: null, error: { key } })
}

export class PlatformRuntime {
  readonly cache: RedisJsonCache
  private readonly limiter: RedisRateLimiter
  private readonly sink: LogSink
  private installed = false

  constructor(
    private readonly config: ServerConfig,
    private readonly commands: RedisCommands,
    private readonly options: RuntimeOptions,
    private readonly closeRedis: () => Promise<void> = async () => {},
  ) {
    this.sink = options.logSink ?? standardLogSink
    this.limiter = new RedisRateLimiter(commands, config.redisKeyPrefix)
    this.cache = new RedisJsonCache(commands, config.redisKeyPrefix, this.sink)
  }

  static async create(
    config: ServerConfig,
    options: RuntimeOptions,
  ): Promise<PlatformRuntime> {
    const store = new RedisStore(config, options.logSink)

    await store.connect()

    return new PlatformRuntime(config, store.commands, options, () =>
      store.close(),
    )
  }

  install(app: NestExpressApplication): void {
    if (this.installed)
      throw new Error('PlatformRuntime has already been installed.')

    this.installed = true
    const instance = app.getHttpAdapter().getInstance() as {
      set: (key: string, value: unknown) => void
      disable: (key: string) => void
    }

    instance.disable('x-powered-by')
    instance.set('trust proxy', this.config.trustProxy)
    app.use((request: Request, response: Response, next: NextFunction) => {
      const startedAt = performance.now()
      const requestId = requestIdFor(request.headers['x-request-id'])
      let logged = false

      response.locals.requestId = requestId
      response.setHeader('X-Request-Id', requestId)
      response.setHeader('X-Content-Type-Options', 'nosniff')
      response.setHeader('X-Frame-Options', 'DENY')
      response.setHeader('Referrer-Policy', 'no-referrer')
      response.setHeader('Cross-Origin-Resource-Policy', 'same-site')
      response.setHeader(
        'Content-Security-Policy',
        "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
      )
      response.setHeader(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=()',
      )
      response.setHeader('Cache-Control', 'no-store')
      response.vary('Origin')

      if (this.config.nodeEnv === 'production')
        response.setHeader('Strict-Transport-Security', 'max-age=31536000')

      const logRequest = () => {
        if (logged) return

        logged = true
        writeLog(this.sink, 'info', 'http.request', {
          requestId,
          method: request.method,
          route: requestRoute(request),
          statusCode: response.writableFinished ? response.statusCode : 499,
          durationMs: Math.round((performance.now() - startedAt) * 100) / 100,
        })
      }

      response.once('finish', logRequest)
      response.once('close', logRequest)
      const origin = request.headers.origin

      if (origin && !this.config.corsOrigins.includes(origin)) {
        failure(response, 403, 'forbidden')

        return
      }

      if (origin) {
        response.setHeader('Access-Control-Allow-Origin', origin)
        response.setHeader(
          'Access-Control-Expose-Headers',
          'X-Request-Id, Retry-After',
        )
      }

      if (request.method === 'OPTIONS') {
        response.setHeader(
          'Access-Control-Allow-Methods',
          'GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS',
        )
        response.setHeader(
          'Access-Control-Allow-Headers',
          'Authorization, Content-Type, X-Request-Id',
        )
        response.setHeader('Access-Control-Max-Age', '600')
        response.status(204).end()

        return
      }

      next()
    })
    app.useBodyParser('json', {
      limit: this.config.bodyLimitBytes,
      strict: true,
    })
    const parserErrors: ErrorRequestHandler = (
      error: unknown,
      _request,
      response,
      next,
    ) => {
      const status =
        typeof error === 'object' && error !== null && 'status' in error
          ? error.status
          : null

      if (status === 400 || status === 413 || status === 415) {
        failure(
          response,
          status,
          status === 413 ? 'payloadTooLarge' : 'invalid',
        )

        return
      }

      next(error)
    }

    app.use(parserErrors)
    app.use((request: Request, response: Response, next: NextFunction) => {
      if (!request.path.toLowerCase().startsWith('/api/admin/')) {
        next()

        return
      }

      void this.limitRequest(request, response)
        .then((allowed) => {
          if (allowed) next()
        })
        .catch((error: unknown) => {
          writeLog(this.sink, 'error', 'http.rate_limit_unavailable', {
            requestId: String(response.locals.requestId),
            code: safeErrorCode(error),
          })
          failure(response, 503, 'serviceUnavailable')
        })
    })
    app.use(
      '/api/health/live',
      (request: Request, response: Response, next: NextFunction) => {
        if (!['GET', 'HEAD'].includes(request.method) || request.path !== '/') {
          next()

          return
        }

        response.json({ code: 200, msg: 'OK', data: { status: 'ok' } })
      },
    )
    app.use(
      '/api/health/ready',
      (request: Request, response: Response, next: NextFunction) => {
        if (!['GET', 'HEAD'].includes(request.method) || request.path !== '/') {
          next()

          return
        }

        void this.readiness().then((ready) => {
          if (ready)
            response.json({ code: 200, msg: 'OK', data: { status: 'ready' } })
          else failure(response, 503, 'serviceUnavailable')
        })
      },
    )
    const server = app.getHttpServer() as Server

    server.requestTimeout = this.config.requestTimeoutMs
    server.headersTimeout = Math.min(10000, this.config.requestTimeoutMs)
    server.keepAliveTimeout = 5000
    server.once('close', () => {
      void this.close()
    })
  }

  private async limitRequest(
    request: Request,
    response: Response,
  ): Promise<boolean> {
    const ip = request.ip || request.socket.remoteAddress || 'unknown'
    const limits: Array<{
      bucket: string
      identity: string
      limit: number
      windowMs: number
    }> = [
      {
        bucket: 'api',
        identity: ip,
        limit: this.config.rateLimitMax,
        windowMs: 60000,
      },
    ]

    if (
      request.method === 'POST' &&
      /^\/api\/admin\/auth\/login\/?$/u.test(request.path.toLowerCase())
    ) {
      limits.push({
        bucket: 'login-ip',
        identity: ip,
        limit: this.config.loginRateLimitMax * 5,
        windowMs: 900000,
      })
      const username: unknown = request.body?.username

      if (
        typeof username === 'string' &&
        username.length <= 80 &&
        username.trim()
      ) {
        limits.push({
          bucket: 'login-account',
          identity: username.trim().toLowerCase(),
          limit: this.config.loginRateLimitMax,
          windowMs: 900000,
        })
      }
    }

    for (const limit of limits) {
      const result = await this.limiter.consume(
        limit.bucket,
        limit.identity,
        limit.limit,
        limit.windowMs,
      )

      if (!result.allowed) {
        response.setHeader('Retry-After', result.retryAfterSeconds)
        failure(response, 429, 'tooManyRequests')

        return false
      }
    }

    return true
  }

  async readiness(): Promise<boolean> {
    if (!this.commands.isReady) return false

    let timeout: ReturnType<typeof setTimeout>

    try {
      await Promise.race([
        Promise.all([this.options.checkDatabase(), this.commands.ping()]),
        new Promise<never>((_, reject) => {
          timeout = setTimeout(
            () => reject(new Error('Readiness timed out.')),
            2000,
          )
          timeout.unref()
        }),
      ])

      return true
    } catch {
      return false
    } finally {
      clearTimeout(timeout!)
    }
  }

  async close(): Promise<void> {
    await this.closeRedis()
  }
}
