import { modalProps } from 'naive-ui'
import type { PropType } from 'vue'

const props = {
  ...modalProps,
  /**
   *
   * @description
   * 是否记住上一次的位置。
   *
   * @default true
   */
  memo: {
    type: Boolean,
    default: true,
  },
  /**
   *
   * @description
   * 是否全屏。
   *
   * @default false
   */
  fullscreen: {
    type: Boolean,
    default: false,
  },
  /**
   *
   * @description
   * preset 为空时宽度设置。
   *
   * @default 600
   */
  width: {
    type: [String, Number] as PropType<string | number>,
    default: 600,
  },
  /**
   *
   * @description
   * preset 为 card 时宽度设置。
   *
   * @default 600
   */
  cardWidth: {
    type: [String, Number] as PropType<string | number>,
    default: 600,
  },
  /**
   *
   * @description
   * preset 为 dialog 时宽度设置。
   *
   * @default 446
   */
  dialogWidth: {
    type: [String, Number] as PropType<string | number>,
    default: 446,
  },
  /**
   *
   * @description
   * 是否启用拖拽。
   * 当启用拖拽时，可以通过拖拽 header 部分控制模态框。
   *
   * @default false
   */
  dad: {
    type: Boolean,
    default: false,
  },
}

export default props
