import request from '@/axios/instance'
import type { AppRawRequestConfig } from '@/axios/types'
import useHookPlusRequest from 'vue-hooks-plus/es/useRequest'
import type { UseRequestOptions } from 'vue-hooks-plus/es/useRequest/types'

/**
 *
 * @param fetchOptions Axios 请求配置
 * @param option vue-hooks-plus 请求选项
 *
 * @description
 * 使用项目 Axios 实例创建请求 Hook，应在有效的 Vue effect 作用域中调用。
 *
 * @returns 请求状态与控制方法
 */
function useRequest<
  Response,
  HookPlusParams extends unknown[] = unknown[],
  HookPlusPlugin = unknown,
>(
  fetchOptions: AppRawRequestConfig<Response>,
  option?: UseRequestOptions<Response, HookPlusParams, HookPlusPlugin>,
) {
  const fn = () => {
    const cb = request<Response>(fetchOptions)

    return cb
  }

  const hooks = useHookPlusRequest<Response, HookPlusParams>(
    fn,
    Object.assign({}, option),
  )

  return hooks
}

export { useRequest, useHookPlusRequest, request }
