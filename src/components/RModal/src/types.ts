import type { ModalOptions as NaiveModalOptions } from 'naive-ui'

export interface RModalProps extends NaiveModalOptions {
  /**
   *
   * @description
   * 是否记住上一次的位置。
   *
   * @default true
   */
  memo?: boolean
  /**
   *
   * @description
   * 是否全屏。
   *
   * @default false
   */
  fullscreen?: boolean
  /**
   *
   * @description
   * preset 为空时宽度设置。
   *
   * @default 600
   */
  width?: number | string
  /**
   *
   * @description
   * preset 为 card 时宽度设置。
   *
   * @default 600
   */
  cardWidth?: number | string
  /**
   *
   * @description
   * preset 为 dialog 时宽度设置。
   *
   * @default 446
   */
  dialogWidth?: number | string
  /**
   *
   * @description
   * 是否启用拖拽。
   * 当启用拖拽时，可以通过拖拽 header 部分控制模态框。
   *
   * @default false
   */
  dad?: boolean
}
