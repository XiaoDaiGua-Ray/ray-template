/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RouteRecordRaw } from 'vue-router'
import type { Recordable } from '@/types'
import type { DefineComponent, VNode } from 'vue'
import type { TagProps } from 'naive-ui'

export type Component<T = any> =
  | DefineComponent<{}, {}, any>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

export interface AppMenuExtraOptions {
  label?: string | number
  icon?: VNode
  type?: TagProps['type']
  show?: boolean
  i18nLabel?: string
}

export interface AppRouteMeta {
  i18nKey?: string
  icon?: string | VNode
  windowOpen?: string
  role?: (string | number)[]
  hidden?: boolean
  noLocalTitle?: string | number
  ignoreAutoResetScroll?: boolean
  order?: number
  keepAlive?: boolean
  sameLevel?: boolean
  env?: string | string[]
  extra?: AppMenuExtraOptions
}

// @ts-ignore
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  name: string
  meta: AppRouteMeta
  component?: Component | string
  components?: Component
  children?: AppRouteRecordRaw[]
  props?: Recordable
  fullPath?: string
}

export interface RouteModules {
  [propName: string]: {
    default: AppRouteRecordRaw
  }
}
