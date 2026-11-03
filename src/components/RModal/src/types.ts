import type { ModalOptions as NaiveModalOptions } from 'naive-ui'

export interface RModalProps extends NaiveModalOptions {
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
}
