import type {
  AppKeepAlive,
  AppMenuConfig,
  LayoutSideBarLogo,
  Placement,
} from '@/types'
import type { LayoutConfig } from '@ray-template/admin-shell'
import type { ThemeStyle } from '@ray-template/ui/theme-presets'
import type { GlobalThemeOverrides } from 'naive-ui'

export interface WatermarkConfig {
  content: string
  fontSize: number
  lineHeight: number
  width: number
  height: number
  xOffset: number
  yOffset: number
  xGap: number
  yGap: number
  rotate: number
  cross: boolean
}

export interface AppRootRoute {
  name: string
  path: string
}

export type { LayoutConfig }

export interface SettingState {
  layoutConfig: LayoutConfig
  drawerPlacement: Placement
  primaryColorOverride: GlobalThemeOverrides
  themeStyle: ThemeStyle
  appTheme: 'dark' | 'light' | 'auto'
  _appTheme: boolean
  menuTagSwitch: boolean
  breadcrumbSwitch: boolean
  localeLanguage: string
  lockScreenSwitch: boolean
  watermarkSwitch: boolean
  copyrightSwitch: boolean
  contentTransition: string
  watermarkConfig: WatermarkConfig
  /** 历史兼容偏好，不参与默认导航或标签保护。 */
  appRootRoute: AppRootRoute
  /**
   *
   * @description
   * icon: LOGO 图标， 依赖 `RIcon` 实现(如果为空则不会渲染图标)；4.8.2 版本后支持 VNode。
   * title: LOGO 标题。
   * url: 点击跳转地址， 如果不配置该属性， 则不会触发跳转。
   * jumpType: 跳转类型(station: 项目内跳转， outsideStation: 新页面打开)。
   *
   * 如果不设置该属性或者为空， 则不会渲染 LOGO。
   */
  sideBarLogo: LayoutSideBarLogo | undefined
  /**
   *
   * @description
   * setupKeepAlive: 是否启用系统页面缓存，设置为 false 则关闭系统页面缓存。
   * keepAliveExclude: 排除哪些页面不缓存。
   * maxKeepAliveLength: 最大缓存页面数量。
   */
  keepAliveConfig: AppKeepAlive
  /**
   *
   * @description
   * 系统菜单折叠配置
   *
   * collapsedWidth 配置仅当 collapsedMode 为 width 风格时才有效。
   *
   * collapsedMode:
   *   - transform: 边栏将只会移动它的位置而不会改变宽度
   *   - width: Sider 的内容宽度将会被实际改变
   * iconSize 配置展开和顶部菜单的图标尺寸；collapsedIconSize 配置折叠侧栏的图标尺寸
   * collapsedIndent 配置菜单每级的缩进
   * accordion 手风琴模式
   */
  menuConfig: AppMenuConfig
  colorWeakness: boolean
  /**
   *
   * @description
   * 动态浏览器标题。
   * 如果设置为 true，会在更新菜单时，自动取用当前菜单的标题作为浏览器标题。
   */
  dynamicDocumentTitle: boolean
}
