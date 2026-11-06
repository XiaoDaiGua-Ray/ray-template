import { useSettingActions, useSettingGetters } from '@/store'
import type { AppRootRoute } from '@/store/modules/setting/types'

/**
 *
 * @description
 * 只读写历史偏好字段，不影响登录落点、标签关闭、菜单激活或路由权限。
 *
 * @returns 历史首页偏好的响应式引用和合并更新方法。
 * @deprecated 仅兼容旧设置；使用 Router 显式导航，空工作区统一为 /welcome。
 */
export function useAppRoot() {
  const { getAppRootRoute } = useSettingGetters()
  const { updateSettingState } = useSettingActions()

  const getRootRoute = getAppRootRoute
  const getRootPath = computed(() => getAppRootRoute.value.path)
  const getRootName = computed(() => getAppRootRoute.value.name)

  /**
   *
   * @param route 根路由配置内容
   *
   * @description
   * 合并历史首页偏好，不触发导航，也不改变空工作区或标签保护规则。
   */
  const setRootRoute = (route: Partial<AppRootRoute>) => {
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
