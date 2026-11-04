import type { LayoutConfig, SettingState } from './types'

type OmitKeys =
  | 'layoutConfig'
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

export const LAYOUT_MODES = [
  'side',
  'top',
  'mixed',
  'right',
  'split',
] as const satisfies readonly LayoutConfig['mode'][]

// SettingDrawer 默认配置系统配置项
const defaultSettingConfig: Readonly<Config> = {
  layoutConfig: {
    mode: 'side',
    contentWidth: 'fluid',
    contentMaxWidth: 1200,
    contentPadding: 16,
    fixedHeader: true,
    fixedFooter: true,
  },
  // 切换过渡效果
  contentTransition: 'scale',
  // 水印开关
  watermarkSwitch: false,
  // 缓存动态设置
  keepAliveConfig: {
    maxKeepAliveLength: 10,
    setupKeepAlive: true,
    keepAliveExclude: [],
  },
  // 菜单配置
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
  // 多标签页开关
  menuTagSwitch: true,
  // 面包屑开关
  breadcrumbSwitch: true,
  // 底部区域开关
  copyrightSwitch: true,
  // 默认设置出现位置
  drawerPlacement: 'right',
  // 色弱模式
  colorWeakness: false,
  // 水印
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
  // 动态标题
  dynamicDocumentTitle: true,
}

/**
 *
 * @description
 * 获取默认配置。
 */
export const getDefaultSettingConfig = (): Readonly<Config> => {
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

export function normalizeLayoutConfig(value: unknown): LayoutConfig {
  const defaults = defaultSettingConfig.layoutConfig
  const config = value && typeof value === 'object' ? value : {}
  const source = config as Partial<LayoutConfig>
  const numberInRange = (
    value: unknown,
    fallback: number,
    min: number,
    max: number,
  ) =>
    typeof value === 'number' && Number.isFinite(value)
      ? Math.min(max, Math.max(min, value))
      : fallback

  return {
    mode: LAYOUT_MODES.find((mode) => mode === source.mode) ?? defaults.mode,
    contentWidth:
      source.contentWidth === 'fixed' || source.contentWidth === 'fluid'
        ? source.contentWidth
        : defaults.contentWidth,
    contentMaxWidth: numberInRange(
      source.contentMaxWidth,
      defaults.contentMaxWidth,
      640,
      2560,
    ),
    contentPadding: numberInRange(
      source.contentPadding,
      defaults.contentPadding,
      0,
      48,
    ),
    fixedHeader:
      typeof source.fixedHeader === 'boolean'
        ? source.fixedHeader
        : defaults.fixedHeader,
    fixedFooter:
      typeof source.fixedFooter === 'boolean'
        ? source.fixedFooter
        : defaults.fixedFooter,
  }
}
