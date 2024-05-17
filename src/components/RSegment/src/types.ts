import type { TabsProps, TabPaneProps, PopoverProps } from 'naive-ui'
import type { OMIT_TABS_PROPS_KEYS } from './constant'
import type { VNode, VNodeChild, ExtractPublicPropTypes } from 'vue'

export type OmitTabsPropsKeys = (typeof OMIT_TABS_PROPS_KEYS)[number]

export interface RSegmentPopover extends ExtractPublicPropTypes<PopoverProps> {
  label: string
}

export interface RSegmentOptions {
  /**
   *
   * @description
   * 分段器内容。
   */
  label: string | VNode | (() => VNodeChild)
  /**
   *
   * @description
   * 分段器的 key 值。
   */
  key: string | number
  /**
   *
   * @description
   * 渲染模式。
   *
   * @see https://www.naiveui.com/zh-CN/dark/components/tabs#TabPane-Props
   */
  displayDirective?: TabPaneProps['displayDirective']
  /**
   *
   * @description
   * 是否禁用。
   */
  disabled?: boolean
  /**
   *
   * @description
   * 自定义渲染内容。
   */
  slots?: {
    default?: () => VNode | string | number
  }
  /**
   *
   * @description
   * popover 弹出提示。
   */
  popover?: string | RSegmentPopover
  /**
   *
   * @description
   * 自定义图标。
   */
  icon?: VNode
}

export type RSegmentWidth = number | 'block' | 'fitContent'

export interface RSegmentProps extends Omit<TabsProps, OmitTabsPropsKeys> {
  options?: RSegmentOptions
  width?: RSegmentWidth
}
