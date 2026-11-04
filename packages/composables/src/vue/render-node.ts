import type { Slot, VNode } from 'vue'

export type RenderVNodeType<T = unknown> =
  VNode | (() => VNode) | string | number | undefined | null | Slot<T>

export type DefaultElement<T = unknown> = NonNullable<RenderVNodeType<T>>

export interface RenderNodeOptions<T extends DefaultElement> {
  defaultElement?: T
}

type SimpleRenderNode = Exclude<RenderVNodeType, Slot>

/**
 *
 * @param vnode VNode、文本、数字或渲染回调
 * @param options 空节点的回退内容
 *
 * @returns 渲染函数；零和空字符串按原值渲染。
 */
export function renderNode<T extends NonNullable<SimpleRenderNode>>(
  vnode: SimpleRenderNode,
  options?: RenderNodeOptions<T>,
): () => VNode | string | number | null
export function renderNode<T extends DefaultElement>(
  vnode: RenderVNodeType,
  options?: RenderNodeOptions<T>,
): RenderNodeType
export function renderNode<T extends DefaultElement>(
  vnode: RenderVNodeType,
  options?: RenderNodeOptions<T>,
) {
  const node = vnode ?? options?.defaultElement ?? null

  return typeof node === 'function' ? node : () => node
}

type RenderNodeType = (() => VNode | string | number | null) | Slot

export type RenderNodeReturn = ReturnType<typeof renderNode>
