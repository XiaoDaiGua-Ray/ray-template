import { createHttpClient } from '@ray-template/http'
import { AxiosError } from 'axios'
import type { AxiosAdapter, AxiosResponse } from 'axios'

it('isolates pending requests by client and leaves caller-owned signals intact', async () => {
  const pending: Array<{ signal: unknown; finish: () => void }> = []
  const adapter: AxiosAdapter = (config) =>
    new Promise<AxiosResponse>((resolve, reject) => {
      pending.push({
        signal: config.signal,
        finish: () =>
          resolve({
            data: 'ok',
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          }),
      })
      config.signal?.addEventListener?.('abort', () =>
        reject(new AxiosError('aborted', 'ERR_CANCELED', config)),
      )
    })
  const first = createHttpClient({ axios: { adapter } })
  const second = createHttpClient({ axios: { adapter } })
  const original = first.request
    .get('/same')
    .catch((error: AxiosError) => error.code)
  const other = second.request.get('/same')

  await vi.waitFor(() => expect(pending).toHaveLength(2))

  const replacement = first.request.get('/same')

  await vi.waitFor(() => expect(pending).toHaveLength(3))
  expect(await original).toBe('ERR_CANCELED')
  expect(first.canceler.getPendingCount()).toBe(1)
  expect(second.canceler.getPendingCount()).toBe(1)

  pending[1].finish()
  pending[2].finish()
  expect(await Promise.all([other, replacement])).toEqual(['ok', 'ok'])

  const own = new AbortController()
  const supplied = first.request.get('/custom', { signal: own.signal })

  await vi.waitFor(() => expect(pending).toHaveLength(4))
  expect(pending[3].signal).toBe(own.signal)
  first.canceler.cancelAllRequest()
  expect(own.signal.aborted).toBe(false)
  pending[3].finish()
  await expect(supplied).resolves.toBe('ok')
})
