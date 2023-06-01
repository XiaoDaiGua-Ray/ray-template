export {}

import type { RouteRecordRaw, RouteMeta } from 'vue-router'
import type { MenuOption } from 'naive-ui'
import type { VNode } from 'vue'
import type { AppRouteRecordRaw, AppRouteMeta } from '@/router/type'

declare global {
  declare interface IMenuOptions extends AppRouteRecordRaw, MenuOption {
    name: string
    key: string | number
    path: string
    label: string | Function
    show?: boolean
    children?: IMenuOptions[]
    meta: AppRouteMeta
    breadcrumbLabel?: string
    noLocalTitle?: string | number
  }

  declare interface MenuTagOptions extends IMenuOptions {}

  declare type MenuKey = null | string | number
}
