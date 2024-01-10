/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-11-06
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { piniaSettingStore } from '../modules/setting'

export const useSettingGetters = () => {
  const variable = piniaSettingStore()

  /**
   *
   * @remark 获取设置抽屉方向
   */
  const getDrawerPlacement = computed(() => variable.drawerPlacement)
  /**
   *
   * @remark 获取 Naive UI 覆盖配置
   */
  const getPrimaryColorOverride = computed(() => variable.primaryColorOverride)
  /**
   *
   * @remark 获取 app 主题
   */
  const getAppTheme = computed(() => variable.appTheme)
  /**
   *
   * @remark 获取菜单标签开关
   */
  const getMenuTagSwitch = computed(() => variable.menuTagSwitch)
  /**
   *
   * @remark 获取面包屑开关
   */
  const getBreadcrumbSwitch = computed(() => variable.breadcrumbSwitch)
  /**
   *
   * @remark 获取 app 当前语言
   */
  const getLocaleLanguage = computed(() => variable.localeLanguage)
  /**
   *
   * @remark 获取锁屏开关
   */
  const getLockScreenSwitch = computed(() => variable.lockScreenSwitch)
  /**
   *
   * @remark 获取版权信息开关
   */
  const getCopyrightSwitch = computed(() => variable.copyrightSwitch)
  /**
   *
   * @remark 获取 app 内容区域过渡动画效果
   */
  const getContentTransition = computed(() => variable.contentTransition)
  /**
   *
   * @remark 获取水印开关
   */
  const getWatermarkSwitch = computed(() => variable.watermarkSwitch)

  /**
   *
   * @remark 获取水印配置
   */
  const getWatermarkConfig = computed(() => variable.watermarkConfig)

  /**
   *
   * @remark 获取 app 根路由
   */
  const getAppRootRoute = computed(() => variable.appRootRoute)

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
  }
}

export const useSettingActions = () => {
  const { updateLocale, changePrimaryColor, updateSettingState } =
    piniaSettingStore()

  return {
    updateLocale,
    changePrimaryColor,
    updateSettingState,
  }
}
