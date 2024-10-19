import type { PropType } from 'vue'
import type { MaybeArray } from '@/types'

const props = {
  color: {
    type: String,
    default: 'currentColor',
  },
  prefix: {
    type: String,
    default: 'icon',
  },
  name: {
    type: String,
    required: true,
  },
  size: {
    type: [Number, String],
    default: 14,
  },
  width: {
    type: [Number, String],
    default: 0,
  },
  height: {
    type: [Number, String],
    default: 0,
  },
  customClassName: {
    /** 自定义 class name */
    type: String,
    default: null,
  },
  depth: {
    /** 图标深度 */
    type: Number,
    default: 1,
  },
  cursor: {
    /** 鼠标指针样式 */
    type: String,
    default: 'default',
  },
  onClick: {
    type: [Function, Array] as PropType<MaybeArray<(e: MouseEvent) => void>>,
    default: null,
  },
}

export default props
