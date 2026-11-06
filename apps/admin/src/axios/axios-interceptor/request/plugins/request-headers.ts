import { APP_CATCH_KEY } from '@/app-config'
import type { AxiosRequestInterceptor } from '@/axios/types'
import { appendRequestHeaders } from '@/axios/utils/append-request-headers'
import { getStorage } from '@/utils/cache'

const injectRequestHeaders: AxiosRequestInterceptor = (config) => {
  if (
    import.meta.env.VITE_API_MOCK !== 'true' &&
    import.meta.env.VITE_API_AUTH_TRANSPORT === 'cookie'
  )
    return

  const token = getStorage<string>(APP_CATCH_KEY.token, 'localStorage')

  if (
    !token ||
    !config.url ||
    Object.keys(config.headers ?? {}).some(
      (name) => name.toLowerCase() === 'authorization',
    )
  )
    return

  const configured =
    import.meta.env.VITE_API_BASE_URL?.trim() ||
    `${import.meta.env.BASE_URL}api/`
  const base = new URL(
    configured.endsWith('/') ? configured : `${configured}/`,
    document.baseURI,
  )
  const target = new URL(
    config.url,
    config.baseURL
      ? new URL(config.baseURL, document.baseURI)
      : document.baseURI,
  )

  // 只向接入方明确配置的 API 来源和路径发送会话，不污染第三方或静态资源请求。
  if (
    target.origin !== base.origin ||
    !target.pathname.startsWith(base.pathname)
  )
    return

  appendRequestHeaders(config, [
    { key: 'Authorization', value: `Bearer ${token}` },
  ])
}

export { injectRequestHeaders }
