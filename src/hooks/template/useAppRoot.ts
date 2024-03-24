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

import { useSettingGetters, useSettingActions } from '@/store'

import type { AppRootRoute } from '@/store/modules/setting/types'

export function useAppRoot() {
  const { getAppRootRoute } = useSettingGetters()
  const { updateSettingState } = useSettingActions()

  /**
   *
   * @description
   * 获取根路由。
   */
  const getRootRoute = getAppRootRoute
  /**
   *
   * @description
   * 获取根路由 path。
   */
  const getRootPath = computed(() => getAppRootRoute.value.path)
  /**
   *
   * @description
   * 获取根路由 name。
   */
  const getRootName = computed(() => getAppRootRoute.value.name)

  /**
   *
   * @param route 根路由配置内容
   *
   * @description
   * 设置根路由。
   *
   * @example
   * setRootRoute({ path: '/your root path', name: 'your root name' })
   */
  const setRootRoute = (route: AppRootRoute) => {
    updateSettingState(
      'appRootRoute',
      Object.assign({}, getAppRootRoute.value, route),
    )
  }

  return {
    getRootRoute,
    getRootPath,
    getRootName,
    setRootRoute,
  }
}

export type UseAppRootReturnType = ReturnType<typeof useAppRoot>
