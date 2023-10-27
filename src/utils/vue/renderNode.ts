/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-10-27
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { isValueType } from '@/utils/basic'

import type { VNode, VNodeChild } from 'vue'

export type RenderVNodeType =
  | VNode
  | VNodeChild
  | (() => VNode)
  | string
  | number
  | undefined
  | null
  | JSX.Element

export type DefaultElement = NonNullable<
  Omit<RenderVNodeType, 'string' | 'number'>
>

export interface RenderNodeOptions<T extends DefaultElement> {
  defaultElement?: T
}

export function renderNode<T extends DefaultElement>(
  vnode: RenderVNodeType,
  options?: RenderNodeOptions<T>,
) {
  if (!vnode) {
    const { defaultElement } = options ?? {}

    return typeof defaultElement === 'function'
      ? defaultElement
      : () => defaultElement
  }

  if (typeof vnode === 'string' || isValueType<object>(vnode, 'Object')) {
    return () => vnode
  }

  if (typeof vnode === 'function') {
    return vnode
  }
}
