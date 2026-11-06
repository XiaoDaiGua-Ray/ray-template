import { apiMockEnabled, apiUrl } from '@/api/admin/client'
import { installMockRequestGuard } from '@/axios/instance'
import { getStorageInstance } from '@/utils/cache-backend'
import { setupWorker } from 'msw/browser'
import { createMockConnection } from './connection'
import { createAdminDatabase } from './database'
import { createAdminHandlers } from './handlers'

let ready: Promise<unknown> | undefined

export function enableApiMock() {
  if (!apiMockEnabled) return Promise.resolve()

  ready ??= (async () => {
    const base = apiUrl('')
    const handlers = createAdminHandlers(
      createAdminDatabase(getStorageInstance('localStorage')),
      base,
    )
    const worker = setupWorker(...handlers)
    const start = () =>
      worker.start({
        serviceWorker: {
          url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
          options: { scope: import.meta.env.BASE_URL },
        },
        quiet: true,
        onUnhandledRequest: (request, print) => {
          if (request.url.startsWith(base)) print.error()
        },
      })

    await start()

    const ensureReady = createMockConnection(
      async () => {
        const response = await fetch(apiUrl('admin/mock-health'), {
          cache: 'no-store',
          credentials: 'omit',
          redirect: 'error',
          signal: AbortSignal.timeout(5000),
        })

        return response.ok && response.headers.get('x-ray-mock') === 'active'
      },
      async () => {
        // 复用实例以清理旧监听器；MSW 2.11.6 的已停止实例仍会抢先回复 PASSTHROUGH。
        worker.stop()
        await start()
      },
    )

    // Chromium 可能回收后台 worker；先探测并恢复，再发送业务请求，避免写请求意外穿透。
    installMockRequestGuard(async (url) => {
      if (new URL(url, document.baseURI).href.startsWith(base))
        await ensureReady()
    })
  })()

  return ready
}
