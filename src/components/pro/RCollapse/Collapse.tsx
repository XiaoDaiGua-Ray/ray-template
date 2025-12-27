import { RCollapseGrid, RForm } from '@/components'
import type { GridProps } from 'naive-ui'
import collapseGridProps from '../../base/RCollapseGrid/src/props'
import formProps from '../../base/RForm/src/props'

export const collapseProps = Object.assign({}, formProps, {
  ...collapseGridProps,
  open: {
    type: Boolean,
    default: true,
  },
  cols: {
    type: [Number, String] as PropType<GridProps['cols']>,
    default: '4 xs:1 s:2 m:2 l:4 xl:4 2xl:6',
  },
  bordered: {
    type: Boolean,
    default: true,
  },
  responsive: {
    type: String as PropType<GridProps['responsive']>,
    default: 'screen',
  },
})

/**
 *
 * @description
 * 基于 RCollapseGrid 和 RForm 的折叠表单组件；
 * 同样也继承了 RCollapseGrid 组件的缺点，必须使用 NFormItemGi, NGridItem 组件包裹表单项。
 */
export default defineComponent({
  name: 'RCollapse',
  props: collapseProps,
  render() {
    const { $slots, $props } = this
    const { labelPlacement, showFeedback, ...rest } = $props

    return (
      <RForm {...rest} labelPlacement="top" showFeedback={false}>
        <RCollapseGrid {...rest}>{$slots}</RCollapseGrid>
      </RForm>
    )
  },
})
