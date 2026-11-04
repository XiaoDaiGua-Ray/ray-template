export interface RippleOptions {
  class?: string
  center?: boolean
  circle?: boolean
}

export type RippleValue =
  | boolean
  | {
      class: string
    }

export interface Ripple {
  /**
   *
   * @description
   * 是否启用水波纹效果。
   */
  enabled?: boolean
  /**
   *
   * @description
   * 是否从中点开始扩散。
   */
  centered?: boolean
  /**
   *
   * @description
   * 是否为圆形水波纹。
   */
  circle?: boolean
  /**
   *
   * @description
   * 自定义水波纹类名。
   */
  class?: string
  /**
   *
   * @description
   * 是否点击触发。
   */
  touched?: boolean
}

export interface RippleElement extends HTMLElement {
  __d_ripple__?: Ripple
}

export interface RippleModifiers {
  center?: boolean
  circle?: boolean
}

export interface RippleBindingValue {
  value?: RippleValue
  modifiers: RippleModifiers
}
