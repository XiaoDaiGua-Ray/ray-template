export interface RIframeInst {
  /** 组件 ref 自动解包后的原生 iframe，挂载前或卸载后为 null */
  readonly iframe: HTMLIFrameElement | null
  /** 保留已有运行时名称，与 iframe 指向同一元素 */
  readonly iframeInst: HTMLIFrameElement | null
}

export type Lazy = 'lazy' | 'eager' | undefined
