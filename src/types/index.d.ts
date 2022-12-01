export {}

import type CryptoJS from 'crypto-js'
import type {
  MessageApi,
  DialogApi,
  LoadingBarApi,
  NotificationApi,
  MenuOption,
  MenuDividerOption,
  MenuGroupOption,
} from 'naive-ui'
import type { ECharts } from 'echarts/core'

export global {
  const __APP_INFO__: {
    pkg: {
      name: string
      version: string
      dependencies: Recordable<string>
      devDependencies: Recordable<string>
    }
  }

  declare type NaiveMenuOptions =
    | MenuOption
    | MenuDividerOption
    | MenuGroupOption

  declare interface Window {
    // 是否存在无界
    __POWERED_BY_WUJIE__?: boolean
    // 子应用公共加载路径
    __WUJIE_PUBLIC_PATH__: string
    // 原生的 `querySelector`
    __WUJIE_RAW_DOCUMENT_QUERY_SELECTOR__: typeof Document.prototype.querySelector
    // 原生的 `querySelectorAll`
    __WUJIE_RAW_DOCUMENT_QUERY_SELECTOR_ALL__: typeof Document.prototype.querySelectorAll
    // 原生的 `window` 对象
    __WUJIE_RAW_WINDOW__: Window
    // 子应用沙盒实例
    __WUJIE: WuJie
    // 子应用mount函数
    __WUJIE_MOUNT: () => void
    // 子应用unmount函数
    __WUJIE_UNMOUNT: () => void
    // 注入对象
    $wujie: {
      bus: EventBus
      shadowRoot?: ShadowRoot
      props?: { [key: string]: unknown }
      location?: Object
    }

    $message: MessageApi
    $dialog: DialogApi
    $loadingBar: LoadingBarApi
    $notification: NotificationApi
  }

  declare interface IUnknownObjectKey {
    [propName: string]: unknown
  }

  declare type EventListenerOrEventListenerObject =
    | EventListener
    | EventListenerObject

  declare type ValidteValueType =
    | 'Number'
    | 'String'
    | 'Boolean'
    | 'Object'
    | 'Function'
    | 'Null'
    | 'Undefined'
    | 'Array'
    | 'Date'
    | 'Math'
    | 'RegExp'
    | 'Error'

  declare type WordArray = CryptoJS.lib.WordArray

  declare type CipherOption = CryptoJS.lib.CipherOption

  declare type CipherParams = CryptoJS.lib.CipherParams

  declare type VoidFunc = (...args: unknown[]) => void

  declare type NaiveDrawerPlacement = 'top' | 'right' | 'bottom' | 'left'

  declare type AnyFunc = (...args: unknown[]) => unknown

  declare type EChartsInstance = ECharts
}
