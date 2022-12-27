export {}

import type { RouteRecordRaw } from 'vue-router'
import type { MenuOption } from 'naive-ui'
import type { VNode } from 'vue'

declare global {
  declare interface IMenuOptions extends MenuOption, RouteRecordRaw {
    key: string | number
    path: string
    label: string | Function
  }

  declare interface TagMenuOptions extends IMenuOptions {}
}
