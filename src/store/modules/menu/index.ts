import { APP_CATCH_KEY } from '@/app-config'
import { useI18n } from '@/hooks'
import { getAppRawRoutes } from '@/router/app-route-modules'
import { canSkipRoute, validMenuItemShow, validRole } from '@/router/utils'
import { joinRoutePath } from '@/router/utils/join-route-path'
import { useKeepAliveActions } from '@/store'
import type { MenuState } from '@/store/modules/menu/types'
import type { AnyFn, AppMenuOption, MenuTagOptions } from '@/types'
import { setStorage } from '@/utils/cache'
import { equalRouterPath } from '@/utils/equal-router-path'
import { updateObjectValue } from '@/utils/update-object-value'
import { pick } from 'lodash-es'
import { NEllipsis } from 'naive-ui'
import type { LocationQuery, RouteRecordNormalized } from 'vue-router'
import { piniaSigningStore } from '../signing'
import { pickRouteRecordNormalizedConstant } from './constant'
import {
  createMenuExtra,
  createMenuIcon,
  getCatchMenuKey,
  getCatchMenuTagOptions,
  updateDocumentTitle,
} from './utils'

/**
 *
 * @param options 当前菜单树
 * @param target 要匹配的路径
 *
 * @returns 菜单树中第一个路径匹配项。
 */
export const depthSearchAppMenu = (
  options: AppMenuOption[],
  target: string,
): AppMenuOption | undefined => {
  for (const option of options) {
    if (equalRouterPath(option.fullPath, target)) return option

    const nested =
      option.children && depthSearchAppMenu(option.children, target)

    if (nested) return nested
  }
}

