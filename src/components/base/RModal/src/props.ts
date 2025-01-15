import { modalProps } from 'naive-ui'
import type { PropType } from 'vue'

const props = {
  ...modalProps,
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
}

export default props
