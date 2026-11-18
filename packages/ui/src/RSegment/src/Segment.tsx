import { computed, defineComponent, ref } from 'vue'
import './index.scss'
import {
  completeSize,
  navigateHorizontalChoice,
} from '@ray-template/composables/element'
import { isValueType } from '@ray-template/utils'
import { NFlex, NPopover, NTab, NTabs } from 'naive-ui'
import type { TabsProps } from 'naive-ui'
import { themeOverrides } from './constant'
import props from './props'
import type { RSegmentOptions } from './types'

const iconSegmentTab = (option: RSegmentOptions) => {
  const { icon, label } = option
  const content = typeof label === 'function' ? label() : label

  if (icon) {
    return (
      <NFlex align="center" wrap={false} size="small">
        {typeof icon === 'function' ? icon() : icon}
        <div>{content}</div>
      </NFlex>
    )
  }

  return content
}

const popoverSegmentTab = (option: RSegmentOptions) => {
  if (typeof option.popover === 'string') {
    return (
      <NPopover>
        {{
          trigger: () => iconSegmentTab(option),
          default: () => option.popover,
        }}
      </NPopover>
    )
  }

  if (isValueType<object>(option.popover, 'Object')) {
    const { popover } = option
    const { label, ...parameters } = popover

    return (
      <NPopover {...parameters}>
        {{
          trigger: () => iconSegmentTab(option),
          default: () => label,
        }}
      </NPopover>
    )
  }
}

export default defineComponent({
  name: 'RSegment',
  props,
  setup(props, { expose }) {
    const uncontrolled = ref(
      props.value ?? props.activeName ?? props.defaultValue,
    )
    const selected = computed(
      () =>
        props.value ??
        props.activeName ??
        uncontrolled.value ??
        props.options[0]?.key,
    )
    const tabStop = computed(
      () =>
        props.options.find(
          (option) => option.key === selected.value && !option.disabled,
        )?.key ?? props.options.find((option) => !option.disabled)?.key,
    )
    const cssVars = computed(() => {
      const { width: propsWidth } = props
      let segmentWidthVar: string

      switch (propsWidth) {
        case 'block':
          segmentWidthVar = '100%'

          break

        case 'fitContent':
          segmentWidthVar = 'fit-content'

          break

        default:
          segmentWidthVar =
            typeof propsWidth === 'number'
              ? completeSize(propsWidth)
              : 'fit-content'
      }

      return {
        '--r-segment-width': segmentWidthVar,
      }
    })

    expose()

    return {
      cssVars,
      selected,
      tabStop,
      rememberSelection: (key: string | number) => {
        uncontrolled.value = key
      },
    }
  },
  render() {
    const { $props, options, cssVars, themeOverrides: _themeOverrides } = this
    const { onUpdateValue, ...tabsProps } = $props

    return (
      <NTabs
        {...(tabsProps as TabsProps)}
        value={this.selected}
        {...{ role: 'radiogroup' }}
        onUpdateValue={[onUpdateValue ?? [], this.rememberSelection].flat()}
        style={[cssVars]}
        class={[
          'r-segment',
          { 'r-segment--intrinsic': this.width === 'fitContent' },
        ]}
        type="segment"
        animated
        themeOverrides={Object.assign({}, themeOverrides, _themeOverrides)}
      >
        {options.map((curr) => {
          return (
            <NTab
              key={curr.key}
              name={curr.key}
              {...{
                role: 'radio',
                onKeydown: (event: KeyboardEvent) =>
                  navigateHorizontalChoice(event, $props.trigger),
                tabindex: curr.key === this.tabStop ? 0 : -1,
              }}
              aria-checked={curr.key === this.selected}
              aria-disabled={curr.disabled || void 0}
              tab={() =>
                !curr.popover ? iconSegmentTab(curr) : popoverSegmentTab(curr)
              }
              disabled={curr.disabled}
            >
              {{
                ...curr.slots,
              }}
            </NTab>
          )
        })}
      </NTabs>
    )
  },
})
