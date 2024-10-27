import type { SettingState } from '@/store/modules/setting/types'
import type { InjectionKey, Reactive } from 'vue'
import type { DebouncedFunc } from 'lodash-es'

type OmitKeys =
  | 'contentTransition'
  | 'watermarkSwitch'
  | 'keepAliveConfig'
  | 'menuConfig'
  | 'menuTagSwitch'
  | 'breadcrumbSwitch'
  | 'copyrightSwitch'
  | 'drawerPlacement'
  | 'colorWeakness'
  | 'watermarkConfig'
  | 'dynamicDocumentTitle'

interface Config extends Pick<SettingState, OmitKeys> {}

// SettingDrawer 默认配置系统配置项
const defaultSettingConfig: Readonly<Partial<Config>> = {
  contentTransition: 'scale',
  watermarkSwitch: false,
  keepAliveConfig: {
    maxKeepAliveLength: 10,
    setupKeepAlive: true,
    keepAliveExclude: [],
  },
  menuConfig: {
    collapsedWidth: 64,
    collapsedMode: 'width',
    collapsedIconSize: 16,
    collapsedIndent: 24,
    accordion: false,
    menuSiderBarLogo: true,
    iconSize: 16,
    menuWidth: 272,
    inverted: false,
    nativeScrollbar: false,
  },
  menuTagSwitch: true,
  breadcrumbSwitch: true,
  copyrightSwitch: true,
  drawerPlacement: 'right',
  colorWeakness: false,
  watermarkConfig: {
    content: 'Trying be better~',
    fontSize: 16,
    lineHeight: 16,
    width: 384,
    height: 384,
    xOffset: 12,
    yOffset: 60,
    rotate: -15,
    xGap: 0,
    yGap: 0,
    cross: true,
  },
  dynamicDocumentTitle: true,
}

/**
 *
 * @description
 * 获取默认配置。
 */
export const getDefaultSettingConfig = (): Partial<Config> => {
  return defaultSettingConfig
}

/**
 *
 * @param config 配置项
 *
 * @description
 * 更新默认配置。
 */
export const updateDefaultSettingConfig = (config: Partial<SettingState>) => {
  Object.assign(defaultSettingConfig, config)
}

interface SettingDrawerInjectKey extends SettingState {
  throttleSetupAppMenu: DebouncedFunc<() => Promise<void>>
}

export const SETTING_DRAWER_INJECT_KEY: Reactive<
  InjectionKey<Partial<SettingDrawerInjectKey>>
> = Symbol('segmentDrawer')
