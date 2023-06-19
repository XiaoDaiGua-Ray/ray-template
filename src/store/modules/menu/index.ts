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
 *
 * 缓存(sessionStorage):
 *   - breadcrumbOptions
 *   - menuKey
 */

import { NEllipsis } from 'naive-ui'

import { getCache, setCache } from '@/utils/cache'
import { validMenuItemShow } from '@/router/helper/routerCopilot'
import {
  parse,
  matchMenuOption,
  updateDocumentTitle,
  hasMenuIcon,
  getCatchMenuKey,
} from './helper'
import { useI18n } from '@/locales/useI18n'
import routeModules from '@/router/routeModules'
import { useKeepAlive } from '@/store'
import { useVueRouter } from '@/router/helper/useVueRouter'

import type { MenuOption } from 'naive-ui'
import type { AppRouteMeta } from '@/router/type'

export const useMenu = defineStore(
  'menu',
  () => {
    const { router } = useVueRouter()
    const route = useRoute()
    const { t } = useI18n()
    const { setKeepAliveInclude } = useKeepAlive()

    const menuState = reactive({
      menuKey: getCatchMenuKey(), // 当前菜单 `key`
      options: [] as IMenuOptions[], // 菜单列表
      collapsed: false, // 是否折叠菜单
      menuTagOptions: [] as MenuTagOptions[], // tag 标签菜单
      breadcrumbOptions: [] as IMenuOptions[], // 面包屑菜单
    })

    /**
     *
     * @param options menu options
     * @param key target key
     *
     * @remark 获取完整菜单项
     */
    const getCompleteRoutePath = (
      options: IMenuOptions[],
      key: string | number,
    ) => {
      const ops = parse(options, 'key', key)

      return ops
    }

    /**
     *
     * @param key 菜单更新后的 `key`
     * @param item 菜单当前 `item`
     *
     * @remark 修改 `menu key` 后的回调函数
     * @remark 修改后, 缓存当前选择 key 并且存储标签页与跳转页面(router push 操作)
     */
    const menuModelValueChange = (key: string | number, item: MenuOption) => {
      const meta = item.meta as AppRouteMeta

      if (meta.windowOpen) {
        window.open(meta.windowOpen)
      } else {
        // 防止重复点击做重复操作处理
        if (menuState.menuKey !== key) {
          matchMenuOption(
            item as unknown as MenuTagOptions,
            menuState.menuKey,
            menuState.menuTagOptions,
          )
          updateDocumentTitle(item as unknown as IMenuOptions)
          setKeepAliveInclude(item as unknown as IMenuOptions)

          menuState.breadcrumbOptions = parse(menuState.options, 'key', key) // 获取面包屑

          /** 是否为根路由 */
          if (key[0] !== '/') {
            /** 如果不是根路由, 则拼接完整路由并跳转 */
            const path = getCompleteRoutePath(menuState.options, key)
              .map((curr) => curr.key)
              .join('/')

            router.push(path)
          } else {
            /** 根路由直接跳转 */
            router.push(item.path as string)
          }

          menuState.menuKey = key

          /** 缓存菜单 key(sessionStorage) */
          setCache('menuKey', key)
        }
      }
    }

    /**
     *
     * @param path 路由地址
     *
     * @remark 监听路由地址变化更新菜单状态
     * @remark 递归查找匹配项
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
     * @param optins menu tag option(s)
     * @param isAppend true: 追加操作(push), false: 覆盖操作
     */
    const setMenuTagOptions = (
      optins: MenuTagOptions | MenuTagOptions[],
      isAppend = true,
    ) => {
      const isArray = Array.isArray(optins)
      const arr = isArray ? [...optins] : [optins]

      isAppend
        ? menuState.menuTagOptions.push(...arr)
        : (menuState.menuTagOptions = arr)
    }

    /**
     *
     * @remark 初始化菜单列表, 并且按照权限过滤
     * @remark 如果权限发生变动, 则会触发强制弹出页面并且重新登陆
     */
    const setupAppRoutes = () => {
      const resolveOption = (option: IMenuOptions) => {
        const { meta } = option

        /** 设置 label, i18nKey 优先级最高 */
        const label = computed(() =>
          meta?.i18nKey ? t(`${meta!.i18nKey}`) : meta?.noLocalTitle,
        )
        /** 拼装菜单项 */
        const route = {
          ...option,
          key: option.path,
          label: () =>
            h(NEllipsis, null, {
              default: () => label.value,
            }),
          breadcrumbLabel: label.value,
        } as IMenuOptions
        /** 合并 icon */
        const attr: IMenuOptions = Object.assign({}, route, {
          icon: hasMenuIcon(option),
        })

        if (option.path === getCatchMenuKey()) {
          /** 设置菜单标签 */
          setMenuTagOptions(attr)
          /** 设置浏览器标题 */
          updateDocumentTitle(attr)
        }

        /** 检查该菜单项是否展示 */
        attr.show = validMenuItemShow(option)

        return attr
      }

      const resolveRoutes = (routes: IMenuOptions[], index: number) => {
        const catchArr: IMenuOptions[] = []

        for (const curr of routes) {
          if (curr.children?.length && validMenuItemShow(curr)) {
            curr.children = resolveRoutes(curr.children, index++)
          } else if (!validMenuItemShow(curr)) {
            /** 如果校验失败, 则不会添加进 menu options */
            continue
          }

          catchArr.push(resolveOption(curr))
        }

        return catchArr
      }

      /** 缓存菜单列表 */
      menuState.options = resolveRoutes(routeModules as IMenuOptions[], 0)

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

    /**
     *
     * @param idx 当前关闭标签索引
     * @param length 裁剪标签页长度
     *
     * @returns 被关闭标签项
     */
    const spliceMenTagOptions = (idx: number, length = 1) =>
      menuState.menuTagOptions.splice(idx, length)

    /**
     *
     * @remark 置空 menuTagOptions
     *
     * Q: 为什么不直接使用 spliceMenTagOptions 方法置空菜单标签?
     * A: 因为直接将 menuTagOptions 指向新的地址会快一点
     */
    const emptyMenuTagOptions = () => {
      menuState.menuTagOptions = []
    }

    /** 监听路由变化并且更新路由菜单与菜单标签 */
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
      emptyMenuTagOptions,
      setMenuTagOptions,
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
