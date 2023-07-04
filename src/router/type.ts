/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RouteRecordRaw } from 'vue-router'
import type { Recordable } from '@/types/modules/helper'
import type { DefineComponent, VNode } from 'vue'

export type Component<T = any> =
  | DefineComponent<{}, {}, any>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

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
