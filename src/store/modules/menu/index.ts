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
 *   - menuTagOptions
 *
 * 备注:
 *   - parseAndFindMatchingNodes: 如果需要反向查找完整的父子节点，可以使用该方法
 */

import { NEllipsis } from 'naive-ui'

import { setStorage, equalRouterPath } from '@/utils'
import { validRole, validMenuItemShow } from '@/router/utils'
import {
  parseAndFindMatchingNodes,
  updateDocumentTitle,
  createMenuIcon,
  getCatchMenuKey,
  createMenuExtra,
} from './utils'
import { useI18n } from '@/hooks'
import { getAppRawRoutes } from '@/router/app-route-modules'
import { useKeepAliveActions } from '@/store'
import { APP_CATCH_KEY } from '@/app-config'
import { pick } from 'lodash-es'
import { pickRouteRecordNormalizedConstant } from './constant'

import type { AppMenuOption, MenuTagOptions } from '@/types'
import type { MenuState } from '@/store/modules/menu/types'
import type { LocationQuery } from 'vue-router'
import type { UpdateMenuState } from './types'

let cachePreNormal: AppMenuOption | undefined = void 0

/**
 *
 * @param options 菜单列表或者类似菜单列表的数据结构
 * @param target 目标路径
 *
 * @returns 匹配的菜单项
 *
 * @description
 * 递归查找匹配的菜单项，缓存上一次的匹配项。
 * 并且该方法一旦匹配成功就会立即返回。
 *
 * 通过 fullPath 进行匹配。
 *
 * @example
 * depthSearchAppMenu([{ path: '/dashboard', name: 'Dashboard', meta: { i18nKey: 'menu.Dashboard' } }], '/dashboard')
 */
export const depthSearchAppMenu = (
  options: AppMenuOption[],
  target: string,
) => {
  if (cachePreNormal && equalRouterPath(cachePreNormal.fullPath, target)) {
    return cachePreNormal
  }

  for (const curr of options) {
    if (equalRouterPath(curr.fullPath, target)) {
      cachePreNormal = curr

      return curr
    }

    if (curr.children?.length) {
      depthSearchAppMenu(curr.children, target)

      continue
    }
  }
}

