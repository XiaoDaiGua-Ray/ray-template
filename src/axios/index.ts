/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-07-11
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 基于 vue-hook-plus 与 axios 封装
 *
 * (vue-hook-plus 参考文档)[https://inhiblab-core.gitee.io/docs/hooks/useRequest/basic/]
 *
 * 借助 vue-hook-plus useRequest 方法实现拓展功能
 * 结合模板已封装好的 axios 实现了该 hook
 *
 * 由于中间件注册了自动取消重复请求的方法，所以会导致方法在初始化时，会抛出一个重复请求被取消的错误（该问题不影响使用）
 */

import useHookPlusRequest from 'vue-hooks-plus/es/useRequest'
import request from '@/axios/instance'

import type { UseRequestOptions } from 'vue-hooks-plus/es/useRequest/types'
import type { AppRawRequestConfig } from '@/axios/type'

/**
 *
 * 该方法有一定的局限性，仅可在 effect 作用域中使用
 * 如果在非 vue effect scope 中使用，会抛出一些警告
 *
 * 非 vue effect 中使用
 * @example
 *
 * // 请求函数
 * const getUser = () => request({ url: 'http://localhost:3000/user' })
 *
 * // effect 中使用
 * const { data } = useHookPlusRequest(getUser)
 */
function useRequest<
  Response,
  HookPlusParams extends unknown[] = unknown[],
  HookPlusPlugin = unknown,
>(
  fetchOption: AppRawRequestConfig<Response>,
  option?: UseRequestOptions<Response, HookPlusParams, HookPlusPlugin>,
) {
  const fc = () => {
    const cb = request<Response>(fetchOption)

    return cb
  }

  const hooks = useHookPlusRequest<Response, HookPlusParams>(
    fc,
    Object.assign({}, option),
  )

  return hooks
}

export { useRequest, useHookPlusRequest, request }
