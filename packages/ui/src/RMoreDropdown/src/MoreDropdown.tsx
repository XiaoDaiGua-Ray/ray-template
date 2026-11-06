import { renderNode } from '@ray-template/composables/vue'
import { NButton, NDropdown } from 'naive-ui'
import type { DropdownProps } from 'naive-ui'
import { defineComponent } from 'vue'
import { RIcon } from '../../RIcon'
import { useUiServices } from '../../services'
import props from './props'

export default defineComponent({
  name: 'RMoreDropdown',
  props,
  setup() {
    return { translate: useUiServices().translate }
  },
  render() {
    const { iconSize, cursor, icon } = this
    const { default: $default } = this.$slots

    return (
      <NDropdown {...(this.$props as DropdownProps)} {...this.$attrs}>
        {renderNode($default, {
          defaultElement: (
            <NButton
              text
              aria-label={
                this.triggerLabel ??
                this.translate?.('appComponents.moreActions') ??
                'More actions'
              }
            >
              <RIcon name={icon} size={iconSize} cursor={cursor} />
            </NButton>
          ),
        })}
      </NDropdown>
    )
  },
})
