import type { GlobalThemeOverrides } from 'naive-ui'
import type {
  Placement,
  LayoutSideBarLogo,
  AppKeepAlive,
  AppMenuConfig,
} from '@/types'

export interface WatermarkConfig {
  content: string
  fontSize: number
  lineHeight: number
  width: number
  height: number
  xOffset: number
  yOffset: number
  rotate: number
}

export interface AppRootRoute {
  name: string
  path: string
}

export interface SettingState {
  drawerPlacement: Placement
  primaryColorOverride: GlobalThemeOverrides
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
   * collapsedIconSize 配置菜单未折叠时图标的大小
   * collapsedIndent 配置菜单每级的缩进
   * accordion 手风琴模式
   */
  menuConfig: AppMenuConfig
}
