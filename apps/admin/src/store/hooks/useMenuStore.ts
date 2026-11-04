import { piniaMenuStore } from '../modules/menu'

export const useMenuGetters = () => {
  const variable = piniaMenuStore()

  /**
   *
   * @description
   * 获取菜单列表。
   */
  const getMenuOptions = computed(() => variable.options)

  /**
   *
   * @description
   * 获取面包屑列表。
   */
  const getBreadcrumbOptions = computed(() => variable.breadcrumbOptions)

  /**
   *
   * @description
   * 获取菜单当前 key。
   */
  const getMenuKey = computed(() => variable.menuKey)

  /**
   *
   * @description
   * 获取菜单标签列表。
   */
  const getMenuTagOptions = computed(() => {
    return variable.menuTagOptions
  })

  /**
   *
   * @description
   * 获取当前菜单项。
   */
  const getCurrentMenuOption = computed(() => variable.currentMenuOption)

  /**
   *
   * @description
   * 获取是否折叠。
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
    collapsedMenu,
    spliceMenTagOptions,
    setMenuTagOptions,
    resolveOption,
    updateMenuState,
    setupAppMenu,
  } = piniaMenuStore()

  return {
    changeMenuModelValue,
    collapsedMenu,
    spliceMenTagOptions,
    setMenuTagOptions,
    resolveOption,
    updateMenuState,
    setupAppMenu,
  }
}
