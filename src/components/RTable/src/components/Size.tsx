/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-10-04
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { NPopover, NCard, NPopselect } from 'naive-ui'
import RIcon from '@/components/RIcon/index'

import { call } from '@/utils/vue/index'
import props from '../props'
import config from '../config'

import type { ComponentSize } from '@/types/modules/component'
import type { MaybeArray } from '@/types/modules/utils'

export default defineComponent({
  name: 'TableSizeSelect',
  props: {
    onChangeSize: {
      type: [Function, Array] as PropType<
        MaybeArray<(size: ComponentSize) => void>
      >,
      default: null,
    },
    ...props,
  },
  setup(props) {
    const popoverShow = ref(false)
    const size = ref(props.size)
    const sizeOptions = [
      {
        label: '默认',
        value: 'medium',
      },
      {
        label: '紧凑',
        value: 'small',
      },
      {
        label: '宽松',
        value: 'large',
      },
    ]

    const updatePopselectValue = (value: string | number) => {
      const { onChangeSize } = props

      if (onChangeSize) {
        call(onChangeSize, value as ComponentSize)
      }
    }

    return {
      size,
      sizeOptions,
      popoverShow,
      updatePopselectValue,
    }
  },
  render() {
    return (
      <NPopselect
        v-model:value={this.size}
        options={this.sizeOptions}
        trigger="click"
        onUpdateValue={this.updatePopselectValue.bind(this)}
      >
        <NPopover showArrow={false}>
          {{
            trigger: () => (
              <RIcon
                name="adjustment"
                size={config.tableIconSize}
                cursor="pointer"
              />
            ),
            default: () => '密度',
          }}
        </NPopover>
      </NPopselect>
    )
  },
})
