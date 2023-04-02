export {}

import type { ECharts } from 'echarts/core'
import type {
  MessageApi,
  DialogApi,
  LoadingBarApi,
  NotificationApi,
  MenuOption,
  MenuDividerOption,
  MenuGroupOption,
} from 'naive-ui'
import type { VNodeChild } from 'vue'

declare global {
  declare type ComponentSize = 'small' | 'medium' | 'large'

  declare type EChartsInstance = ECharts

  declare type NaiveDrawerPlacement = 'top' | 'right' | 'bottom' | 'left'

  declare type NaiveMenuOptions =
    | MenuOption
    | MenuDividerOption
    | MenuGroupOption
}
