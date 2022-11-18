export {}

declare global {
  export declare type lifecycle = (appWindow: Window) => unknown
  export declare type loadErrorHandler = (url: string, e: Error) => unknown

  export declare type baseOptions = {
    /** 唯一性用户必须保证 */
    name: string
    /** 需要渲染的url */
    url: string
    /** 代码替换钩子 */
    replace?: (code: string) => string
    /** 自定义fetch */
    fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>
    /** 注入给子应用的属性 */
    props?: { [key: string]: unknown }
    /** 自定义iframe属性 */
    attrs?: { [key: string]: unknown }
    /** 子应用采用fiber模式执行 */
    fiber?: boolean
    /** 子应用保活，state不会丢失 */
    alive?: boolean
    /** 子应用采用降级iframe方案 */
    degrade?: boolean
    /** 子应用插件 */
    plugins?: Array<plugin>
    /** 子应用生命周期 */
    beforeLoad?: lifecycle
    beforeMount?: lifecycle
    afterMount?: lifecycle
    beforeUnmount?: lifecycle
    afterUnmount?: lifecycle
    activated?: lifecycle
    deactivated?: lifecycle
    loadError?: loadErrorHandler
  }

  export declare type preOptions = baseOptions & {
    /** 预执行 */
    exec?: boolean
  }

  export declare type startOptions = baseOptions & {
    /** 渲染的容器 */
    el: HTMLElement | string
    /**
     * 路由同步开关
     * 如果false，子应用跳转主应用路由无变化，但是主应用的history还是会增加
     * https://html.spec.whatwg.org/multipage/history.html#the-history-interface
     */
    sync?: boolean
    /** 子应用短路径替换，路由同步时生效 */
    prefix?: { [key: string]: string }
    /** 子应用加载时loading元素 */
    loading?: HTMLElement
  }

  export declare type optionProperty = 'url' | 'el'

  /**
   * 合并 preOptions 和 startOptions，并且将 url 和 el 变成可选
   */
  export declare type cacheOptions = Omit<
    preOptions & startOptions,
    optionProperty
  > &
    Partial<Pick<startOptions, optionProperty>>

  export declare type startOption = {
    /** 唯一性用户必须保证 */
    name: string
    /** 需要渲染的url */
    url: string
    /** 渲染的容器 */
    el: HTMLElement | string
    /** 子应用加载时loading元素 */
    loading?: HTMLElement
    /** 路由同步开关， false刷新无效，但是前进后退依然有效 */
    sync?: boolean
    /** 子应用短路径替换，路由同步时生效 */
    prefix?: { [key: string]: string }
    /** 子应用保活模式，state不会丢失 */
    alive?: boolean
    /** 注入给子应用的数据 */
    props?: { [key: string]: unknown }
    /** js采用fiber模式执行 */
    fiber?: boolean
    /** 子应用采用降级iframe方案 */
    degrade?: boolean
    /** 自定义iframe属性 */
    attrs?: { [key: string]: unknown }
    /** 代码替换钩子 */
    replace?: (codeText: string) => string
    /** 自定义fetch，资源和接口 */
    fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>
    /** 子应插件 */
    plugins: Array<plugin>
    /** 子应用生命周期 */
    beforeLoad?: lifecycle
    /** 没有做生命周期改造的子应用不会调用 */
    beforeMount?: lifecycle
    afterMount?: lifecycle
    beforeUnmount?: lifecycle
    afterUnmount?: lifecycle
    /** 非保活应用不会调用 */
    activated?: lifecycle
    deactivated?: lifecycle
    /** 子应用资源加载失败后调用 */
    loadError?: loadErrorHandler
  }

  export declare type preOptions = {
    /** 唯一性用户必须保证 */
    name: string
    /** 需要渲染的url */
    url: string
    /** 注入给子应用的数据 */
    props?: { [key: string]: unknown }
    /** 自定义iframe属性 */
    attrs?: { [key: string]: unknown }
    /** 代码替换钩子 */
    replace?: (code: string) => string
    /** 自定义fetch，资源和接口 */
    fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>
    /** 子应用保活模式，state不会丢失 */
    alive?: boolean
    /** 预执行模式 */
    exec?: boolean
    /** js采用fiber模式执行 */
    fiber?: boolean
    /** 子应用采用降级iframe方案 */
    degrade?: boolean
    /** 子应插件 */
    plugins: Array<plugin>
    /** 子应用生命周期 */
    beforeLoad?: lifecycle
    /** 没有做生命周期改造的子应用不会调用 */
    beforeMount?: lifecycle
    afterMount?: lifecycle
    beforeUnmount?: lifecycle
    afterUnmount?: lifecycle
    /** 非保活应用不会调用 */
    activated?: lifecycle
    deactivated?: lifecycle
    /** 子应用资源加载失败后调用 */
    loadError?: loadErrorHandler
  }

  export declare class EventBus {
    private id
    private eventObj
    constructor(id: string)
    $on(event: string, fn: callback): EventBus
    /** 任何$emit都会导致监听函数触发，第一个参数为事件名，后续的参数为$emit的参数 */
    $onAll(fn: (event: string, ...args: Array<unknown>) => unknown): EventBus
    $once(event: string, fn: callback): void
    $off(event: string, fn: callback): EventBus
    $offAll(fn: callback): EventBus
    $emit(event: string, ...args: Array<unknown>): EventBus
    $clear(): EventBus
  }
}
