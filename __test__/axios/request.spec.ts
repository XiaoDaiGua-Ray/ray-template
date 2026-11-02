import { expectTypeOf } from 'vitest'
import request from '../../src/axios/instance'
import type { AppRawRequestConfig } from '../../src/axios/types'

const data = { id: 42, name: 'Ray' }
const adapter: AppRawRequestConfig['adapter'] = async (config) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config,
})

describe('request response contract', () => {
  it('returns typed response data for callable requests', async () => {
    const response = request<typeof data>({
      url: '/adapter/callable',
      adapter,
      cancelConfig: { cancel: false },
    })

    expectTypeOf(response).toEqualTypeOf<Promise<typeof data>>()
    await expect(response).resolves.toEqual(data)
  })

  it('keeps get, post and query helpers unwrapped', async () => {
    const config: AppRawRequestConfig = {
      adapter,
      cancelConfig: { cancel: false },
    }
    const getResponse = request.get<typeof data>('/adapter/get', config)
    const postResponse = request.post<typeof data, { query: string }>(
      '/adapter/post',
      { query: 'test' },
      config,
    )
    const queryResponse = request.query<typeof data, { query: string }>(
      '/adapter/query',
      { query: 'test' },
      config,
    )

    expectTypeOf(getResponse).toEqualTypeOf<Promise<typeof data>>()
    expectTypeOf(postResponse).toEqualTypeOf<Promise<typeof data>>()
    expectTypeOf(queryResponse).toEqualTypeOf<Promise<typeof data>>()
    await expect(getResponse).resolves.toEqual(data)
    await expect(postResponse).resolves.toEqual(data)
    await expect(queryResponse).resolves.toEqual(data)
  })

  it('preserves rejected adapter errors', async () => {
    const error = new Error('adapter failed')

    await expect(
      request({
        url: '/adapter/error',
        adapter: async () => {
          throw error
        },
        cancelConfig: { cancel: false },
      }),
    ).rejects.toBe(error)
  })
})
