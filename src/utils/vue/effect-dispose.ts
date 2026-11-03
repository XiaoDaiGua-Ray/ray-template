import type { AnyFn } from '@/types'
import { getCurrentScope, onScopeDispose } from 'vue'

/**
 *
 * @param fn 作用域销毁时执行的清理函数
 *
 * @returns 是否已在当前作用域登记清理；无作用域时返回 false。
 */
export function effectDispose<T extends AnyFn>(fn: T) {
  if (getCurrentScope()) {
    onScopeDispose(fn)

    return true
  }

  return false
}
