import { piniaSettingStore } from '../modules/setting'

export const useSettingGetters = () => {
  const variable = piniaSettingStore()

  /**
   *
   * @description
   * 获取设置抽屉方向。
   */
  const getDrawerPlacement = computed(() => variable.drawerPlacement)
  /**
   *
   * @description
   * 获取 Naive UI 覆盖配置。
   */
  const getPrimaryColorOverride = computed(() => variable.primaryColorOverride)
  /**
   *
   * @description
   * 获取 app 主题。
   */
  const getAppTheme = computed(() => variable._appTheme)
  /**
   *
   * @description
   * 获取 app 主题。
   */
  const getAppThemeStr = computed(() => variable.appTheme)
  /**
   *
   * @description
   * 获取菜单标签开关。
   */
  const getMenuTagSwitch = computed(() => variable.menuTagSwitch)
  /**
   *
   * @description
   * 获取面包屑开关。
   */
  const getBreadcrumbSwitch = computed(() => variable.breadcrumbSwitch)
  /**
   *
   * @description
   * 获取 app 当前语言。
   */
  const getLocaleLanguage = computed(() => variable.localeLanguage)
  /**
   *
   * @description
   * 获取锁屏开关。
   */
  const getLockScreenSwitch = computed(() => variable.lockScreenSwitch)
  /**
   *
   * @description
   * 获取版权信息开关。
   */
  const getCopyrightSwitch = computed(() => variable.copyrightSwitch)
  /**
   *
   * @description
   * 获取 app 内容区域过渡动画效果。
   */
  const getContentTransition = computed(() => variable.contentTransition)
  /**
   *
   * @description
   * 获取水印开关。
   */
  const getWatermarkSwitch = computed(() => variable.watermarkSwitch)

  /**
   *
   * @description
   * 获取水印配置。
   */
  const getWatermarkConfig = computed(() => variable.watermarkConfig)

  /**
   *
   * @description
   * 获取 app 根路由。
   */
  const getAppRootRoute = computed(() => variable.appRootRoute)

  /**
   *
   * @description
   * 获取 side bar 配置。
   */
  const getSideBarLogo = computed(() => variable.sideBarLogo)

  /**
   *
   * @description
   * 获取缓存设置。
   */
  const getKeepAliveConfig = computed(() => variable.keepAliveConfig)

  /**
   *
   * @description
   * 获取菜单设置。
   */
  const getMenuConfig = computed(() => variable.menuConfig)

  /**
   *
   * @description
   * 获取是否启用色弱模式。
   */
  const getColorWeakness = computed(() => variable.colorWeakness)

  /**
   *
   * @description
   * 是否启用动态浏览器标题。
   */
  const getDynamicDocumentTitle = computed(() => variable.dynamicDocumentTitle)

  return {
    getDrawerPlacement,
    getPrimaryColorOverride,
    getAppTheme,
    getMenuTagSwitch,
    getBreadcrumbSwitch,
    getLocaleLanguage,
    getLockScreenSwitch,
    getCopyrightSwitch,
    getContentTransition,
    getWatermarkSwitch,
    getWatermarkConfig,
    getAppRootRoute,
    getSideBarLogo,
    getKeepAliveConfig,
    getMenuConfig,
    getAppThemeStr,
    getColorWeakness,
    getDynamicDocumentTitle,
  }
}

export const useSettingActions = () => {
  const {
    updateLocale,
    changePrimaryColor,
    updateSettingState,
    toggleColorWeakness,
  } = piniaSettingStore()

  return {
    updateLocale,
    changePrimaryColor,
    updateSettingState,
    toggleColorWeakness,
  }
}
