export {}

import type { RouteRecordRaw, RouteMeta } from 'vue-router'
import type { MenuOption } from 'naive-ui'
import type { VNode } from 'vue'

declare global {
  declare interface IMenuOptions extends RouteRecordRaw, MenuOption {
    name: string
    key: string | number
    path: string
    label: string | Function
    show?: boolean
    children?: IMenuOptions[]
    meta?: RouteMeta
  }

  declare interface TagMenuOptions extends IMenuOptions {}
}
