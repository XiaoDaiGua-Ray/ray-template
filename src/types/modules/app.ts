import type { VNode } from 'vue'
import type { AppRouteRecordRaw, AppRouteMeta } from '@/router/type'

export type Key = string | number

export interface AppMenuOption extends AppRouteRecordRaw {
  name: string
  key: Key
  path: string
  label: string | (() => VNode)
  show?: boolean
  children?: AppMenuOption[]
  meta: AppRouteMeta
  breadcrumbLabel?: string
}

export interface MenuTagOptions extends AppMenuOption {
  closeable?: boolean
}

export type AppMenuKey = Key | null
