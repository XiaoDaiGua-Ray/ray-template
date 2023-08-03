import { gridProps } from 'naive-ui'

import type { PropType } from 'vue'
import type { CollapseToggleText } from './type'
import type { AnyFC, MaybeArray } from '@/types/modules/utils'

export const collapseGridProps = {
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
    default: false,
  },
  onUpdateValue: {
    type: [Function, Array] as PropType<MaybeArray<(bool: boolean) => void>>,
    default: null,
  },
  'onUpdate:value': {
    type: [Function, Array] as PropType<MaybeArray<(bool: boolean) => void>>,
    default: null,
  },
  ...gridProps,
} as const

/**
 *
 * 基于 `NGird` 实现
 *
 * 继承该组件所有属性和方法, <https://www.naiveui.com/zh-CN/dark/components/grid>
 *
 * `xGap` 默认 `12`
 *
 * `yGap` 默认 `18`
 */
