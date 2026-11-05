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

export async function adminRequest<Schema extends v.GenericSchema>(
  path: string,
  schema: Schema,
  options: AppRawRequestConfig<unknown> = {},
): Promise<v.InferOutput<Schema>> {
  let body: unknown

  try {
    const token = getStorage<string>(APP_CATCH_KEY.token, 'localStorage')

    body = await request<unknown>({
      ...options,
      url: apiUrl(`admin/${path}`),
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      cancelConfig: { cancel: false },
    })
  } catch (error) {
    if (!isAxiosError(error) || !error.response) throw error

    const result = v.safeParse(envelopeSchema, error.response.data)

    if (result.success)
      throw new AdminApiError(
        result.output.code,
        result.output.error?.key ?? 'requestFailed',
        result.output.msg,
        result.output.error?.fields,
      )

    throw error
  }

  const envelope = v.parse(envelopeSchema, body)

  if (envelope.code !== 200)
    throw new AdminApiError(
      envelope.code,
      envelope.error?.key ?? 'requestFailed',
      envelope.msg,
      envelope.error?.fields,
    )

  return v.parse(schema, envelope.data)
}
