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

import { setVariable, getVariableToRefs } from '@/global-variable'
import { cloneDeep } from 'lodash-es'

import type { DeepMutable } from '@/types/modules/helper'

export function useAppRoot() {
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

  /**
   *
   * @param route 根路由配置内容
   *
   * 设置根路由
   *
   * @example
   * setRootRoute({ path: '/your root path', name: 'your root name' })
   */
  const setRootRoute = (route: DeepMutable<typeof globalRootRoute.value>) => {
    const routeRef = getVariableToRefs('globalRootRoute')
    const assignRoute = Object.assign(cloneDeep(routeRef.value), route)

    setVariable('globalRootRoute', assignRoute)
  }

  return {
    getRootRoute,
    getRootPath,
    getRootName,
    setRootRoute,
  }
}

export type UseAppRootReturnType = ReturnType<typeof useAppRoot>
