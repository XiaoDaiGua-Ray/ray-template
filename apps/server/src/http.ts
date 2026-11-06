import { Catch, HttpException, Injectable } from '@nestjs/common'
import type {
  ArgumentsHost,
  CallHandler,
  ExceptionFilter,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common'
import type { ApiResponse } from '@ray-template/api-contracts/admin'
import type { Request, Response } from 'express'
import { map } from 'rxjs'
import * as v from 'valibot'
import { standardLogSink, writeLog } from './platform/index'

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly key: string,
  ) {
    super(key)
  }
}

export function parseInput<S extends v.GenericSchema>(
  schema: S,
  input: unknown,
) {
  const parsed = v.safeParse(schema, input)

  if (!parsed.success) throw new ApiError(400, 'invalid')

  return parsed.output
}

export function tokenFrom(request: Request) {
  const header = request.headers.authorization

  return /^Bearer [A-Za-z0-9_-]{32,128}$/u.test(header ?? '')
    ? header!.slice(7)
    : null
}

export function requestIdFrom(request: Request) {
  const id = request.res?.getHeader('x-request-id')

  return typeof id === 'string' ? id : null
}

export function queryInput(query: Request['query'], booleans: string[] = []) {
  const values: Record<string, unknown> = { ...query }

  for (const key of ['page', 'pageSize']) {
    if (key in values) {
      if (typeof values[key] !== 'string' || !/^\d+$/u.test(values[key]))
        throw new ApiError(400, 'invalid')

      values[key] = Number(values[key])

      if (!Number.isSafeInteger(values[key])) throw new ApiError(400, 'invalid')
    }
  }

  for (const key of booleans) {
    if (values[key] === 'true') values[key] = true
    else if (values[key] === 'false') values[key] = false
  }

  return values
}

@Injectable()
export class EnvelopeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const response = context.switchToHttp().getResponse<Response>()

    response.status(200)

    return next.handle().pipe(
      map((data: unknown): ApiResponse<unknown> => ({
        code: 200,
        msg: 'OK',
        data: data ?? null,
      })),
    )
  }
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(error: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>()

    if (response.headersSent) return

    let status = 500
    let key = 'internal'

    if (error instanceof ApiError) {
      status = error.status
      key = error.key
    } else if (error instanceof HttpException) {
      status = error.getStatus()
      key =
        {
          400: 'invalid',
          401: 'unauthorized',
          403: 'forbidden',
          404: 'notFound',
          413: 'invalid',
          429: 'tooManyRequests',
          503: 'serviceUnavailable',
        }[status] ?? 'requestFailed'
    } else if (error instanceof Error && 'code' in error) {
      if (error.code === 'P2002') {
        const meta = 'meta' in error ? error.meta : null
        const target = JSON.stringify(meta)

        status = 409
        key = target?.includes('email') ? 'duplicateEmail' : 'duplicateUsername'
      } else if (error.code === 'P2025') {
        status = 404
        key = 'notFound'
      } else if (error.code === 'P2003') {
        status = 400
        key = 'invalid'
      } else if (/^P10|^P20/u.test(String(error.code))) {
        status = 503
        key = 'storage'
      }
    }

    if (status >= 500) {
      const code =
        error instanceof Error &&
        'code' in error &&
        /^P\d{4}$/u.test(String(error.code))
          ? String(error.code)
          : 'UNEXPECTED_ERROR'

      writeLog(standardLogSink, 'error', 'http.exception', {
        requestId: String(response.getHeader('x-request-id') ?? ''),
        code,
        statusCode: status,
      })
    }

    response
      .status(status)
      .json({ code: status, msg: key, data: null, error: { key } })
  }
}
