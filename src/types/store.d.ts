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
    breadcrumbLabel?: string
    noLocalTitle?: string | number
  }

  declare interface TagMenuOptions extends IMenuOptions {}

  declare type MenuKey = null | string | number
}
