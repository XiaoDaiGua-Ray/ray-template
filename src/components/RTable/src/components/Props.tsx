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

import { NPopselect } from 'naive-ui'
import { RIcon } from '@/components'

import { call } from '@/utils'
import { config, propsOptions } from '../shared'
import props from '../props'

import type { MaybeArray } from '@/types'
import type { PropsComponentPopselectKeys } from '../types'

export default defineComponent({
  name: 'TablePropsSelect',
  props: {
    ...props,
    onPopselectChange: {
      type: [Function, Array] as PropType<
        MaybeArray<(size: PropsComponentPopselectKeys[]) => void>
      >,
      default: null,
    },
    onInitialed: {
      type: [Function, Array] as PropType<
        MaybeArray<(size: PropsComponentPopselectKeys[]) => void>
      >,
      default: null,
    },
  },
  setup(props) {
    const popoverShow = ref(false)
    const propsPopselectValue = ref<PropsComponentPopselectKeys[]>([])

    const updatePopselectValue = (value: PropsComponentPopselectKeys[]) => {
      const { onPopselectChange } = props

      if (onPopselectChange) {
        call(onPopselectChange, value)
      }
    }

    const initialPopselectValue = () => {
      const { striped, bordered, onInitialed } = props

      if (striped) {
        propsPopselectValue.value.push('striped')
      }

      if (bordered) {
        propsPopselectValue.value.push('bordered')
      }

      if (onInitialed) {
        call(onInitialed, propsPopselectValue.value)
      }
    }

    initialPopselectValue()

    return {
      propsPopselectValue,
      popoverShow,
      updatePopselectValue,
    }
  },
  render() {
    return (
      <NPopselect
        v-model:value={this.propsPopselectValue}
        options={propsOptions}
        trigger="click"
        multiple
        onUpdateValue={this.updatePopselectValue.bind(this)}
      >
        <RIcon
          name="expanded"
          size={config.tableIconSize}
          cursor="pointer"
          style="transform: rotate(270deg);"
        />
      </NPopselect>
    )
  },
})
