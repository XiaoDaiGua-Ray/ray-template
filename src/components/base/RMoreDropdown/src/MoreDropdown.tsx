import { RIcon } from '@/components'
import { renderNode } from '@/utils'
import { NDropdown } from 'naive-ui'
import type { DropdownProps } from 'naive-ui'
import props from './props'

export default defineComponent({
  name: 'RMoreDropdown',
  props,
  render() {
    const { iconSize, cursor, icon } = this
    const { default: $default } = this.$slots

    return (
      <NDropdown
        {...(this.$props as DropdownProps)}
        {...this.$attrs}
        placement="bottom-start"
      >
        {renderNode($default, {
          defaultElement: <RIcon name={icon} size={iconSize} cursor={cursor} />,
        })}
      </NDropdown>
    )
  },
})
