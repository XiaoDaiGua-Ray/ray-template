/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2022-11-03
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 该文件为 menu 菜单 pinia store
 *
 * 说明:
 *   - BreadcrumbMenu、TagMenu、Menu 统一管理
 *   - BreadcrumbMenu、TagMenu、Menu 属性值重度依赖 vue-router routers, 所以需要按照该项目约定方法进行配置
 */

import { NEllipsis } from 'naive-ui'
import RayIcon from '@/components/RayIcon/index'

import { getCache, setCache } from '@/utils/cache'
import { validRole } from '@/router/basic'
import { parse, matchMenuOption } from './helper'

import type { MenuOption } from 'naive-ui'
import type { RouteMeta } from 'vue-router'

export const useMenu = defineStore(
  'menu',
  () => {
    const router = useRouter()
    const route = useRoute()
    const { t } = useI18n()

    const cacheMenuKey =
      getCache('menuKey') === 'no' ? '/dashboard' : getCache('menuKey')

    const menuState = reactive({
      menuKey: cacheMenuKey as MenuKey, // 当前菜单 `key`
      options: [] as IMenuOptions[], // 菜单列表
      collapsed: false, // 是否折叠菜单
      menuTagOptions: [] as TagMenuOptions[], // tag 标签菜单
      breadcrumbOptions: [] as IMenuOptions[], // 面包屑菜单
    })

    /**
     *
     * @param key 菜单更新后的 `key`
     * @param item 菜单当前 `item`
     *
     * 修改 `menu key` 后的回调函数
     */
    const menuModelValueChange = (key: string | number, item: MenuOption) => {
      const meta = item.meta as RouteMeta

      if (meta.windowOpen) {
        window.open(meta.windowOpen)
      } else {
        // 防止重复点击做重复操作处理
        if (menuState.menuKey !== key) {
          matchMenuOption(
            item as unknown as TagMenuOptions,
            menuState.menuKey,
            menuState.menuTagOptions,
          )

          menuState.breadcrumbOptions = parse(menuState.options, 'key', key) // 获取面包屑

          if (key[0] !== '/') {
            const p = menuState.breadcrumbOptions
              .map((curr) => curr.key)
              .join('/')

            router.push(p)
          } else {
            router.push(item.path as string)
          }

          menuState.menuKey = key
          setCache('menuKey', key)
        }
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
          const label = computed(() =>
            meta?.i18nKey
              ? t(`GlobalMenuOptions.${meta!.i18nKey}`)
              : meta?.noLocalTitle,
          )

          /** 拼装菜单项 */
          const route = {
            ...curr,
            key: curr.path,
            label: () =>
              h(NEllipsis, null, {
                default: () => label.value,
              }),
            breadcrumbLabel: label.value,
          } as IMenuOptions

          /** 是否有 icon */
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

      /** 初始化后渲染面包屑 */
      nextTick(() => {
        menuState.breadcrumbOptions = parse(
          menuState.options,
          'key',
          menuState.menuKey as string,
        )
      })
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
  },
  {
    persist: {
      key: 'piniaMenuStore',
      storage: window.sessionStorage,
      paths: ['breadcrumbOptions', 'menuKey'],
    },
  },
)