export const piniaMenuStore = defineStore(
  'menu',
  () => {
    const { push, getRoutes } = useRouter()
    const route = useRoute()
    const { t } = useI18n()
    const { setKeepAliveInclude } = useKeepAliveActions()

    const menuState = reactive<MenuState>({
      menuKey: getCatchMenuKey(), // 当前菜单 `key`
      options: [], // 菜单列表
      collapsed: false, // 是否折叠菜单
      menuTagOptions: [], // tag 标签菜单
      breadcrumbOptions: [], // 面包屑菜单
      currentMenuOption: null, // 当前激活菜单项
    })
    const isSetupAppMenuLock = ref(true)

    /**
     *
     * @param key menu state key
     * @param value updated value
     *
     * @description
     * 更新 menu state 指定 key 的值。
     */
    const updateMenuState: UpdateMenuState = (key, value) => {
      if (Object.hasOwn(menuState, key as string)) {
        menuState[key] = value
      }
    }

    /**
     *
     * @param option 菜单项（类似于菜单项的数据结构也可以）
     *
     * @returns 转换后的菜单项
     *
     * @description
     * 将路由项或者类似于菜单项的数据结构转换为菜单项（AppMenu）。
     * 但是，该方法有一个地方需要注意，那就是需要手动设置一下准确的 fullPath，
     * 其实这是一个设计的失误，因为该方法不能准确的感知到 fullPath 应该是什么。
     *
     * @example
     * resolveOption({ path: '/dashboard', name: 'Dashboard', meta: { i18nKey: 'menu.Dashboard' } })
     * resolveOption({ ...VueRouterRouteOption })
     */
    const resolveOption = (option: AppMenuOption) => {
      const { meta } = option
      const { i18nKey, noLocalTitle } = meta

      /** 设置 label, i18nKey 优先级最高 */
      const label = computed(() => (i18nKey ? t(`${i18nKey}`) : noLocalTitle))
      /**
       *
       * 拼装菜单项
       * 容错处理，兼容以前版本 key 选取为 path 的情况
       */
      const route = {
        ...option,
        key: option.fullPath,
        label: () =>
          h(NEllipsis, null, {
            default: () => label.value,
          }),
        breadcrumbLabel: label.value,
      } as AppMenuOption
      /** 合并 icon, extra */
      const attr: AppMenuOption = Object.assign({}, route, {
        icon: createMenuIcon(option),
        extra: createMenuExtra(option),
      })

      if (option.fullPath === getCatchMenuKey()) {
        menuState.currentMenuOption = attr
      }

      attr.show = validMenuItemShow(attr)

      return attr
    }

    /**
     *
     * 设置面包屑
     *
     * 如果识别到为平级模式, 则会自动追加一层面包屑
     */
    const setBreadcrumbOptions = (key: string | number) => {
      menuState.breadcrumbOptions = parseAndFindMatchingNodes(
        menuState.options,
        'fullPath',
        key,
      )
    }

    /**
     *
     * @param options menu tag option(s)
     * @param isAppend true: 追加操作(push), false: 覆盖操作
     */
    const setMenuTagOptions = (
      options: MenuTagOptions | MenuTagOptions[],
      isAppend = true,
    ) => {
      const isArray = Array.isArray(options)
      const arr = isArray ? [...options] : [options]

      isAppend
        ? menuState.menuTagOptions.push(...arr)
        : (menuState.menuTagOptions = arr)
    }

    /** 当 url 地址发生变化触发 menuTagOptions 更新 */
    const setMenuTagOptionsWhenMenuValueChange = (
      key: string | number,
      option: AppMenuOption,
    ) => {
      const tag = menuState.menuTagOptions.find((curr) => curr.fullPath === key)

      if (!tag) {
        menuState.menuTagOptions.push(option as MenuTagOptions)
      }
    }

    /**
     *
     * @param key 菜单更新后的 key
     * @param option 菜单当前 option 项
     * @param query 路由参数
     *
     * @description
     * 修改 `menu key` 后的回调函数。
     * 修改后，缓存当前选择 key 并且存储标签页与跳转页面(router push 操作)。
     *
     * 如果 windowOpen 存在, 则直接打开新窗口，不会更新当前菜单状态，也不会做其他的操作。
     * 如果 sameLevel 存在，则会追加一层面包屑，并不会触发菜单更新与标签页更新。
     *
     * 在执行更新操作后会做一些缓存操作。
     *
     * 该方法是整个模板的核心驱动: 菜单、标签页、面包屑、浏览器标题等等的更新方法。
     *
     * @example
     * changeMenuModelValue('/dashboard',{ dashboard option  }) // 跳转页面至 dashboard，并且更新菜单状态、标签页、面包屑、浏览器标题等等
     * changeMenuModelValue('/dashboard', { dashboard option }, { id: 1 }) // 执行更新操作，并且传递参数
     */
    const changeMenuModelValue = (
      key: string | number,
      option: AppMenuOption,
      query?: LocationQuery,
    ) => {
      const { meta } = option

      if (meta.windowOpen) {
        window.open(meta.windowOpen)
      } else {
        push({
          path: String(key),
          query,
        })

        const { sameLevel } = meta

        /** 更新缓存队列 */
        setKeepAliveInclude(option)
        /** 更新浏览器标题 */
        updateDocumentTitle(option)

        // 如果不为 sameLevel，则会执行更新：覆盖更新面包屑、添加标签菜单、更新缓存
        if (!sameLevel) {
          /** 更新标签菜单 */
          setMenuTagOptionsWhenMenuValueChange(key, option)
          /** 更新面包屑 */
          setBreadcrumbOptions(key)

          menuState.menuKey = key
          menuState.currentMenuOption = option

          /** 缓存菜单 key(sessionStorage) */
          setStorage(APP_CATCH_KEY.appMenuKey, key)
        } else {
          // 使用 pick 提取仅需要的字段，避免 vue 抛错空引用，导致性能损耗
          const breadcrumbOption = pick(
            resolveOption(option),
            pickRouteRecordNormalizedConstant,
          ) as unknown as AppMenuOption
          // 查看是否重复
          const find = menuState.breadcrumbOptions.find(
            (curr) => curr.key === breadcrumbOption.key,
          )

          // 如果未重复追加
          if (!find) {
            menuState.breadcrumbOptions.push({
              ...breadcrumbOption,
              fullPath: String(breadcrumbOption.key),
            })
          }
        }
      }
    }

    /**
     *
     * @param path 路由地址
     *
     * @description
     * 监听路由地址变化更新菜单状态。
     */
    const updateMenuKeyWhenRouteUpdate = async (
      path: string,
      query: LocationQuery,
    ) => {
      const [routePath] = path.split('?')

      // 直接使用完整 url，检查是否在 routes 中
      const findMenuOption = getRoutes().find((curr) => curr.path === routePath)

      if (findMenuOption) {
        // 使用 pick 提取仅需要的字段，避免 vue 抛错空引用，导致性能损耗
        const pickOption = pick(
          findMenuOption,
          pickRouteRecordNormalizedConstant,
        ) as unknown as AppMenuOption

        changeMenuModelValue(
          routePath,
          resolveOption({
            ...pickOption,
            fullPath: pickOption.path,
          }),
          query,
        )
      }
    }

    /**
     *
     * 初始化系统菜单列表，该方法仅执行一次
     * 会在初始化时拼接完整的 url 地址为 fullPath
     */
    const setupAppMenu = () => {
      return new Promise<void>((resolve) => {
        const resolveRoutes = (routes: AppMenuOption[], parentPath: string) => {
          const catchArr: AppMenuOption[] = []

          for (const curr of routes) {
            let fullPath = `${
              parentPath.endsWith('/') ? parentPath : parentPath + '/'
            }${curr.path}`

            // 使用正则表达式替换重复的 '/'
            fullPath = fullPath.replace(/\/+/g, '/')

            if (curr.children?.length) {
              curr.children = resolveRoutes(curr.children, fullPath)
            } else if (!validRole(curr.meta)) {
              continue
            }

            catchArr.push(
              resolveOption({
                ...curr,
                fullPath,
              }),
            )
          }

          return catchArr
        }

        menuState.options = resolveRoutes(
          getAppRawRoutes() as AppMenuOption[],
          '',
        )

        if (menuState.currentMenuOption) {
          const { currentMenuOption } = menuState

          // 惰性更新面包屑，避免 sameLevel 模式下的面包屑被覆盖
          if (!menuState.breadcrumbOptions.length) {
            setBreadcrumbOptions(currentMenuOption.key)
          }

          setMenuTagOptionsWhenMenuValueChange(
            currentMenuOption.fullPath,
            currentMenuOption,
          )
          updateDocumentTitle(currentMenuOption)
        }

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
     * 初始化系统菜单列表
     * 该方法仅执行一次
     */
    const setupPiniaMenuStore = async () => {
      if (!isSetupAppMenuLock.value) {
        return
      }

      await setupAppMenu()

      isSetupAppMenuLock.value = false
    }

    /** 监听路由变化并且更新路由菜单与菜单标签 */
    watch(
      () => route.fullPath,
      async (ndata, odata) => {
        await setupPiniaMenuStore()

        if (ndata !== odata) {
          await updateMenuKeyWhenRouteUpdate(ndata, route.query)
        }
      },
      {
        immediate: true,
      },
    )

    return {
      ...toRefs(menuState),
      changeMenuModelValue,
      collapsedMenu,
      spliceMenTagOptions,
      setMenuTagOptions,
      resolveOption,
      updateMenuState,
    }
  },
  {
    persist: {
      key: APP_CATCH_KEY.appPiniaMenuStore,
      storage: window.localStorage,
      pick: ['breadcrumbOptions', 'menuKey', 'menuTagOptions', 'collapsed'],
    },
  },
)
