import { apiMockEnabled, apiUrl } from '@/api/admin/client'
import { installMockRequestGuard } from '@/axios/instance'
import { getStorageInstance } from '@/utils/cache-backend'
import { setupWorker } from 'msw/browser'
import { HttpNetworkFrame } from 'msw/experimental'
import { version as mswVersion } from 'msw/package.json'
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
          // 版本变化时注册新脚本，避免启动阶段与旧版 worker 握手。
          url: `${import.meta.env.BASE_URL}mockServiceWorker.js?v=${mswVersion}`,
          options: { scope: import.meta.env.BASE_URL },
        },
        quiet: true,
        onUnhandledFrame: ({ frame }) => {
          if (!(frame instanceof HttpNetworkFrame)) return

          const { method, url } = frame.data.request

          if (!url.startsWith(base)) return

          console.error(
            `[MSW] No mock handler for ${method} ${new URL(url).pathname}`,
          )
          // MSW 3 的默认错误回调只记录日志，拒绝此帧才能阻止请求穿透。
          throw Response.error()
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
        // 重启同一个实例，保持监听器和拦截状态由同一个客户端管理。
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
