import { randomUUID } from 'node:crypto'
import type { Request } from 'express'

export type LogSink = (line: string) => void
export interface LogFields {
  requestId?: string
  method?: string
  route?: string
  statusCode?: number
  durationMs?: number
  code?: string
}

export const standardLogSink: LogSink = (line) =>
  process.stdout.write(`${line}\n`)

export function writeLog(
  sink: LogSink,
  level: 'info' | 'warn' | 'error',
  event: string,
  fields: LogFields = {},
) {
  // 只输出白名单字段，不序列化请求、错误对象、查询串或连接配置。
  sink(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      event,
      requestId: fields.requestId,
      method: fields.method,
      route: fields.route,
      statusCode: fields.statusCode,
      durationMs: fields.durationMs,
      code: fields.code,
    }),
  )
}

export function requestIdFor(value: unknown): string {
  return typeof value === 'string' && /^[a-zA-Z0-9_-]{8,64}$/u.test(value)
    ? value
    : randomUUID()
}

export function requestRoute(request: Request): string {
  const route = request.route as { path?: unknown } | null

  return typeof route?.path === 'string' ? route.path : '<unmatched>'
}

export function safeErrorCode(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? error.code
      : null

  return typeof code === 'string' &&
    ['ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'EPIPE'].includes(
      code,
    )
    ? code
    : 'DEPENDENCY_ERROR'
}
