import { NEllipsis } from 'naive-ui'
import RayIcon from '@/components/RayIcon/index'

import { getCache, setCache } from '@/utils/cache'
import { validRole } from '@/router/basic'

import type { MenuOption } from 'naive-ui'
import type { RouteMeta } from 'vue-router'

export const useMenu = defineStore('menu', () => {
  const router = useRouter()
  const route = useRoute()
  const { t } = useI18n()

  const cacheMenuKey =
    getCache('menuKey') === 'no' ? '/dashboard' : getCache('menuKey')

  const menuState = reactive({
    menuKey: cacheMenuKey as string | null, // 当前菜单 `key`
    options: [] as IMenuOptions[], // 菜单列表
    collapsed: false, // 是否折叠菜单
    menuTagOptions: [] as TagMenuOptions[],
  })

  const handleMenuTagOptions = (item: IMenuOptions) => {
    if (item.path !== menuState.menuKey) {
      const tag = menuState.menuTagOptions.find(
        (curr) => curr.path === item.path,
      )

      if (!tag) {
        menuState.menuTagOptions.push(item)
      }
    }
  }

  /**
   *
   * @param key 菜单更新后的 `key`
   * @param item 菜单当前 `item`
   *
   * 修改 `menu key` 后的回调函数
   */
  const menuModelValueChange = (key: string, item: MenuOption) => {
    const meta = item.meta as RouteMeta

    if (meta.windowOpen) {
      window.open(meta.windowOpen)
    } else {
      handleMenuTagOptions(item as unknown as TagMenuOptions)

      menuState.menuKey = key

      router.push(`${item.path}`)

      setCache('menuKey', key)
    }
  }

  /**
   *
   * @param path 路由地址
   *
   * 监听路由地址变化更新菜单状态
   */
  const updateMenuKeyWhenRouteUpdate = (path: string) => {
    const matchMenuItem = (options: MenuOption[]) => {
      for (const i of options) {
        if (i?.children?.length) {
          matchMenuItem(i.children)
        }

        if (path === i.path) {
          menuModelValueChange(i.path, i)

          break
        }
      }
    }

    matchMenuItem(menuState.options as MenuOption[])
  }

  /**
   *
   * @remark 初始化菜单列表, 并且按照权限过滤
   * @remark 如果权限发生变动, 则会触发强制弹出页面并且重新登陆
   */
  const setupAppRoutes = () => {
    const layout = router.getRoutes().find((route) => route.name === 'layout')

    const resolveRoutes = (routes: IMenuOptions[], index: number) => {
      return routes.map((curr) => {
        if (curr.children?.length) {
          curr.children = resolveRoutes(curr.children, index++)
        }

        const { meta } = curr

        const route = {
          ...curr,
          key: curr.path,
          label: () =>
            h(NEllipsis, null, {
              default: () => t(`GlobalMenuOptions.${meta!.i18nKey}`),
            }),
        }

        const expandIcon = {
          icon: () =>
            h(
              RayIcon,
              {
                name: meta!.icon as string,
                size: 20,
              },
              {},
            ),
        }

        const attr: IMenuOptions = meta?.icon
          ? Object.assign({}, route, expandIcon)
          : route

        if (curr.path === cacheMenuKey) {
          menuState.menuTagOptions.push(attr)
        }

        attr.show = validRole(curr)

        return attr
      })
    }

    menuState.options = resolveRoutes(layout?.children as IMenuOptions[], 0)
  }

  /**
   *
   * @param collapsed 折叠菜单开关
   */
  const collapsedMenu = (collapsed: boolean) =>
    (menuState.collapsed = collapsed)

  const spliceMenTagOptions = (idx: number) =>
    menuState.menuTagOptions.splice(idx, 1)

  watch(
    () => route.fullPath,
    (newData) => {
      updateMenuKeyWhenRouteUpdate(newData)
    },
    {
      immediate: true,
    },
  )

  return {
    ...toRefs(menuState),
    menuModelValueChange,
    setupAppRoutes,
    collapsedMenu,
    spliceMenTagOptions,
  }
})
