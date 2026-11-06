import { APP_CATCH_KEY } from '@/app-config'
import { request } from '@/axios'
import type { AppRawRequestConfig } from '@/axios/types'
import { getStorage } from '@/utils/cache'
import { isAxiosError } from 'axios'
import * as v from 'valibot'
import { envelopeSchema } from './contracts'

export const apiMockEnabled =
  import.meta.env.VITE_API_MOCK === 'true' ||
  (import.meta.env.VITE_API_MOCK !== 'false' &&
    !import.meta.env.VITE_API_BASE_URL?.trim())

export const browserSessionEnabled =
  !apiMockEnabled && import.meta.env.VITE_API_AUTH_TRANSPORT === 'cookie'

export const apiUrl = (path: string) => {
  const base =
    import.meta.env.VITE_API_BASE_URL?.trim() ||
    `${import.meta.env.BASE_URL}api/`

  return new URL(
    path.replace(/^\//u, ''),
    new URL(base.endsWith('/') ? base : `${base}/`, document.baseURI),
  ).href
}

export class AdminApiError extends Error {
  constructor(
    public readonly code: number,
    public readonly key: string,
    message: string,
    public readonly fields?: Record<string, string>,
  ) {
    super(message)
  }
}

let sessionVersion = 0
let onUnauthorized: (() => void) | undefined

export const advanceAdminSession = () => ++sessionVersion

export function bindAdminUnauthorized(handler: () => void) {
  onUnauthorized = handler

  return () => {
    if (onUnauthorized === handler) onUnauthorized = void 0
  }
}

export async function adminRequest<Schema extends v.GenericSchema>(
  path: string,
  schema: Schema,
  options: AppRawRequestConfig<unknown> = {},
): Promise<v.InferOutput<Schema>> {
  let body: unknown
  const version = sessionVersion
  const url = apiUrl(`admin/${path}`)

  if (browserSessionEnabled && new URL(url).origin !== location.origin)
    throw new Error('Cookie sessions require a same-origin API base.')

  const reportError = (error: AdminApiError): never => {
    if (
      error.code === 401 &&
      path !== 'auth/login' &&
      path !== 'auth/session' &&
      sessionVersion === version
    )
      onUnauthorized?.()

    throw error
  }

  try {
    const token = browserSessionEnabled
      ? null
      : getStorage<string>(APP_CATCH_KEY.token, 'localStorage')

    body = await request<unknown>({
      ...options,
      url,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(browserSessionEnabled ? { 'X-Ray-Session': 'cookie' } : {}),
        ...options.headers,
      },
      cancelConfig: { cancel: false },
    })
  } catch (error) {
    if (!isAxiosError(error) || !error.response) throw error

    const result = v.safeParse(envelopeSchema, error.response.data)

    if (result.success)
      return reportError(
        new AdminApiError(
          result.output.code,
          result.output.error?.key ?? 'requestFailed',
          result.output.msg,
          result.output.error?.fields,
        ),
      )

    if (error.response.status === 401)
      return reportError(new AdminApiError(401, 'unauthorized', error.message))

    throw error
  }

  const envelope = v.parse(envelopeSchema, body)

  if (envelope.code !== 200)
    return reportError(
      new AdminApiError(
        envelope.code,
        envelope.error?.key ?? 'requestFailed',
        envelope.msg,
        envelope.error?.fields,
      ),
    )

  return v.parse(schema, envelope.data)
}