export const piniaMenuStore = defineStore(
  'menu',
  () => {
    const { push, resolve } = useRouter()
    const route = useRoute()
    const { t } = useI18n()
    const { setKeepAliveInclude } = useKeepAliveActions()

    const menuState = reactive<MenuState>({
      menuKey: getCatchMenuKey(), // 当前菜单 `key`
      options: [], // 菜单列表
      collapsed: false, // 是否折叠菜单
      menuTagOptions: getCatchMenuTagOptions(), // tag 标签菜单
      breadcrumbOptions: [], // 面包屑菜单
      currentMenuOption: null, // 当前激活菜单项
    })
    const signing = piniaSigningStore()
    const menuIndex = new Map<
      string,
      { option: AppMenuOption; parentPath: string }
    >()
    const cacheTags = () =>
      setStorage(
        APP_CATCH_KEY.appMenuTagOptions,
        menuState.menuTagOptions.map(
          ({
            name,
            key,
            path,
            show,
            meta,
            breadcrumbLabel,
            fullPath,
            closeable,
          }) => ({
            name,
            key,
            path,
            show,
            meta,
            breadcrumbLabel,
            fullPath,
            closeable,
          }),
        ),
      )

    /**
     *
     * @param key menu state key
     * @param value updated value
     * @param cb callback function
     *
     * @description
     * 更新 menu state 指定 key 的值。
     */
    const updateMenuState = <T extends keyof MenuState>(
      key: T,
      value: Partial<MenuState[T]>,
      cb?: AnyFn,
    ) => {
      updateObjectValue(menuState, key, value as MenuState[T], cb)
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
     * resolveOption({ path: '/demo', fullPath: '/demo', name: 'Demo', meta: { ... } })
     * resolveOption({ ...VueRouterRouteOption })
     */
    const resolveOption = (option: AppMenuOption) => {
      const { meta } = option
      const { i18nKey, noLocalTitle } = meta

      const getLabel = () =>
        i18nKey ? t(i18nKey) : (noLocalTitle ?? option.name ?? option.path)
      const resolved = {
        ...option,
        key: option.fullPath,
        label: () => h(NEllipsis, null, { default: getLabel }),
        get breadcrumbLabel() {
          return String(getLabel())
        },
        icon: createMenuIcon(option),
        extra: createMenuExtra(option),
      }

      return Object.assign(resolved, { show: validMenuItemShow(resolved) })
    }

    /**
     *
     * @param key menu state key
     *
     * @description
     * 设置面包屑。
     *
     * 如果识别到为平级模式，则会自动追加一层面包屑。
     */
    const setBreadcrumbOptions = (key: string | number) => {
      const trail: AppMenuOption[] = []
      let entry = menuIndex.get(String(key))

      while (entry) {
        trail.unshift(entry.option)
        entry = menuIndex.get(entry.parentPath)
      }

      menuState.breadcrumbOptions = trail
    }

    /**
     *
     * @param options menu tag option(s)
     * @param isAppend true: 追加操作(push), false: 覆盖操作
     *
     * @description
     * 设置标签页。
     * 如果传递的 options 为数组，则进行追加操作。
     * 如果传递的 options 为单个对象，则进行覆盖操作。
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

      cacheTags()
    }

    const updateActiveMenu = (option: AppMenuOption) => {
      setKeepAliveInclude(option)
      updateDocumentTitle(option)

      if (option.meta.sameLevel) {
        if (
          !menuState.breadcrumbOptions.some(({ key }) => key === option.key)
        ) {
          menuState.breadcrumbOptions.push(option)
        }

        return
      }

      if (
        !menuState.menuTagOptions.some(
          ({ fullPath }) => fullPath === option.fullPath,
        )
      ) {
        menuState.menuTagOptions.push(option)
        cacheTags()
      }

      setBreadcrumbOptions(option.key)

      if (!menuState.breadcrumbOptions.length)
        menuState.breadcrumbOptions = [option]

      menuState.currentMenuOption = option

      if (menuState.menuKey !== option.key) {
        menuState.menuKey = option.key
        setStorage(APP_CATCH_KEY.appMenuKey, option.key)
      }
    }

    const changeMenuModelValue = (
      key: string | number,
      option: AppMenuOption,
      query?: LocationQuery,
    ) => {
      if (option.meta.windowOpen) {
        window.open(option.meta.windowOpen, '_blank', 'noopener,noreferrer')

        return
      }

      const path = String(key)

      if (route.fullPath === path && !query) updateActiveMenu(option)
      else return push({ path, query })
    }

    const optionForRoute = (path: string, matched: RouteRecordNormalized[]) => {
      const record = matched.at(-1)

      if (!record || record.path === '/' || record.redirect) return

      const canonicalPath = record.aliasOf?.path ?? record.path
      const menuOption = menuIndex.get(canonicalPath)?.option

      if (menuOption && !canonicalPath.includes(':')) return menuOption

      return resolveOption({
        ...(pick(
          record,
          pickRouteRecordNormalizedConstant,
        ) as unknown as AppMenuOption),
        fullPath: path,
      })
    }

    const setupAppMenu = async () => {
      const currentRole = signing.signingCallback.role ?? ''

      menuIndex.clear()

      const resolveRoutes = (
        routes: AppMenuOption[],
        parentPath: string,
      ): AppMenuOption[] => {
        const options: AppMenuOption[] = []

        for (const curr of routes) {
          if (!validRole(curr.meta, currentRole)) continue

          const fullPath = joinRoutePath(parentPath, curr.path)
          const children = curr.children?.length
            ? resolveRoutes(curr.children, fullPath)
            : void 0

          if (children && !children.length) continue

          const option = resolveOption({ ...curr, fullPath, children })

          menuIndex.set(fullPath, { option, parentPath })

          options.push(option)
        }

        return options
      }

      menuState.options = resolveRoutes(
        getAppRawRoutes() as AppMenuOption[],
        '',
      )
      menuState.currentMenuOption = null
      menuState.breadcrumbOptions = []

      const restoredTags = menuState.menuTagOptions.flatMap(({ fullPath }) => {
        if (typeof fullPath !== 'string' || !fullPath.startsWith('/')) return []

        const restored = resolve(fullPath)
        const record = restored.matched.at(-1)

        if (!record || !validRole(record.meta, currentRole)) return []

        const option = optionForRoute(restored.path, restored.matched)

        return option && !option.meta.sameLevel && !option.meta.windowOpen
          ? [option]
          : []
      })

      menuState.menuTagOptions = restoredTags
      cacheTags()

      const active = optionForRoute(route.path, route.matched)

      if (!active || active.meta.sameLevel) {
        const cached = menuIndex.get(String(menuState.menuKey))?.option
        const first =
          cached &&
          !cached.children &&
          cached.show !== false &&
          !cached.meta.windowOpen
            ? cached
            : canSkipRoute(menuState.options)

        if (first) updateActiveMenu(first as AppMenuOption)
      }

      if (active) updateActiveMenu(active)
    }

    /**
     *
     * @param collapsed 折叠菜单开关
     *
     * @description
     * 折叠菜单。
     */
    const collapsedMenu = (collapsed: boolean) =>
      (menuState.collapsed = collapsed)

    /**
     *
     * @param idx 当前关闭标签索引
     * @param length 裁剪标签页长度
     *
     * @returns 被关闭标签项
     *
     * @description
     * 关闭 menu tag 标签。
     */
    const spliceMenTagOptions = (idx: number, length = 1) => {
      const r = menuState.menuTagOptions.splice(idx, length)

      cacheTags()

      return r
    }

    watch(() => signing.signingCallback.role, setupAppMenu, { immediate: true })

    watch(
      () => route.path,
      (path) => {
        const option = optionForRoute(path, route.matched)

        if (option) updateActiveMenu(option)
      },
    )

    watch(
      () => menuState.currentMenuOption?.breadcrumbLabel,
      () => {
        if (menuState.currentMenuOption)
          updateDocumentTitle(menuState.currentMenuOption)
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
      setupAppMenu,
    }
  },
  {
    persist: {
      key: APP_CATCH_KEY.appPiniaMenuStore,
      storage: window.localStorage,
      pick: ['menuKey', 'collapsed'],
    },
  },
)
