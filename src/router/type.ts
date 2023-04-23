/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RouteRecordRaw } from 'vue-router'
import type { Recordable } from '@/types/type-utils'

export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

export interface AppRouteMeta extends IUnknownObjectKey {
  i18nKey?: string
  icon?: string
  windowOpen?: string
  role?: string[]
  hidden?: boolean
  noLocalTitle?: string | number
  ignoreResetScroll?: boolean
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
