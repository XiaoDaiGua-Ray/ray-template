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
import type { AppMenuConfig, AppKeepAlive } from '@/types/modules/appConfig'

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

/**
 *
 * 首屏加载信息配置
 * 其中 title 属性会是默认的浏览器标题（初始化时）
 */
export const PRE_LOADING_CONFIG: PreloadingConfig = {
  title: 'Ray Template',
  tagColor: '#ff6700',
  titleColor: '#2d8cf0',
}

/**
 *
 * 配置根路由信息
 * 模板维护一个根路由 ROOT_ROUTE，所有的重定向操作、回到 Layout Root Path 操作都依赖该 path
 *
 * 该变量的值，会传递给 globalRootRoute
 * 这么做也是为了能够在兼容老版本的模板，并且也是为了能够动态的维护根路由信息
 *
 * 有些时候，如果你希望动态的维护 Root Route 信息，可以使用 useAppRoot 方法
 */
export const ROOT_ROUTE: RootRoute = {
  name: 'Dashboard',
  path: '/dashboard',
}

/**
 *
 * icon: LOGO 图标, 依赖 `RIcon` 实现(如果为空则不会渲染图标)
 * title: LOGO 标题
 * url: 点击跳转地址, 如果不配置该属性, 则不会触发跳转
 * jumpType: 跳转类型(station: 项目内跳转, outsideStation: 新页面打开)
 *
 * 如果不设置该属性或者为空, 则不会渲染 LOGO
 */
export const SIDE_BAR_LOGO: LayoutSideBarLogo | undefined = {
  icon: 'ray',
  title: 'Ray Template',
  url: '/dashboard',
  jumpType: 'station',
}

/**
 *
 * 系统菜单折叠配置
 *
 * menuCollapsedWidth 配置仅当 menuCollapsedMode 为 width 风格时才有效
 *
 * menuCollapsedMode:
 *   - transform: 边栏将只会移动它的位置而不会改变宽度
 *   - width: Sider 的内容宽度将会被实际改变
 * menuCollapsedIconSize 配置菜单未折叠时图标的大小
 * menuCollapsedIndent 配置菜单每级的缩进
 * menuAccordion 手风琴模式
 */
export const APP_MENU_CONFIG: Readonly<AppMenuConfig> = {
  menuCollapsedWidth: 64,
  menuCollapsedMode: 'width',
  menuCollapsedIconSize: 22,
  menuCollapsedIndent: 24,
  menuAccordion: false,
}

/**
 *
 * 系统默认缓存 key 配置
 * 仅暴露部分系统获取缓存配置, 其余 key 暂不开放
 *
 * 说明:
 *   - signing: 登陆信息缓存 key
 *   - localeLanguage: 国际化默认缓存 key
 *   - token: token key
 */
export const APP_CATCH_KEY = {
  signing: 'signing',
  localeLanguage: 'localeLanguage',
  token: 'token',
} as const

/**
 *
 * 系统水印配置
 * 具体配置信息查看官网: https://www.naiveui.com/zh-CN/dark/components/watermark#API
 */
export const APP_WATERMARK_CONFIG = {
  content: 'Tring be better~',
  fontSize: 16,
  lineHeight: 16,
  width: 384,
  height: 384,
  xOffset: 12,
  yOffset: 60,
  rotate: -15,
} as const
