import { getCache, setCache } from '@/utils/cache'
import { NEllipsis } from 'naive-ui'
import RayIcon from '@/components/RayIcon/index'

import type { MenuOption } from 'naive-ui'
import type { RouteRecordRaw } from 'vue-router'

export const useMenu = defineStore('menu', () => {
  const router = useRouter()
  const { t } = useI18n()

  const cacheMenuKey = getCache('menuKey') === 'no' ? '' : getCache('menuKey')

  const menuState = reactive({
    menuKey: cacheMenuKey as string | null, // 当前菜单 `key`
    options: [] as RouteRecordRaw[], // 菜单列表
    collapsed: false, // 是否折叠菜单
    reloadRouteLog: true, // 刷新路由开关
  })

  /**
   *
   * @param key 菜单更新后的 `key`
   * @param item 菜单当前 `item`
   *
   * 修改 `menu key` 后的回调函数
   */
  const menuModelValueChange = (key: string, item: MenuOption) => {
    menuState.menuKey = key

    router.push(`${item.path}`)
    setCache('menuKey', key)
  }

  /**
   *
   * 获取菜单列表
   * 缓存菜单
   */
  const setupAppRoutes = () => {
    const layout = router.getRoutes().find((route) => route.name === 'layout')

    const resolveRoutes = (routes: RouteRecordRaw[], index: number) => {
      return routes.map((curr) => {
        if (curr.children?.length) {
          curr.children = resolveRoutes(
            curr.children as RouteRecordRaw[],
            index++,
          )
        }

        const route = {
          ...curr,
          key: curr.path,
          label: () =>
            h(NEllipsis, null, {
              default: () => t(`GlobalMenuOptions.${curr!.meta!.i18nKey}`),
            }),
        }
        const expandIcon = {
          icon: () =>
            h(
              RayIcon,
              {
                name: curr?.meta?.icon as string,
                size: 20,
              },
              {},
            ),
        }

        return curr.meta?.icon ? Object.assign(route, expandIcon) : route
      })
    }

    menuState.options = resolveRoutes(layout?.children as RouteRecordRaw[], 0)
  }

  /**
   *
   * @param collapsed 折叠菜单开关
   */
  const collapsedMenu = (collapsed: boolean) =>
    (menuState.collapsed = collapsed)

  /**
   *
   * @param bool 刷新页面开关
   */
  const changeReloadLog = (bool: boolean) => (menuState.reloadRouteLog = bool)

  return {
    ...toRefs(menuState),
    menuModelValueChange,
    setupAppRoutes,
    collapsedMenu,
    changeReloadLog,
  }
})
