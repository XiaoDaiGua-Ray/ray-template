import { useSettingGetters } from '@/store'
import { useVueRouter } from '@/hooks'

/**
 *
 * @description
 * 检查 appRootRoute.path 是否存配置正确。如果配置错误，将抛出错误。
 *
 * 如果配置错误可以检查: [src/store/modules/setting/index.ts] 中的 appRootRoute 配置。
 *
 * 该方法会通过调用 getRoutes 方法获取所有路由，也就意味着检查的路由格式是铺开之后的格式。当你的路由是嵌套路由时，需要注意检查完整的路径。
 */
export const validAppRootPath = async () => {
  if (!__DEV__) {
    return
  }

  const { getAppRootRoute } = useSettingGetters()
  const {
    router: { getRoutes },
  } = useVueRouter()

  const find = getRoutes().find(
    (curr) => curr.path === getAppRootRoute.value.path,
  )

  if (!find) {
    throw new Error(
      `[validAppRootPath]: 'store setting appRootRoute path: ' '${getAppRootRoute.value.path}' not found in router, please check the 'appRootRoute' setting in the store setting module.`,
    )
  }
}
