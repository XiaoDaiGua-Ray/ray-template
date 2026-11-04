import { useSettingActions, useSettingGetters } from '@/store'
import type { AppRootRoute } from '@/store/modules/setting/types'

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
   * 设置根路由。
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
