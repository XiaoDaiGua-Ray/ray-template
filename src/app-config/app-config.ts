import type { AppMenuConfig, PreloadingConfig } from '@/types'
import type { MessageProviderProps } from 'naive-ui'

/**
 *
 * @description
 * 配置 MessageProver 组件。
 * 该配置项会影响到全局 Message 组件的默认配置。
 *
 * @see https://www.naiveui.com/zh-CN/dark/components/message#MessageProvider-Props
 */
export const MESSAGE_PROVIDER: MessageProviderProps = {
  max: 5,
  closable: false,
}

/**
 *
 * @description
 * 是否启用路由切换 spin 加载；
 * 如果启用该配置项，则会在路由更新时触发内容区域的加载状态，直到路由加载完成。
 *
 * 在 v4.7.5 版本后，默认关闭了该配置项。
 */
export const LAYOUT_CONTENT_SPIN_WHEN_ROUTE_CHANGE = false

/**
 *
 * @description
 * 全局 Spin 加载内容。
 */
export const APP_GLOBAL_LOADING = 'loading'

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
 * @description
 * 系统缓存 key 前缀。
 * 可以选择自定义缓存 key 前缀，在使用 getStorage 和 setStorage 时可以考虑是否启用前缀的方式来避免缓存 key 冲突。
 * 该配置项也可以结合 APP_CATCH_KEY 使用。
 *
 * 值得注意的是，该方法整合进了 cache.ts 方法包中。也就是说只要该配置项不为空字符串则会自动启用缓存前缀。
 *
 * 默认不启用。
 *
 * @example
 * export const APP_CATCH_KEY_PREFIX = 'ray-template:'
 *
 * 转换后的缓存 key: ray-template:signing。
 */
export const APP_CATCH_KEY_PREFIX = ''

/**
 *
 * @description
 * 系统默认缓存 key 配置。
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
 * @description
 * 系统内容切换动画配置。
 * 但是在配置的时候，会自动拼接一个 transform 前缀。
 * 例如: transform-fade-bottom。
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
