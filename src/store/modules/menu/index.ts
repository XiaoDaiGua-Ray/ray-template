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

import { setStorage } from '@/utils/cache'
import { validRole, validMenuItemShow } from '@/router/helper/routerCopilot'
import {
  parseAndFindMatchingNodes,
  updateDocumentTitle,
  hasMenuIcon,
  getCatchMenuKey,
} from './helper'
import { useI18n } from '@/locales/useI18n'
import { getAppRawRoutes } from '@/router/routeModules'
import { expandRoutes } from '@/router/helper/expandRoutes'
import { useKeepAlive } from '@/store'
import { useVueRouter } from '@/router/helper/useVueRouter'

import type { MenuOption } from 'naive-ui'
import type { AppRouteMeta, AppRouteRecordRaw } from '@/router/type'
import type {
  AppMenuOption,
  MenuTagOptions,
  AppMenuKey,
} from '@/types/modules/app'
import type { MenuState } from '@/store/modules/menu/type'

export const useMenu = defineStore(
  'menu',
  () => {
    const { router } = useVueRouter()
    const route = useRoute()
    const { t } = useI18n()
    const { setKeepAliveInclude } = useKeepAlive()

    const menuState = reactive<MenuState>({
      menuKey: getCatchMenuKey(), // 当前菜单 `key`
      options: [], // 菜单列表
      collapsed: false, // 是否折叠菜单
      menuTagOptions: [], // tag 标签菜单
      breadcrumbOptions: [], // 面包屑菜单
    })
    const isSetupAppMenuLock = ref(true)

    /**
     *
     * @param options menu options
     * @param key target key
     *
     * @remark 获取完整菜单项
     */
    const getCompleteRoutePath = (
      options: AppMenuOption[],
      key: string | number,
    ) => {
      const ops = parseAndFindMatchingNodes(options, 'key', key)

      return ops
    }

    /**
     *
     * 设置面包屑
     *
     * 如果识别到为平级模式, 则会自动追加一层面包屑
     */
    const setBreadcrumbOptions = (
      key: string | number,
      option: AppMenuOption,
    ) => {
      const { meta } = option as unknown as AppRouteRecordRaw

      menuState.breadcrumbOptions = getCompleteRoutePath(menuState.options, key)

      if (meta.sameLevel) {
        nextTick().then(() => {
          const fd = menuState.breadcrumbOptions.find((curr) => {
            return curr.path === option.path
          })

          if (!fd) {
            menuState.breadcrumbOptions.push(option as unknown as AppMenuOption)
          }
        })
      }
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

    /** 当 url 地址发生变化触发 menuTagOptions 更新 */
    const setMenuTagOptionsWhenMenuValueChange = (
      key: string | number,
      option: AppMenuOption,
    ) => {
      const tag = menuState.menuTagOptions.find((curr) => curr.path === key)

      if (!tag) {
        menuState.menuTagOptions.push(option as MenuTagOptions)
      }
    }

    /**
     *
     * @param key 菜单更新后的 key
     * @param option 菜单当前 option 项
     *
     * @remark 修改 `menu key` 后的回调函数
     * @remark 修改后, 缓存当前选择 key 并且存储标签页与跳转页面(router push 操作)
     */
    const changeMenuModelValue = (
      key: string | number,
      option: AppMenuOption,
    ) => {
      const { meta, path } = option

      if (meta.windowOpen) {
        window.open(meta.windowOpen)
      } else {
        /**
         *
         * key 以 `/` 开头, 则说明为根路由, 直接跳转
         * key 开头未匹配到 `/`, 则需要获取到完整路由后再进行跳转
         *
         * 但是, 缓存 key 都以当前点击 key 为准
         */
        if (!String(key).startsWith('/')) {
          /** 如果不是根路由, 则拼接完整路由并跳转 */
          const _path = getCompleteRoutePath(menuState.options, key)
            .map((curr) => curr.key)
            .join('/')

          router.push(_path)
        } else {
          /** 根路由直接跳转 */
          router.push(path)
        }

        /** 检查是否为根路由 */
        const count = (path.match(new RegExp('/', 'g')) || []).length

        /** 更新缓存队列 */
        setKeepAliveInclude(option as unknown as AppMenuOption)
        /** 更新浏览器标题 */
        updateDocumentTitle(option as unknown as AppMenuOption)

        if (!meta.sameLevel || (meta.sameLevel && count === 1)) {
          /** 更新标签菜单 */
          setMenuTagOptionsWhenMenuValueChange(key, option)
          /** 更新面包屑 */
          setBreadcrumbOptions(key, option)

          menuState.menuKey = key
          /** 缓存菜单 key(sessionStorage) */
          setStorage('menuKey', key)
        } else {
          setBreadcrumbOptions(menuState.menuKey || '', option)
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
    const updateMenuKeyWhenRouteUpdate = async (path: string) => {
      // 获取 `/` 出现次数(如果为 1 则表示该路径为根路由路径)
      const count = (path.match(new RegExp('/', 'g')) || []).length
      let combinePath = path

      if (count > 1) {
        // 如果不是跟路径则取出最后一项字符
        const splitPath = path.split('/').filter((curr) => curr)

        combinePath = splitPath[splitPath.length - 1]
      }

      const findMenuOption = (pathKey: string, options: AppMenuOption[]) => {
        for (const curr of options) {
          if (curr.children?.length) {
            findMenuOption(pathKey, curr.children)
          }

          if (pathKey === curr.key && !curr?.children?.length) {
            changeMenuModelValue(pathKey, curr)

            break
          }
        }
      }

      findMenuOption(combinePath, menuState.options)
    }

    /**
     *
     * @remark 初始化菜单列表, 并且按照权限过滤
     * @remark 如果权限发生变动, 则会触发强制弹出页面并且重新登陆
     */
    const setupAppMenu = () => {
      return new Promise<void>((resolve) => {
        const resolveOption = (option: AppMenuOption) => {
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
            /** 检查该菜单项是否展示 */
          } as AppMenuOption
          /** 合并 icon */
          const attr: AppMenuOption = Object.assign({}, route, {
            icon: hasMenuIcon(option),
          })

          if (option.path === getCatchMenuKey()) {
            /** 设置标签页(初始化时执行设置一次, 避免含有平级路由模式情况时出现不能正确设置标签页的情况) */
            setMenuTagOptionsWhenMenuValueChange(option.path, attr)
          }

          attr.show = validMenuItemShow(attr)

          return attr
        }

        const resolveRoutes = (routes: AppMenuOption[], index: number) => {
          const catchArr: AppMenuOption[] = []

          for (const curr of routes) {
            if (curr.children?.length) {
              curr.children = resolveRoutes(curr.children, index++)
            } else if (!validRole(curr.meta)) {
              /** 如果校验失败, 则不会添加进 menu options */
              continue
            }

            catchArr.push(resolveOption(curr))
          }

          return catchArr
        }

        /** 缓存菜单列表 */
        menuState.options = resolveRoutes(
          getAppRawRoutes() as AppMenuOption[],
          0,
        )

        resolve()
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

    /**
     *
     * 初始化系统菜单列表
     * 该方法仅执行一次
     */
    const setupPiniaMenuStore = async () => {
      if (isSetupAppMenuLock.value) {
        await setupAppMenu()
      }

      isSetupAppMenuLock.value = false
    }

    /** 监听路由变化并且更新路由菜单与菜单标签 */
    watch(
      () => route.fullPath,
      async (newData) => {
        const reg = /^([^?]+)/
        const match = newData.match(reg)?.[1]

        await setupPiniaMenuStore()
        await updateMenuKeyWhenRouteUpdate(match || '')
      },
      {
        immediate: true,
      },
    )

    return {
      ...toRefs(menuState),
      changeMenuModelValue,
      setupAppMenu,
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
