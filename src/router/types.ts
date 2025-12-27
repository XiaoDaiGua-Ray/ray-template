/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Recordable } from '@/types'
import type { TagProps } from 'naive-ui'
import type { DefineComponent, VNode } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

export type Component<T = any> =
  | DefineComponent<{}, {}, any>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

export interface AppMenuExtraOptions {
  /**
   *
   * @description
   * 标签标题。
   */
  label?: string | number
  /**
   *
   * @description
   * 标签图标。
   */
  icon?: VNode
  /**
   *
   * @description
   * 标签渲染类型。
   */
  type?: TagProps['type']
  /**
   *
   * @description
   * 是否显示。
   */
  show?: boolean
  /**
   *
   * @description
   * 标签标题，带有 i18n 国际化切换效果。
   */
  i18nLabel?: string
}

export interface AppRouteMeta {
  /**
   *
   * @description
   * 菜单 i18n 国际化 标题
   */
  i18nKey?: string
  /**
   *
   * @description
   * 菜单图标。
   * 如果配置为 string，则会自动使用 RIcon 尝试获取 icons 包下的图标。
   * VNode 类型，会直接使用传递图标渲染。
   */
  icon?: string | VNode
  /**
   *
   * @description
   * 是否以新窗口打开该菜单。
   */
  windowOpen?: string
  /**
   *
   * @description
   * 权限表，启用则会验证该菜单项是否权限匹配。
   * 并且，该配置项优先级最高。
   */
  role?: (string | number)[]
  /**
   *
   * @description
   * 配置菜单项是否隐藏。
   * 但是，允许被跳转，例如 404, 500 类似页面。
   */
  hidden?: boolean
  /**
   *
   * @description
   * 菜单标题，无需国际化。
   */
  noLocalTitle?: string | number
  /**
   *
   * @description
   * 是否需要在切换菜单的时候，该页面的内容区域置顶。
   * 默认都需要。
   */
  ignoreAutoResetScroll?: boolean
  /**
   *
   * @description
   * 菜单项排序。
   */
  order?: number
  /**
   *
   * @description
   * 页面缓存。
   *
   * 如果缓存会出现失败的情况，请查看该文档排查。
   * @see https://xiaodaigua-ray.github.io/ray-template-doc/ray-template-docs/common-problem/keep-alive.html
   */
  keepAlive?: boolean
  /**
   *
   * @description
   * 配置该页面是否为平级模式。
   * 当配置为 true 的时候，会在跳转至该页面的时候，追加面包屑后再跳转，不会追加 MenuTag。
   */
  sameLevel?: boolean
  /**
   *
   * @description
   * 配置当前菜单项的在什么环境下才会显示。
   * 优先级最低。
   */
  env?: string | string[]
  /**
   *
   * @description
   * 菜单项的额外标签项。
   */
  extra?: AppMenuExtraOptions
}

// @ts-ignore
interface BaseAppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  /**
   *
   * @description
   * 请注意 name 在新版本的 vue-router 中不再推荐被使用为导航。
   *
   * 但是，如果你需要缓存该页面，那么该配置项就一定要配置！
   * 否则，缓存将会失效。
   */
  name?: string
  /**
   *
   * @description
   * 配置当前页面额外信息，用于菜单渲染。
   */
  meta: AppRouteMeta
  /**
   *
   * @description
   * 路由依赖渲染组件。
   * 如果需要嵌套路由，可以考虑使用 LAYOUT 作为父路由组件。
   *
   * @example
   * {
   *   path: '/dashboard',
   *   component: LAYOUT,
   *   children: [ ... ]
   * }
   */
  component?: Component | string
  /**
   *
   * @description
   * 路由依赖渲染组件。
   *
   * @deprecated
   * 不推荐使用。
   */
  components?: Component
  /**
   *
   * @description
   * 嵌套路由。
   */
  children?: AppRouteRecordRaw[]
  /**
   *
   * @description
   * 需要传递给组件的 props。
   */
  props?: Recordable
  /**
   *
   * @description
   * 包括 search 和 hash 在内的完整地址。
   * 该字符串是经过百分号编码的。
   */
  fullPath?: string
}

interface KeepAliveAppRouteRecordRaw extends BaseAppRouteRecordRaw {
  meta: AppRouteMeta & {
    keepAlive: true
  }
  name: string
}

interface NonKeepAliveAppRouteRecordRaw extends BaseAppRouteRecordRaw {
  meta: AppRouteMeta & {
    keepAlive?: false
  }
  name?: string
}

export type AppRouteRecordRaw =
  | KeepAliveAppRouteRecordRaw
  | NonKeepAliveAppRouteRecordRaw

export interface RouteModules {
  [propName: string]: {
    default: AppRouteRecordRaw
  }
}
