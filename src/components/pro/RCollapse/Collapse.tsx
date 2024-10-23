import { RCollapseGrid, RForm } from '@/components'

import formProps from '../../base/RForm/src/props'
import collapseGridProps from '../../base/RCollapseGrid/src/props'

import type { FormProps, GridProps } from 'naive-ui'

/**
 *
 * @description
 * 基于 RCollapseGrid 和 RForm 的折叠表单组件；
 * 同样也继承了 RCollapseGrid 组件的缺点，必须使用 NFormItemGi, NGridItem 组件包裹表单项。
 */
export default defineComponent({
  name: 'RCollapse',
  props: Object.assign({}, formProps, {
    ...collapseGridProps,
    open: {
      type: Boolean,
      default: true,
    },
    cols: {
      type: Number,
      default: 4,
    },
    bordered: {
      type: Boolean,
      default: true,
    },
  }),
  render() {
    const { $slots, $props } = this
    const { labelPlacement, showFeedback, ...rest } = $props as FormProps &
      GridProps

    return (
      <RForm {...rest} labelPlacement="top" showFeedback={false}>
        <RCollapseGrid {...rest}>{$slots}</RCollapseGrid>
      </RForm>
    )
  },
})
