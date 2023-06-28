/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-05-23
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/** 系统配置 */

import type {
  LayoutSideBarLogo,
  PreloadingConfig,
  RootRoute,
} from '@/types/modules/cfg'
import type {
  MenuCollapsedConfig,
  AppKeepAlive,
} from '@/types/modules/appConfig'

/**
 *
 * 系统缓存
 *
 * 说明:
 *   - setupKeepAlive: 是否启用系统页面缓存, 设置为 false 则关闭系统页面缓存
 *   - keepAliveExclude: 排除哪些页面不缓存
 *   - maxKeepAliveLength: 最大缓存页面数量
 */
export const APP_KEEP_ALIVE: Readonly<AppKeepAlive> = {
  setupKeepAlive: true,
  keepAliveExclude: [],
  maxKeepAliveLength: 5,
}

/** 首屏加载信息配置 */
export const PRE_LOADING_CONFIG: PreloadingConfig = {
  title: 'Ray Template',
  tagColor: '#ff6700',
  titleColor: '#2d8cf0',
}

/**
 *
 * 配置根页面
 * 该项目所有重定向至首页, 都依赖该配置项
 *
 * 如果修改了该项目的首页路由配置, 需要更改该配置项, 以免重定向首页操作出现错误
 */
export const ROOT_ROUTE: Readonly<RootRoute> = {
  name: 'Dashboard',
  path: '/dashboard',
}

/**
 *
 * icon: LOGO 图标, 依赖 `RayIcon` 实现(如果为空则不会渲染图标)
 * title: LOGO 标题
 * url: 点击跳转地址, 如果不配置该属性, 则不会触发跳转
 * jumpType: 跳转类型(station: 项目内跳转, outsideStation: 新页面打开)
 *
 * 如果不设置该属性或者为空, 则不会渲染 LOGO
 */
export const SIDE_BAR_LOGO: LayoutSideBarLogo = {
  icon: 'ray',
  title: 'Ray Template',
  url: '/dashboard',
  jumpType: 'station',
}

/**
 *
 * 系统菜单折叠配置
 *
 * MENU_COLLAPSED_WIDTH 配置仅当 MENU_COLLAPSED_MODE 为 width 风格时才有效
 *
 * MENU_COLLAPSED_MODE:
 *   - transform: 边栏将只会移动它的位置而不会改变宽度
 *   - width: Sider 的内容宽度将会被实际改变
 *
 * MENU_COLLAPSED_ICON_SIZE 配置菜单未折叠时图标的大小
 *
 * MENU_COLLAPSED_INDENT 配置菜单每级的缩进
 */
export const MENU_COLLAPSED_CONFIG: Readonly<MenuCollapsedConfig> = {
  MENU_COLLAPSED_WIDTH: 64,
  MENU_COLLAPSED_MODE: 'width',
  MENU_COLLAPSED_ICON_SIZE: 22,
  MENU_COLLAPSED_INDENT: 24,
}

/** 是否启用菜单手风琴模式 */
export const MENU_ACCORDION = false

/**
 *
 * 系统默认缓存 key 配置
 * 仅暴露部分系统获取缓存配置, 其余 key 暂不开放
 *
 * 说明:
 *   - signin: 登陆信息缓存 key
 *   - localeLanguage: 国际化默认缓存 key
 *   - token: token key
 */
export const APP_CATCH_KEY = {
  signin: 'signin',
  localeLanguage: 'localeLanguage',
  token: 'token',
} as const
