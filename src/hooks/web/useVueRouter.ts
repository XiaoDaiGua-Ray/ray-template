/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-02
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { router } from '@/router'

import type { Router } from 'vue-router'

/**
 *
 * @description
 * 获取 vue-router 实例，允许你在非 setup 环境中使用。
 *
 * 可能考虑后期会加一些新的东西，所以与 vue-router useRouter 有点差异，需要解构使用 router，
 * 但是，其余的所有使用方法都与 useRouter 一致。
 *
 * 如果需要使用类似于 useRoute 的方法，可以使用 useVueRouter().router.currentRoute 获取。
 *
 * @example
 * const { router } = useVueRouter()
 *
 * // 使用 router
 * router.push('/path')
 * router.replace('/path')
 *
 * // 使用类似于 useRoute 的方法
 * const { router: { currentRouter } } = useVueRouter()
 *
 * console.log(route.fullPath)
 */
export const useVueRouter = () => {
  /**
   *
   * 该写法无实际意义，仅是为了避免 HMR 报错，导致开发流程中断。
   * 在实际业务中，router 始终是有值状态，所以不用担心。
   *
   * 但是，其实这是一种很不友好的做好，并且在顶层做修改的时候，依旧可能会有 HMR 报错；
   * 现在还未找到更好的解决方案，所以只能先这样。
   */
  if (!router) {
    return {
      router: {} as Router,
    }
  }

  return {
    router,
  }
}

export type UseVueRouterReturnType = ReturnType<typeof useVueRouter>
