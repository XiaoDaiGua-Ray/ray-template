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

import { isValueType } from '@/utils'

import type { VNode, Slot } from 'vue'

export type RenderVNodeType<T = unknown> =
  | VNode
  | (() => VNode)
  | string
  | number
  | undefined
  | null
  | JSX.Element
  | Slot<T>

export type DefaultElement<T = unknown> = NonNullable<
  Omit<RenderVNodeType<T>, 'string' | 'number'>
>

export interface RenderNodeOptions<T extends DefaultElement> {
  defaultElement?: T
}

export type RenderNodeReturn = ReturnType<typeof renderNode>

/**
 *
 * @param vnode 将 jsx element, slot, h, string 等渲染为 vnode
 * @param options 配置项
 *
 * 可以将常见的类型转换为 vnode
 *
 * @example
 * renderNode('hello world') => () => 'hello world'
 * renderNode(<div>hello world</div>) => () => <div>hello world</div>
 * renderNode(() => <div>hello world</div>) => () => <div>hello world</div>
 */
export function renderNode<T extends DefaultElement>(
  vnode: RenderVNodeType,
  options?: RenderNodeOptions<T>,
) {
  if (!vnode) {
    const { defaultElement = null } = options ?? {}

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
