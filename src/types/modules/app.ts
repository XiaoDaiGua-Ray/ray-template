import type { AppRouteMeta } from '@/router/types'
import type { VNode } from 'vue'

export type Key = string | number

export interface AppMenuOption {
  name: string
  key: Key
  path: string
  label: string | (() => VNode)
  show?: boolean
  children?: AppMenuOption[]
  meta: AppRouteMeta
  breadcrumbLabel?: string
  fullPath: string
  extra?: string | (() => VNode)
}

export interface MenuTagOptions extends AppMenuOption {
  closeable?: boolean
}

export type AppMenuKey = Key | null
