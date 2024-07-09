import { appendRequestHeaders } from '@/axios/utils/append-request-headers'
import { APP_CATCH_KEY } from '@/app-config'
import { getStorage } from '@/utils'

import type {
  RequestInterceptorConfig,
  AxiosRequestInterceptor,
} from '@/axios/types'

/**
 *
 * 这里只是示例如何获取到系统缓存的 token 并且返回请求头 token 的 key 和 value
 * 尽可能的拆分每个拦截器的功能函数
 * 这是这个包存在的意义
 *
 * 当然你也可以根据 request instance 来特殊处理, 这里暂时不做演示
 */
const requestHeaderToken = (ins: RequestInterceptorConfig, mode: string) => {
  const token = getStorage<string>(APP_CATCH_KEY.token, 'localStorage')

  if (ins.url) {
    // TODO: 根据 url 不同是否设置 token
  }

  return {
    key: 'X-TOKEN',
    value: token,
  }
}

/** 注入请求头信息 */
const injectRequestHeaders: AxiosRequestInterceptor = (ins, mode) => {
  appendRequestHeaders(ins, [
    requestHeaderToken(ins, mode),
    {
      key: 'Demo-Header-Key',
      value: 'Demo Header Value',
    },
  ])
}

export { injectRequestHeaders }
