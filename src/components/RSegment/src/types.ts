import type { TabsProps, TabPaneProps, PopoverProps } from 'naive-ui'
import type { OMIT_TABS_PROPS_KEYS } from './constant'
import type { VNode, VNodeChild, ExtractPublicPropTypes } from 'vue'

export type OmitTabsPropsKeys = (typeof OMIT_TABS_PROPS_KEYS)[number]

export interface RSegmentPopover extends ExtractPublicPropTypes<PopoverProps> {
  label: string
}

export interface RSegmentOptions {
  label: string | VNode | (() => VNodeChild)
  key: string | number
  displayDirective?: TabPaneProps['displayDirective']
  disabled?: boolean
  slots?: {
    default?: () => VNode | string | number
  }
  popover?: string | RSegmentPopover
  icon?: VNode
}

export type RSegmentWidth = number | 'block' | 'fitContent'

export interface RSegmentProps extends Omit<TabsProps, OmitTabsPropsKeys> {
  options?: RSegmentOptions
  width?: RSegmentWidth
}
