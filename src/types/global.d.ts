/* eslint-disable @typescript-eslint/no-explicit-any */
export {}

import type { AppConfig } from './modules/vite-custom-config'
import type {
  MessageApi,
  DialogApi,
  LoadingBarApi,
  NotificationApi,
} from 'naive-ui'
import type { NativeElements, ReservedProps, VNode } from 'vue'

export declare global {
  declare interface UnknownObjectKey {
    [propName: string]: any
  }

  namespace JSX {
    export interface Element extends VNode {}
    export interface ElementClass {
      $props: {}
    }
    export interface ElementAttributesProperty {
      $props: {}
    }
    export interface IntrinsicElements extends NativeElements {
      // allow arbitrary elements
      [name: string]: any
    }
    export interface IntrinsicAttributes extends ReservedProps {}
  }

  declare const __DEV__: boolean

  declare const __APP_CFG__: AppConfig

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

    DocsAPI?: any
    DocEditor?: any

    msCrypto: Crypto
  }
}
