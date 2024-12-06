import { gridProps } from 'naive-ui'

import type { PropType } from 'vue'
import type { CollapseToggleText, ActionAlignType } from './types'
import type { AnyFC, MaybeArray } from '@/types'

const props = {
  /**
   *
   * @description
   * 操作区域列数。
   *
   * @default 1
   */
  actionSpan: {
    type: Number,
    default: 1,
  },
  /**
   *
   * @description
   * 自定义操作按钮区域按钮列排列方式。
   *
   * @default end
   */
  actionAlign: {
    type: String as PropType<ActionAlignType>,
    default: 'end',
  },
  open: {
    /**
     *
     * 是否折叠操作栏
     *
     * 默认折叠
     *
     * `true` 收起, `false` 展开
     */
    type: Boolean,
    default: false,
  },
  collapseToggleText: {
    /**
     *
     * 自定义展开与收起文案
     *
     * 默认 `['展开', '收起']`
     *
     * 索引第一位为展开时显示内容, 所以第二位置为收起时显示内容
     */
    type: Array as unknown as PropType<CollapseToggleText>,
    default: () => ['展开', '收起'],
  },
  bordered: {
    /**
     *
     * 卡片边框
     *
     * 默认 `false`
     */
    type: Boolean,
    default: true,
  },
  onUpdateOpen: {
    type: [Function, Array] as PropType<MaybeArray<(bool: boolean) => void>>,
    default: null,
  },
  'onUpdate:open': {
    type: [Function, Array] as PropType<MaybeArray<(bool: boolean) => void>>,
    default: null,
  },
  ...gridProps,
} as const

export default props
