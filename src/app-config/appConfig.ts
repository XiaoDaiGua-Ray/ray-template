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

import type { LayoutSideBarLogo, PreloadingConfig } from '@/types'
import type { AppMenuConfig, AppKeepAlive } from '@/types'

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
 * 系统缓存 key 前缀
 * 可以选择自定义缓存 key 前缀，在使用 getStorage 和 setStorage 时可以考虑是否启用前缀的方式来避免缓存 key 冲突
 * 该配置项也可以结合 APP_CATCH_KEY 使用
 *
 * 值得注意的是，该方法整合进了 cache.ts 方法包中。也就是说只要该配置项不为空字符串则会自动启用缓存前缀
 *
 * 默认不启用
 *
 * @example
 * export const APP_CATCH_KEY_PREFIX = 'ray-template:'
 *
 * 'ray-template:signing' // 会自动拼接为
 */
export const APP_CATCH_KEY_PREFIX = ''

/**
 *
 * 系统默认缓存 key 配置
 *
 * 说明:
 *   - signing: 登陆信息缓存 key
 *   - localeLanguage: 国际化默认缓存 key
 *   - token: token key
 *   - appMenuKey: 菜单缓存 key
 *   - appPiniaSettingStore: pinia setting store key
 *   - appPiniaKeepAliveStore: pinia keep alive store key
 *   - appPiniaMenuStore: pinia menu store key
 *   - appPiniaSigningStore: pinia signing store key
 *   - appVersionProvider: 版本信息缓存 key
 */
export const APP_CATCH_KEY = {
  signing: 'signing',
  localeLanguage: 'localeLanguage',
  token: 'token',
  appMenuKey: 'menuKey',
  appPiniaSettingStore: 'piniaSettingStore',
  appPiniaKeepAliveStore: 'piniaKeepAliveStore',
  appPiniaMenuStore: 'piniaMenuStore',
  appPiniaSigningStore: 'piniaSigningStore',
  appVersionProvider: 'appVersionProvider',
  isAppLockScreen: 'isAppLockScreen',
  appGlobalSearchOptions: 'appGlobalSearchOptions',
} as const

/**
 *
 * 系统内容切换动画配置
 * 但是在配置的时候，会自动拼接一个 `transform` 前缀
 * 例如: `transform-fade-bottom`
 */
export const CONTENT_TRANSITION_OPTIONS = [
  {
    label: '无',
    value: 'none',
  },
  {
    label: '缩放出现',
    value: 'scale',
  },
  {
    label: '缩放消退',
    value: 'fade-scale',
  },
  {
    label: '滑入出现',
    value: 'fade-slide',
  },
  {
    label: '淡入消退',
    value: 'opacity',
  },
  {
    label: '底部消退',
    value: 'fade-bottom',
  },
]
