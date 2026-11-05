import { APP_CATCH_KEY } from '@/app-config'
import { injectRequestHeaders } from '@/axios/axios-interceptor/request/plugins/request-headers'
import type { RequestInterceptorConfig } from '@/axios/types'
import { setStorage } from '@/utils/cache'
import { AxiosHeaders } from 'axios'

afterEach(() => {
  localStorage.clear()
  vi.unstubAllEnvs()
})

it('sends Bearer credentials only to the configured API origin and path', () => {
  vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.test/v1/')
  setStorage(APP_CATCH_KEY.token, 'test-token', 'localStorage')
  const config = (url: string): RequestInterceptorConfig => ({
    url,
    headers: new AxiosHeaders(),
  })
  const owned = config('https://api.example.test/v1/admin/users')

  injectRequestHeaders(owned, '')
  expect(owned.headers?.Authorization).toBe('Bearer test-token')

  for (const url of [
    'https://other.example.test/v1/admin/users',
    'https://api.example.test/v10/admin/users',
  ]) {
    const foreign = config(url)

    injectRequestHeaders(foreign, '')
    expect(foreign.headers?.Authorization).toBeUndefined()
  }

  const explicit = config('https://api.example.test/v1/admin/users')

  explicit.headers = { authorization: 'Bearer supplied-token' }
  injectRequestHeaders(explicit, '')
  expect(explicit.headers.authorization).toBe('Bearer supplied-token')
})
