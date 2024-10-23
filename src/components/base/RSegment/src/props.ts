import { tabsProps } from 'naive-ui'
import { omit } from 'lodash-es'
import { OMIT_TABS_PROPS_KEYS } from './constant'

import type { RSegmentOptions, RSegmentWidth } from './types'
import type { PropType } from 'vue'

/**
 *
 * @description
 * 为了避免 vue props 类型推导错误，需要在这里做一次 omit 操作。
 * 属于是一种无奈之举。
 */
const segmentProps = omit(
  {
    ...tabsProps,
    options: {
      type: Array as PropType<RSegmentOptions[]>,
      default: () => [],
    },
    width: {
      type: [Number, String] as PropType<RSegmentWidth>,
      default: 'fitContent',
    },
  },
  ...OMIT_TABS_PROPS_KEYS,
)

export default segmentProps
