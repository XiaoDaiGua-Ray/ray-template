/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-11-05
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { piniaMenuStore } from '../modules/menu'
import { useRootRoute } from '@/hooks/template'

export const useMenuGetters = () => {
  const variable = piniaMenuStore()

  /**
   *
   * @remark 获取菜单列表
   */
  const getMenuOptions = computed(() => variable.options)
  /**
   *
   * @remark 获取面包屑列表
   */
  const getBreadcrumbOptions = computed(() => variable.breadcrumbOptions)
  /**
   *
   * @remark 获取菜单当前 key
   */
  const getMenuKey = computed(() => variable.menuKey)
  /**
   *
   * @remark 获取菜单标签列表
   */
  const getMenuTagOptions = computed(() => {
    const { getRootPath } = useRootRoute()

    return variable.menuTagOptions.map((curr, _idx, currentArray) => {
      if (curr.key === getMenuKey.value && curr.key !== getRootPath.value) {
        curr.closeable = true
      } else {
        curr.closeable = false
      }

      if (curr.key === getRootPath.value) {
        curr.closeable = false
      }

      if (currentArray.length <= 1) {
        curr.closeable = false
      }

      return curr
    })
  })
  /**
   *
   * @remark 获取当前菜单项
   */
  const getCurrentMenuOption = computed(() => variable.currentMenuOption)
  /**
   *
   * @remark 获取是否折叠
   */
  const getCollapsed = computed(() => variable.collapsed)

  return {
    getMenuOptions,
    getBreadcrumbOptions,
    getMenuKey,
    getMenuTagOptions,
    getCurrentMenuOption,
    getCollapsed,
  }
}

export const useMenuActions = () => {
  const {
    changeMenuModelValue,
    setupAppMenu,
    collapsedMenu,
    spliceMenTagOptions,
    emptyMenuTagOptions,
    setMenuTagOptions,
  } = piniaMenuStore()

  return {
    changeMenuModelValue,
    setupAppMenu,
    collapsedMenu,
    spliceMenTagOptions,
    emptyMenuTagOptions,
    setMenuTagOptions,
  }
}
