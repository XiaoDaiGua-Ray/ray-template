import type { VNode, VNodeChild } from 'vue'
import type { AppRouteMeta } from './types'

export type Key = string | number

export interface AppMenuOption {
  name: string
  key: Key
  path: string
  label: string | (() => VNode)
  icon?: () => VNodeChild
  show?: boolean
  children?: AppMenuOption[]
  meta: AppRouteMeta
  breadcrumbLabel?: string
  fullPath: string
  extra?: string | (() => VNode)
}

export interface MenuTagOptions extends AppMenuOption {
  closeable?: boolean
  topped?: boolean
  fixed?: boolean
}

export type AppMenuKey = Key | null
