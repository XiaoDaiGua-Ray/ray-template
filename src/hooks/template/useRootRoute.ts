/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-11-17
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { setVariable, getVariableToRefs } from '@/global-variable/index'

import type { DeepMutable } from '@/types/modules/helper'

export function useRootRoute() {
  const globalRootRoute = getVariableToRefs('globalRootRoute')

  /**
   *
   * @remark 获取根路由
   */
  const getRootRoute = computed(() => globalRootRoute.value)
  /**
   *
   * @remark 获取根路由 path
   */
  const getRootPath = computed(() => globalRootRoute.value.path)
  /**
   *
   * @remark 获取根路由 name
   */
  const getRootName = computed(() => globalRootRoute.value.name)

  const setRootRoute = (route: DeepMutable<typeof globalRootRoute.value>) => {
    setVariable(
      'globalRootRoute',
      Object.assign({}, globalRootRoute.value, route),
    )
  }

  return {
    getRootRoute,
    getRootPath,
    getRootName,
    setRootRoute,
  }
}
