import { apiMockEnabled, apiUrl } from '@/api/admin/client'
import { installMockRequestGuard } from '@/axios/instance'

let installed = false

export function registerApiMock() {
  if (!apiMockEnabled || installed) return

  const base = apiUrl('')

  installMockRequestGuard(async (url) => {
    if (!new URL(url, document.baseURI).href.startsWith(base)) return

    // 业务请求必须等到 Mock 可用后才能发出。
    const { ensureApiMock } = await import('./browser')

    await ensureApiMock()
  })
  installed = true
}
