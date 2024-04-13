/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2024-04-10
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import './index.scss'

import { NTabs, NTab, NPopover, NFlex } from 'naive-ui'

import props from './props'
import { themeOverrides } from './constant'
import { completeSize, isValueType } from '@/utils'

import type { TabsProps } from 'naive-ui'
import type { RSegmentOptions } from './types'

const iconSegmentTab = (option: RSegmentOptions) => {
  const { icon, label } = option

  if (icon) {
    return (
      <NFlex align="center" wrap={false} size="small">
        <icon />
        <div>{label}</div>
      </NFlex>
    )
  }

  return label
}

const popoverSegmentTab = (option: RSegmentOptions) => {
  if (typeof option.popover === 'string') {
    return (
      <NPopover>
        {{
          trigger: iconSegmentTab(option),
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
          trigger: iconSegmentTab(option),
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
    const cssVars = computed(() => {
      const { width: propsWidth } = props
      let segmentWidthVar = ''

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
    }
  },
  render() {
    const { $props, options, cssVars, themeOverrides: _themeOverrides } = this

    return (
      <NTabs
        {...($props as TabsProps)}
        ref="segmentRef"
        style={[cssVars]}
        class="r-segment"
        type="segment"
        animated
        themeOverrides={Object.assign({}, themeOverrides, _themeOverrides)}
      >
        {options.map((curr) => {
          return (
            <NTab
              key={curr.key}
              name={curr.key}
              tab={
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
