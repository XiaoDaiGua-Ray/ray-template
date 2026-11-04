import type { MaybeArray } from '@ray-template/utils/types'

/**
 *
 * @param funcs 单个回调或按顺序调用的回调数组
 * @param args 传给每个回调的参数
 *
 * @throws 任一回调抛错时立即中断并传播该错误。
 */
export function call<Args extends unknown[]>(
  funcs: MaybeArray<(...args: Args) => void>,
  ...args: Args
): void {
  if (Array.isArray(funcs)) {
    funcs.forEach((fn) => fn(...args))
  } else {
    funcs(...args)
  }
}
