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
 */

import { NEllipsis } from 'naive-ui'

import { setStorage, pick } from '@/utils'
import { validRole, validMenuItemShow } from '@/router/helper/routerCopilot'
import {
  parseAndFindMatchingNodes,
  updateDocumentTitle,
  hasMenuIcon,
  getCatchMenuKey,
} from './helper'
import { useI18n } from '@/hooks/web'
import { getAppRawRoutes } from '@/router/appRouteModules'
import { useKeepAliveActions } from '@/store'

import type { AppMenuOption, MenuTagOptions } from '@/types'
import type { MenuState } from '@/store/modules/menu/type'
import type { LocationQuery } from 'vue-router'

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
    const isRootPathReg = new RegExp('/', 'g')

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
        menuState.currentMenuOption = attr
      }

      attr.show = validMenuItemShow(attr)

      return attr
    }

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
      menuState.breadcrumbOptions = getCompleteRoutePath(menuState.options, key)
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
      const tag = menuState.menuTagOptions.find((curr) => curr.path === key)

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
     * @remark 修改 `menu key` 后的回调函数
     * @remark 修改后, 缓存当前选择 key 并且存储标签页与跳转页面(router push 操作)
     *
     * 如果 windowOpen 存在, 则直接打开新窗口，不会更新当前菜单状态，也不会做其他的操作
     * 如果 sameLevel 存在，则会追加一层面包屑，并不会触发菜单更新与标签页更新
     *
     * 在执行更新操作后会做一些缓存操作
     *
     * 该方法是整个模板的核心驱动: 菜单、标签页、面包屑、浏览器标题等等的更新方法
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
        if (String(key)[0] === '/') {
          /** 根路由直接跳转 */
          push({
            path,
            query,
          })
        } else {
          /** 如果不是根路由, 则拼接完整路由并跳转 */
          const _path = getCompleteRoutePath(menuState.options, key)
            .map((curr) => curr.key)
            .join('/')

          push({
            path: _path,
            query,
          })
        }

        /** 检查是否为根路由 */
        const count = (path.match(isRootPathReg) || []).length
        const { sameLevel } = meta

        /** 更新缓存队列 */
        setKeepAliveInclude(option)
        /** 更新浏览器标题 */
        updateDocumentTitle(option)

        // 如果不为 sameLevel，则会执行更新：覆盖更新面包屑、添加标签菜单、更新缓存
        if (!sameLevel || (sameLevel && count === 1)) {
          /** 更新标签菜单 */
          setMenuTagOptionsWhenMenuValueChange(key, option)
          /** 更新面包屑 */
          setBreadcrumbOptions(key, option)

          menuState.menuKey = key
          menuState.currentMenuOption = option

          /** 缓存菜单 key(sessionStorage) */
          setStorage('menuKey', key)
        } else {
          // 使用 pick 提取仅需要的字段，避免 vue 抛错空引用，导致性能损耗
          const breadcrumbOption = pick(resolveOption(option), [
            'breadcrumbLabel',
            'children',
            'key',
            'meta',
            'name',
            'path',
            'show',
          ])
          // 查看是否重复
          const find = menuState.breadcrumbOptions.find(
            (curr) => curr.key === breadcrumbOption.key,
          )

          // 如果未重复追加
          if (!find) {
            menuState.breadcrumbOptions.push(
              breadcrumbOption as unknown as AppMenuOption,
            )
          }
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
    const updateMenuKeyWhenRouteUpdate = async (
      path: string,
      query: LocationQuery,
    ) => {
      const [routePath] = path.split('?')
      const count = (routePath.match(new RegExp('/', 'g')) || []).length // 如果获取长度为 1，则视为根路由

      let combinePath = routePath

      if (count > 1) {
        // 如果不是跟路径则取出最后一项字符
        const splitPath = routePath.split('/').filter((curr) => curr)

        combinePath = splitPath[splitPath.length - 1]
      }

      // 直接使用完整 url，检查是否在 routes 中
      const findMenuOption = getRoutes().find((curr) => curr.path === routePath)

      if (findMenuOption) {
        // 使用 pick 提取仅需要的字段，避免 vue 抛错空引用，导致性能损耗
        const pickOption = pick(findMenuOption, [
          'children',
          'meta',
          'path',
          'name',
          'redirect',
        ]) as unknown as AppMenuOption

        changeMenuModelValue(
          count > 1 ? combinePath : path,
          resolveOption(pickOption),
          query,
        )
      }
    }

    /**
     *
     * @remark 初始化菜单列表, 并且按照权限过滤
     * @remark 如果权限发生变动, 则会触发强制弹出页面并且重新登陆
     */
    const setupAppMenu = () => {
      return new Promise<void>((resolve) => {
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

        // 初始化后更新面包屑、标签菜单
        if (menuState.currentMenuOption) {
          const { currentMenuOption } = menuState

          setBreadcrumbOptions(currentMenuOption.key, currentMenuOption)
          setMenuTagOptionsWhenMenuValueChange(
            currentMenuOption.key,
            currentMenuOption,
          )
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
      emptyMenuTagOptions,
      setMenuTagOptions,
    }
  },
  {
    persist: {
      key: 'piniaMenuStore',
      storage: window.sessionStorage,
      paths: ['breadcrumbOptions', 'menuKey', 'menuTagOptions'],
    },
  },
)
